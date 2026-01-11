import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { QueryStatus } from '@/hooks/useAsyncQuery';

interface QueryProgressProps {
  status: QueryStatus | null;
  isLoading: boolean;
  onCancel?: () => void;
}

export function QueryProgress({ status, isLoading, onCancel }: QueryProgressProps) {
  if (!status) return null;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}分${seconds % 60}秒`;
    }
    return `${seconds}秒`;
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
      case 'timeout':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'pending':
        return '等待处理中...';
      case 'processing':
        return '正在查询...';
      case 'completed':
        return '查询完成';
      case 'failed':
        return '查询失败';
      case 'timeout':
        return '查询超时';
      case 'not_found':
        return '任务不存在';
      default:
        return '未知状态';
    }
  };

  const progressPercent = status.progress
    ? Math.min(100, (status.progress.current / status.progress.total) * 100)
    : 0;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-lg">{getStatusText()}</h3>
            {status.progress && (
              <p className="text-sm text-gray-600">
                {status.progress.message}
              </p>
            )}
          </div>
        </div>
        {isLoading && onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            取消
          </button>
        )}
      </div>

      {/* 进度条 */}
      {status.status === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>进度</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

      {/* 时间信息 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">已用时间</p>
          <p className="font-semibold">{formatTime(status.elapsedTime)}</p>
        </div>
        {status.status === 'processing' && status.estimatedRemainingTime > 0 && (
          <div>
            <p className="text-gray-600">预计剩余</p>
            <p className="font-semibold">{formatTime(status.estimatedRemainingTime)}</p>
          </div>
        )}
      </div>

      {/* 错误信息 */}
      {status.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <p className="font-semibold">错误</p>
          <p>{status.error}</p>
        </div>
      )}

      {/* 日志信息 */}
      {status.logs.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-600">实时日志</p>
          <div className="bg-gray-50 border border-gray-200 rounded p-3 max-h-40 overflow-y-auto text-xs font-mono text-gray-700 space-y-1">
            {status.logs.slice(-10).map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* 结果摘要 */}
      {status.status === 'completed' && status.result && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
          <p className="font-semibold text-green-900">查询成功</p>
          <p className="text-green-800">{status.result.message}</p>
          {status.result.total && (
            <p className="text-green-800 mt-1">
              共找到 <span className="font-bold">{status.result.total}</span> 张卫星影像
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
