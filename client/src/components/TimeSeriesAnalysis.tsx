import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, Play, DownloadCloud, Trash2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TimeSeriesAnalysisProps {
  onAnalysisCreate?: (analysis: any) => void;
  onAnalysisDelete?: (analysisId: number) => void;
  analyses?: any[];
}

export function TimeSeriesAnalysis({ onAnalysisCreate, onAnalysisDelete, analyses = [] }: TimeSeriesAnalysisProps) {
  const [analysisName, setAnalysisName] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(new Date().getFullYear() - 1, 0, 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [timeStep, setTimeStep] = useState('monthly');
  const [analysisType, setAnalysisType] = useState('ndvi');
  const [selectedAnalysis, setSelectedAnalysis] = useState<number | null>(null);

  // 创建分析任务
  const handleCreateAnalysis = useCallback(() => {
    if (!analysisName.trim()) {
      toast.error('请输入分析任务名称');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('开始日期必须早于结束日期');
      return;
    }

    const analysis = {
      analysisName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      timeStep,
      analysisType,
      status: 'pending',
      createdAt: new Date(),
    };

    if (onAnalysisCreate) {
      onAnalysisCreate(analysis);
    }

    setAnalysisName('');
    toast.success('分析任务已创建');
  }, [analysisName, startDate, endDate, timeStep, analysisType, onAnalysisCreate]);

  // 删除分析任务
  const handleDeleteAnalysis = useCallback((analysisId: number) => {
    if (onAnalysisDelete) {
      onAnalysisDelete(analysisId);
    }
    toast.success('分析任务已删除');
  }, [onAnalysisDelete]);

  // 播放分析
  const handlePlayAnalysis = useCallback((analysis: any) => {
    toast.info(`正在播放 ${analysis.analysisName} 的时间序列动画...`);
  }, []);

  // 导出分析结果
  const handleExportAnalysis = useCallback((analysis: any) => {
    toast.info(`正在导出 ${analysis.analysisName} 的分析结果...`);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          时间序列分析
        </CardTitle>
        <CardDescription>监测植被变化、城市扩张等动态过程</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 创建新分析 */}
        <div className="space-y-4 pb-4 border-b">
          <div>
            <label className="text-sm font-medium mb-2 block">分析任务名称</label>
            <Input
              placeholder="例如: 2023年植被变化监测"
              value={analysisName}
              onChange={(e) => setAnalysisName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">开始日期</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">结束日期</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">时间步长</label>
              <Select value={timeStep} onValueChange={setTimeStep}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">每日</SelectItem>
                  <SelectItem value="weekly">每周</SelectItem>
                  <SelectItem value="monthly">每月</SelectItem>
                  <SelectItem value="seasonal">季节</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">分析类型</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ndvi">NDVI (植被指数)</SelectItem>
                  <SelectItem value="ndwi">NDWI (水体指数)</SelectItem>
                  <SelectItem value="nbr">NBR (燃烧指数)</SelectItem>
                  <SelectItem value="custom">自定义</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleCreateAnalysis} className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            创建分析任务
          </Button>
        </div>

        {/* 分析历史 */}
        {analyses.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">分析历史</h3>
            <div className="space-y-2">
              {analyses.map((analysis, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnalysis === index
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedAnalysis(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{analysis.analysisName}</p>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded">
                      {analysis.analysisType.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {format(new Date(analysis.startDate), 'yyyy-MM-dd')} 至 {format(new Date(analysis.endDate), 'yyyy-MM-dd')} ({analysis.timeStep})
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAnalysis(analysis);
                      }}
                      className="flex-1 text-xs"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      播放
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportAnalysis(analysis);
                      }}
                      className="flex-1 text-xs"
                    >
                      <DownloadCloud className="h-3 w-3 mr-1" />
                      导出
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnalysis(index);
                      }}
                      className="flex-1 text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      删除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 提示信息 */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <p className="text-xs text-amber-900 dark:text-amber-100">
            💡 时间序列分析可用于监测植被变化趋势、城市扩张过程等长期地表变化。分析结果将以动画形式展示。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
