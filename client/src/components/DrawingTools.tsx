import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface DrawingToolsProps {
  map: google.maps.Map | null;
  onDrawingComplete?: (geometry: any) => void;
  onDrawingCleared?: () => void;
}

export function DrawingTools({ map, onDrawingComplete, onDrawingCleared }: DrawingToolsProps) {
  const drawingManagerRef = useRef<any>(null);
  const drawnShapesRef = useRef<google.maps.Polygon | google.maps.Rectangle | google.maps.Circle | google.maps.Marker | null>(null);
  const [drawingMode, setDrawingMode] = useState<string | null>(null);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [geometryInfo, setGeometryInfo] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化Drawing Manager - 只在map准备好且Drawing库已加载时执行
  useEffect(() => {
    if (!map || isInitialized || drawingManagerRef.current) return;

    // 检查Drawing库是否已加载
    if (!window.google?.maps?.drawing) {
      console.warn('Drawing library not loaded yet');
      return;
    }

    try {
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
          fillColor: '#667eea',
          fillOpacity: 0.3,
          strokeColor: '#667eea',
          strokeWeight: 2,
          editable: true,
          draggable: true,
        },
        rectangleOptions: {
          fillColor: '#667eea',
          fillOpacity: 0.3,
          strokeColor: '#667eea',
          strokeWeight: 2,
          editable: true,
          draggable: true,
        },
        circleOptions: {
          fillColor: '#667eea',
          fillOpacity: 0.3,
          strokeColor: '#667eea',
          strokeWeight: 2,
          editable: true,
          draggable: true,
        },
        markerOptions: {
          draggable: true,
        },
      });

      // 设置地图 - 确保map是有效的Map实例
      if (map && map instanceof google.maps.Map) {
        drawingManager.setMap(map);
        drawingManagerRef.current = drawingManager;
        setIsInitialized(true);

        // 监听绘制完成事件
        window.google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
          handleDrawingComplete(event);
        });

        console.log('Drawing Manager initialized successfully');
      } else {
        console.error('Invalid map instance');
      }
    } catch (error) {
      console.error('Failed to initialize Drawing Manager:', error);
    }
  }, [map, isInitialized]);

  // 处理绘制完成
  const handleDrawingComplete = useCallback((event: any) => {
    try {
      // 删除之前的图形
      if (drawnShapesRef.current) {
        drawnShapesRef.current.setMap(null);
      }

      const shape = event.overlay;
      drawnShapesRef.current = shape;
      setHasDrawing(true);

      // 禁用绘制模式
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
      setDrawingMode(null);

      // 获取几何信息
      let geometry: any = null;
      let info = '';

      if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
        const paths = shape.getPaths();
        const coordinates: Array<{lat: number; lng: number}> = [];
        paths.forEach((path: any) => {
          path.forEach((latLng: any) => {
            coordinates.push({
              lat: latLng.lat(),
              lng: latLng.lng(),
            });
          });
        });
        geometry = { type: 'polygon', coordinates };
        info = `多边形 - ${coordinates.length} 个顶点`;
      } else if (event.type === window.google.maps.drawing.OverlayType.RECTANGLE) {
        const bounds = shape.getBounds();
        geometry = {
          type: 'rectangle',
          bounds: {
            north: bounds.getNorthEast().lat(),
            south: bounds.getSouthWest().lat(),
            east: bounds.getNorthEast().lng(),
            west: bounds.getSouthWest().lng(),
          },
        };
        info = `矩形 - 坐标范围已设置`;
      } else if (event.type === window.google.maps.drawing.OverlayType.CIRCLE) {
        const center = shape.getCenter();
        const radius = shape.getRadius();
        geometry = {
          type: 'circle',
          center: {
            lat: center.lat(),
            lng: center.lng(),
          },
          radius,
        };
        info = `圆形 - 半径: ${(radius / 1000).toFixed(2)} km`;
      } else if (event.type === window.google.maps.drawing.OverlayType.MARKER) {
        const position = shape.getPosition();
        geometry = {
          type: 'marker',
          position: {
            lat: position.lat(),
            lng: position.lng(),
          },
        };
        info = `标记 - 已设置`;
      }

      setGeometryInfo(info);
      if (onDrawingComplete) {
        onDrawingComplete(geometry);
      }

      toast.success('绘制完成！');
    } catch (error) {
      console.error('Error handling drawing complete:', error);
      toast.error('绘制处理出错');
    }
  }, [onDrawingComplete]);

  // 设置绘制模式
  const setMode = useCallback((mode: string | null) => {
    if (!drawingManagerRef.current) {
      toast.error('绘制工具未初始化');
      return;
    }

    try {
      if (mode === drawingMode) {
        drawingManagerRef.current.setDrawingMode(null);
        setDrawingMode(null);
      } else {
        const modeMap: Record<string, any> = {
          polygon: window.google?.maps?.drawing?.OverlayType?.POLYGON,
          rectangle: window.google?.maps?.drawing?.OverlayType?.RECTANGLE,
          circle: window.google?.maps?.drawing?.OverlayType?.CIRCLE,
          marker: window.google?.maps?.drawing?.OverlayType?.MARKER,
        };
        if (drawingManagerRef.current && mode && mode in modeMap) {
          drawingManagerRef.current.setDrawingMode(modeMap[mode as keyof typeof modeMap]);
          setDrawingMode(mode);
          toast.info(`已启用${mode === 'polygon' ? '多边形' : mode === 'rectangle' ? '矩形' : mode === 'circle' ? '圆形' : '标记'}绘制模式`);
        }
      }
    } catch (error) {
      console.error('Error setting drawing mode:', error);
      toast.error('切换绘制模式失败');
    }
  }, [drawingMode]);

  // 清除绘制
  const clearDrawing = useCallback(() => {
    try {
      if (drawnShapesRef.current) {
        drawnShapesRef.current.setMap(null);
        drawnShapesRef.current = null;
      }
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
      setDrawingMode(null);
      setHasDrawing(false);
      setGeometryInfo('');
      if (onDrawingCleared) {
        onDrawingCleared();
      }
      toast.info('已清除绘制内容');
    } catch (error) {
      console.error('Error clearing drawing:', error);
      toast.error('清除绘制内容失败');
    }
  }, [onDrawingCleared]);

  // 导出几何数据
  const exportGeometry = useCallback(() => {
    if (!geometryInfo || !drawnShapesRef.current) {
      toast.error('请先绘制区域');
      return;
    }

    try {
      let data: any = null;

      if (drawnShapesRef.current instanceof google.maps.Polygon) {
        const paths = (drawnShapesRef.current as google.maps.Polygon).getPaths();
        const coordinates: Array<[number, number]> = [];
        paths.forEach((path: any) => {
          path.forEach((latLng: any) => {
            coordinates.push([latLng.lng(), latLng.lat()]);
          });
        });
        data = {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [coordinates],
            },
          }],
        };
      } else if (drawnShapesRef.current instanceof google.maps.Rectangle) {
        const bounds = (drawnShapesRef.current as google.maps.Rectangle).getBounds();
        if (bounds) {
          const coordinates: Array<[number, number]> = [
            [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
            [bounds.getNorthEast().lng(), bounds.getSouthWest().lat()],
            [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()],
            [bounds.getSouthWest().lng(), bounds.getNorthEast().lat()],
            [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
          ];
          data = {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [coordinates],
              },
            }],
          };
        }
      } else if (drawnShapesRef.current instanceof google.maps.Circle) {
        const center = (drawnShapesRef.current as google.maps.Circle).getCenter();
        const radius = (drawnShapesRef.current as google.maps.Circle).getRadius();
        if (center) {
          data = {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [center.lng(), center.lat()],
              },
              properties: {
                radius: radius,
              },
            }],
          };
        }
      } else if (drawnShapesRef.current instanceof google.maps.Marker) {
        const position = (drawnShapesRef.current as google.maps.Marker).getPosition();
        if (position) {
          data = {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [position.lng(), position.lat()],
              },
            }],
          };
        }
      }

      if (data) {
        const dataStr = JSON.stringify(data, null, 2);
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr));
        element.setAttribute('download', 'geometry.geojson');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success('几何数据已导出为GeoJSON');
      }
    } catch (error) {
      console.error('Error exporting geometry:', error);
      toast.error('导出几何数据失败');
    }
  }, [geometryInfo]);

  if (!map) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>地图绘制工具</CardTitle>
          <CardDescription>在地图上绘制自定义区域进行精确检索</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">等待地图加载...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>地图绘制工具</CardTitle>
        <CardDescription>在地图上绘制自定义区域进行精确检索</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 绘制模式按钮 */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant={drawingMode === 'polygon' ? 'default' : 'outline'}
            onClick={() => setMode('polygon')}
            className="text-xs"
          >
            多边形
          </Button>
          <Button
            size="sm"
            variant={drawingMode === 'rectangle' ? 'default' : 'outline'}
            onClick={() => setMode('rectangle')}
            className="text-xs"
          >
            矩形
          </Button>
          <Button
            size="sm"
            variant={drawingMode === 'circle' ? 'default' : 'outline'}
            onClick={() => setMode('circle')}
            className="text-xs"
          >
            圆形
          </Button>
          <Button
            size="sm"
            variant={drawingMode === 'marker' ? 'default' : 'outline'}
            onClick={() => setMode('marker')}
            className="text-xs"
          >
            标记
          </Button>
        </div>

        {/* 绘制信息显示 */}
        {hasDrawing && geometryInfo && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              ✓ {geometryInfo}
            </p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={exportGeometry}
            disabled={!hasDrawing}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={clearDrawing}
            disabled={!hasDrawing}
            className="flex-1 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            清除
          </Button>
        </div>

        {/* 提示信息 */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <p className="text-xs text-amber-900 dark:text-amber-100">
            💡 选择绘制工具后，在地图上点击绘制。绘制完成后，该区域将用于搜索卫星数据。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
