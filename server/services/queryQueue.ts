import { v4 as uuidv4 } from 'uuid';

export type QueryStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'timeout';

export interface QueryTask {
  id: string;
  status: QueryStatus;
  startTime: number;
  endTime?: number;
  params: {
    startDate: string;
    endDate: string;
    maxCloudCover: number;
    geometry?: any;
    province?: string;
    city?: string;
    district?: string;
  };
  result?: any;
  error?: string;
  progress?: {
    current: number;
    total: number;
    message: string;
  };
  logs: string[];
}

class QueryQueueManager {
  private tasks: Map<string, QueryTask> = new Map();
  private readonly MAX_TASK_AGE = 15 * 60 * 1000; // 15分钟
  private readonly CLEANUP_INTERVAL = 60 * 1000; // 每分钟清理一次

  constructor() {
    // 定期清理过期任务
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  /**
   * 创建新的查询任务
   */
  createTask(params: QueryTask['params']): string {
    const id = uuidv4();
    const task: QueryTask = {
      id,
      status: 'pending',
      startTime: Date.now(),
      params,
      logs: [],
    };
    this.tasks.set(id, task);
    console.log(`[QueryQueue] 创建任务: ${id}`);
    return id;
  }

  /**
   * 获取任务状态
   */
  getTask(id: string): QueryTask | null {
    return this.tasks.get(id) || null;
  }

  /**
   * 更新任务状态为处理中
   */
  setProcessing(id: string): void {
    const task = this.tasks.get(id);
    if (task) {
      task.status = 'processing';
      console.log(`[QueryQueue] 任务开始处理: ${id}`);
    }
  }

  /**
   * 添加日志
   */
  addLog(id: string, log: string): void {
    const task = this.tasks.get(id);
    if (task) {
      task.logs.push(`[${new Date().toISOString()}] ${log}`);
    }
  }

  /**
   * 更新进度
   */
  setProgress(id: string, current: number, total: number, message: string): void {
    const task = this.tasks.get(id);
    if (task) {
      task.progress = { current, total, message };
    }
  }

  /**
   * 标记任务完成
   */
  setCompleted(id: string, result: any): void {
    const task = this.tasks.get(id);
    if (task) {
      task.status = 'completed';
      task.result = result;
      task.endTime = Date.now();
      console.log(`[QueryQueue] 任务完成: ${id}`);
    }
  }

  /**
   * 标记任务失败
   */
  setFailed(id: string, error: string): void {
    const task = this.tasks.get(id);
    if (task) {
      task.status = 'failed';
      task.error = error;
      task.endTime = Date.now();
      console.log(`[QueryQueue] 任务失败: ${id}, 错误: ${error}`);
    }
  }

  /**
   * 标记任务超时
   */
  setTimeout(id: string): void {
    const task = this.tasks.get(id);
    if (task) {
      task.status = 'timeout';
      task.error = '查询超时（超过15分钟）';
      task.endTime = Date.now();
      console.log(`[QueryQueue] 任务超时: ${id}`);
    }
  }

  /**
   * 获取任务的预计剩余时间（毫秒）
   */
  getEstimatedRemainingTime(id: string): number {
    const task = this.tasks.get(id);
    if (!task) return 0;

    if (task.status === 'completed' || task.status === 'failed' || task.status === 'timeout') {
      return 0;
    }

    // 基于已经过去的时间估计
    const elapsed = Date.now() - task.startTime;
    // 假设平均查询时间为5分钟，根据已经过去的时间线性估计
    const estimatedTotal = 5 * 60 * 1000;
    const remaining = Math.max(0, estimatedTotal - elapsed);
    return remaining;
  }

  /**
   * 清理过期任务
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    const idsToDelete: string[] = [];

    this.tasks.forEach((task, id) => {
      const age = now - task.startTime;

      // 检查超时
      if (task.status === 'processing' && age > this.MAX_TASK_AGE) {
        this.setTimeout(id);
        cleanedCount++;
      }

      // 删除已完成/失败/超时的旧任务（保留1小时）
      if ((task.status === 'completed' || task.status === 'failed' || task.status === 'timeout') && age > 60 * 60 * 1000) {
        idsToDelete.push(id);
        cleanedCount++;
      }
    });

    // 删除标记的任务
    idsToDelete.forEach(id => this.tasks.delete(id));

    if (cleanedCount > 0) {
      console.log(`[QueryQueue] 清理了 ${cleanedCount} 个过期任务`);
    }
  }

  /**
   * 获取所有活跃任务
   */
  getActiveTasks(): QueryTask[] {
    const result: QueryTask[] = [];
    this.tasks.forEach(task => {
      if (task.status === 'pending' || task.status === 'processing') {
        result.push(task);
      }
    });
    return result;
  }
}

// 全局单例
export const queryQueue = new QueryQueueManager();
