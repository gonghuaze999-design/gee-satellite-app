import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Trash2, Upload, Download, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Area {
  id?: string;
  areaName: string;
  areaType: 'polygon' | 'rectangle' | 'circle';
  description?: string;
  isFavorite?: boolean;
  usageCount?: number;
  geometry?: any;
}

interface AreaManagerProps {
  areas?: Area[];
  onAreaLoad?: (area: Area) => void;
  onAreaDelete?: (areaId: string) => void;
  onAreaToggleFavorite?: (areaId: string) => void;
  onAreaImport?: (areas: Area[]) => void;
}

export function AreaManager({
  areas = [],
  onAreaLoad,
  onAreaDelete,
  onAreaToggleFavorite,
  onAreaImport,
}: AreaManagerProps) {
  const [searchText, setSearchText] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // 过滤区域
  const filteredAreas = areas.filter((area) => {
    const matchesSearch = area.areaName.toLowerCase().includes(searchText.toLowerCase());
    const matchesFavorite = !showOnlyFavorites || area.isFavorite;
    return matchesSearch && matchesFavorite;
  });

  // 加载区域
  const handleLoadArea = useCallback((area: Area) => {
    if (onAreaLoad) {
      onAreaLoad(area);
    }
    toast.success(`已加载区域: ${area.areaName}`);
  }, [onAreaLoad]);

  // 删除区域
  const handleDeleteArea = useCallback((areaId: string | undefined) => {
    if (!areaId) return;
    if (onAreaDelete) {
      onAreaDelete(areaId);
    }
    toast.success('区域已删除');
  }, [onAreaDelete]);

  // 切换收藏
  const handleToggleFavorite = useCallback((areaId: string | undefined) => {
    if (!areaId) return;
    if (onAreaToggleFavorite) {
      onAreaToggleFavorite(areaId);
    }
    toast.success('已更新收藏状态');
  }, [onAreaToggleFavorite]);

  // 导出区域
  const handleExportAreas = useCallback(() => {
    if (areas.length === 0) {
      toast.error('没有可导出的区域');
      return;
    }

    const dataStr = JSON.stringify(areas, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', 'areas.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('区域已导出');
  }, [areas]);

  // 导入区域
  const handleImportAreas = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const importedAreas = JSON.parse(event.target.result);
          if (Array.isArray(importedAreas) && onAreaImport) {
            onAreaImport(importedAreas);
            toast.success(`已导入 ${importedAreas.length} 个区域`);
          }
        } catch (error) {
          toast.error('导入失败，请检查文件格式');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [onAreaImport]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          区域管理
        </CardTitle>
        <CardDescription>管理和快速加载保存的区域</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 搜索和过滤 */}
        <div className="space-y-3">
          <Input
            placeholder="搜索区域..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorites"
              checked={showOnlyFavorites}
              onCheckedChange={(checked) => setShowOnlyFavorites(checked as boolean)}
            />
            <label htmlFor="favorites" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              只显示收藏
            </label>
          </div>
        </div>

        {/* 区域列表 */}
        {filteredAreas.length > 0 ? (
          <ScrollArea className="h-[300px] border rounded-lg p-3">
            <div className="space-y-2">
              {filteredAreas.map((area) => (
                <div
                  key={area.id}
                  className="p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{area.areaName}</p>
                      <p className="text-xs text-muted-foreground">
                        {area.areaType} • 使用次数: {area.usageCount || 0}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleFavorite(area.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          area.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                        }`}
                      />
                    </Button>
                  </div>
                  {area.description && (
                    <p className="text-xs text-muted-foreground mb-2">{area.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadArea(area)}
                      className="flex-1 text-xs"
                    >
                      加载
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteArea(area.id)}
                      className="flex-1 text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-[300px] border rounded-lg flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {areas.length === 0 ? '暂无保存的区域' : '没有匹配的区域'}
            </p>
          </div>
        )}

        {/* 导入导出按钮 */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={handleExportAreas}
            variant="outline"
            className="flex-1"
            disabled={areas.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button
            onClick={handleImportAreas}
            variant="outline"
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            导入
          </Button>
        </div>

        {/* 提示信息 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            💡 保存常用的搜索区域，快速加载进行重复分析。支持导入导出区域数据。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
