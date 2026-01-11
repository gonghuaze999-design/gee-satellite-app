import { useEffect, useState, useCallback, useRef } from 'react';
import { trpc } from '@/lib/trpc';

export interface QueryStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'timeout' | 'not_found';
  progress?: { current: number; total: number; message: string };
  result?: any;
  error?: string;
  logs: string[];
  estimatedRemainingTime: number;
  elapsedTime: number;
}

interface UseAsyncQueryOptions {
  taskId: string | null;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  maxWaitTime?: number;
}

export function useAsyncQuery(options: UseAsyncQueryOptions) {
  const { taskId, onComplete, onError, maxWaitTime = 15 * 60 * 1000 } = options;
  const [status, setStatus] = useState<QueryStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastProgressRef = useRef<number>(0);
  const noProgressCountRef = useRef<number>(0);
  const isMountedRef = useRef(true);

  const getQueryStatus = trpc.gee.getQueryStatus.useMutation();

  const poll = useCallback(async () => {
    if (!taskId || !isMountedRef.current) return;

    try {
      const result = await getQueryStatus.mutateAsync({ taskId });
      
      if (!isMountedRef.current) return;
      
      setStatus(result as QueryStatus);

      if (result.status === 'completed') {
        setIsLoading(false);
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (onComplete) onComplete(result.result);
        return;
      }

      if (result.status === 'failed' || result.status === 'timeout') {
        setIsLoading(false);
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (onError) onError(result.error || '查询失败');
        return;
      }

      const currentProgress = result.progress?.current || 0;
      if (currentProgress === lastProgressRef.current) {
        noProgressCountRef.current++;
      } else {
        noProgressCountRef.current = 0;
        lastProgressRef.current = currentProgress;
      }

      let nextPollInterval = 2000;
      if (noProgressCountRef.current > 5) nextPollInterval = 5000;
      if (noProgressCountRef.current > 10) nextPollInterval = 10000;
      if (noProgressCountRef.current > 20) nextPollInterval = 30000;

      const elapsedTime = Date.now() - (startTimeRef.current || Date.now());
      if (elapsedTime > maxWaitTime) {
        setIsLoading(false);
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (onError) onError('查询超时');
        return;
      }

      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (isMountedRef.current) {
        pollIntervalRef.current = setInterval(poll, nextPollInterval);
      }
    } catch (error: any) {
      console.error('轮询失败:', error);
    }
  }, [taskId, getQueryStatus, onComplete, onError, maxWaitTime]);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!taskId) {
      setStatus(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    startTimeRef.current = Date.now();
    lastProgressRef.current = 0;
    noProgressCountRef.current = 0;

    poll();

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [taskId]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const cancel = useCallback(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setIsLoading(false);
    setStatus(null);
  }, []);

  return {
    status,
    isLoading,
    cancel,
  };
}
