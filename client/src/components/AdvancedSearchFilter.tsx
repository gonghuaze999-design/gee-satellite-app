import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Filter, RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AdvancedSearchFilterProps {
  onFilterChange?: (filters: any) => void;
  onSaveFilter?: (filterName: string, filters: any) => void;
}

export function AdvancedSearchFilter({ onFilterChange, onSaveFilter }: AdvancedSearchFilterProps) {
  const [cloudCoverMax, setCloudCoverMax] = useState(30);
  const [sensorType, setSensorType] = useState('');
  const [qualityMin, setQualityMin] = useState(0);
  const [ndviMin, setNdviMin] = useState(-1);
  const [ndviMax, setNdviMax] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // 应用过滤
  const handleApplyFilter = useCallback(() => {
    const filters = {
      cloudCoverMax,
      sensorType,
      qualityMin,
      ndviMin,
      ndviMax,
    };

    if (onFilterChange) {
      onFilterChange(filters);
    }

    toast.success('过滤条件已应用');
  }, [cloudCoverMax, sensorType, qualityMin, ndviMin, ndviMax, onFilterChange]);

  // 重置过滤
  const handleResetFilter = useCallback(() => {
    setCloudCoverMax(30);
    setSensorType('');
    setQualityMin(0);
    setNdviMin(-1);
    setNdviMax(1);
    setFilterName('');

    if (onFilterChange) {
      onFilterChange({
        cloudCoverMax: 30,
        sensorType: '',
        qualityMin: 0,
        ndviMin: -1,
        ndviMax: 1,
      });
    }

    toast.info('过滤条件已重置');
  }, [onFilterChange]);

  // 保存过滤条件
  const handleSaveFilter = useCallback(() => {
    if (!filterName.trim()) {
      toast.error('请输入过滤条件名称');
      return;
    }

    const filters = {
      cloudCoverMax,
      sensorType,
      qualityMin,
      ndviMin,
      ndviMax,
    };

    if (onSaveFilter) {
      onSaveFilter(filterName, filters);
    }

    setFilterName('');
    setShowSaveDialog(false);
    toast.success('过滤条件已保存');
  }, [filterName, cloudCoverMax, sensorType, qualityMin, ndviMin, ndviMax, onSaveFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          高级搜索过滤
        </CardTitle>
        <CardDescription>多维度过滤卫星影像</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 云量百分比 */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            最大云量: {cloudCoverMax}%
          </label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[cloudCoverMax]}
            onValueChange={(value) => setCloudCoverMax(value[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">
            只显示云量不超过 {cloudCoverMax}% 的影像
          </p>
        </div>

        {/* 传感器类型 */}
        <div>
          <label className="text-sm font-medium mb-2 block">传感器类型</label>
          <Select value={sensorType} onValueChange={setSensorType}>
            <SelectTrigger>
              <SelectValue placeholder="选择传感器" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部</SelectItem>
              <SelectItem value="MSI">Sentinel-2 MSI</SelectItem>
              <SelectItem value="OLI">Landsat 8 OLI</SelectItem>
              <SelectItem value="ETM">Landsat 7 ETM+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 影像质量 */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            最低质量评分: {qualityMin}
          </label>
          <Slider
            min={0}
            max={100}
            step={5}
            value={[qualityMin]}
            onValueChange={(value) => setQualityMin(value[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">
            只显示质量评分不低于 {qualityMin} 的影像
          </p>
        </div>

        {/* NDVI范围 */}
        <div className="space-y-3">
          <label className="text-sm font-medium block">NDVI范围</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">最小值</label>
              <Input
                type="number"
                min={-1}
                max={1}
                step={0.1}
                value={ndviMin}
                onChange={(e) => setNdviMin(parseFloat(e.target.value))}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">最大值</label>
              <Input
                type="number"
                min={-1}
                max={1}
                step={0.1}
                value={ndviMax}
                onChange={(e) => setNdviMax(parseFloat(e.target.value))}
                className="text-sm"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            NDVI范围: {ndviMin.toFixed(2)} ~ {ndviMax.toFixed(2)}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleApplyFilter}
            className="flex-1"
          >
            <Filter className="h-4 w-4 mr-2" />
            应用过滤
          </Button>
          <Button
            onClick={handleResetFilter}
            variant="outline"
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            重置
          </Button>
        </div>

        {/* 保存过滤条件 */}
        <div className="border-t pt-4">
          {showSaveDialog ? (
            <div className="space-y-3">
              <Input
                placeholder="输入过滤条件名称"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveFilter}
                  size="sm"
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
                <Button
                  onClick={() => setShowSaveDialog(false)}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowSaveDialog(true)}
              variant="outline"
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              保存为预设方案
            </Button>
          )}
        </div>

        {/* 提示信息 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            💡 使用多维度过滤器快速定位最优影像。所有过滤条件可组合使用。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
