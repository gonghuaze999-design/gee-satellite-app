/**
 * Google Earth Engine 后端服务
 * 用于处理数据导出任务
 */

import { spawn } from 'child_process';
import path from 'path';

const VENV_PYTHON = path.join(process.cwd(), 'venv', 'bin', 'python');

interface ExportTaskParams {
  imageId: string;
  region: any;
  scale?: number;
  description?: string;
  folder?: string;
}

interface ExportTaskResult {
  taskId: string;
  status: string;
}

/**
 * 执行Python脚本
 */
function executePythonScript(scriptPath: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const python = spawn(VENV_PYTHON, [scriptPath, ...args]);
    
    let stdout = '';
    let stderr = '';
    
    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * 创建导出任务
 */
export async function createExportTask(params: ExportTaskParams): Promise<ExportTaskResult> {
  const scriptPath = path.join(process.cwd(), 'server', 'scripts', 'export_image.py');
  const argsJson = JSON.stringify(params);
  
  try {
    const result = await executePythonScript(scriptPath, [argsJson]);
    return JSON.parse(result);
  } catch (error) {
    console.error('Failed to create export task:', error);
    throw error;
  }
}

/**
 * 检查任务状态
 */
export async function checkTaskStatus(taskId: string): Promise<any> {
  const scriptPath = path.join(process.cwd(), 'server', 'scripts', 'check_task.py');
  
  try {
    const result = await executePythonScript(scriptPath, [taskId]);
    return JSON.parse(result);
  } catch (error) {
    console.error('Failed to check task status:', error);
    throw error;
  }
}
