import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SimpleDrawingToolsProps {
  map: google.maps.Map | null;
  onDrawingComplete?: (geometry: any) => void;
}

export function SimpleDrawingTools({ map, onDrawingComplete }: SimpleDrawingToolsProps) {
  const [drawingMode, setDrawingMode] = useState<'polygon' | 'rectangle' | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const drawnShapesRef = useRef<any[]>([]);
  const listenersRef = useRef<any[]>([]);
  const polygonPointsRef = useRef<google.maps.LatLng[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const rectangleStartRef = useRef<google.maps.LatLng | null>(null);
  const rectangleRef = useRef<google.maps.Rectangle | null>(null);

  useEffect(() => {
    if (!map) return;

    // 处理地图点击事件
    const handleMapClick = (e: google.maps.MapMouseEvent) => {
      if (!drawingMode) return;

      if (drawingMode === 'polygon') {
        // 添加多边形顶点
        const point = e.latLng!;
        polygonPointsRef.current.push(point);

        // 绘制临时线条
        if (!polylineRef.current) {
          polylineRef.current = new google.maps.Polyline({
            path: polygonPointsRef.current,
            geodesic: true,
            strokeColor: '#667eea',
            strokeOpacity: 0.7,
            strokeWeight: 2,
            map: map,
          });
        } else {
          polylineRef.current.setPath(polygonPointsRef.current);
        }

        // 添加标记
        new google.maps.Marker({
          position: point,
          map: map,
          title: `Point ${polygonPointsRef.current.length}`,
        });

        toast.success(`已添加第 ${polygonPointsRef.current.length} 个点`);
      } else if (drawingMode === 'rectangle') {
        if (!rectangleStartRef.current) {
          // 第一个点
          rectangleStartRef.current = e.latLng!;
          toast.info('已设置矩形起点，继续点击设置终点');
        } else {
          // 第二个点，完成矩形
          const startPoint = rectangleStartRef.current;
          const endPoint = e.latLng!;

          const bounds = new google.maps.LatLngBounds();
          bounds.extend(startPoint);
          bounds.extend(endPoint);

          const rectangle = new google.maps.Rectangle({
            bounds: bounds,
            fillColor: '#667eea',
            fillOpacity: 0.3,
            strokeColor: '#667eea',
            strokeWeight: 2,
            editable: true,
            draggable: true,
            map: map,
          });

          drawnShapesRef.current.push(rectangle);
          rectangleRef.current = null;
          rectangleStartRef.current = null;
          setDrawingMode(null);
          toast.success('矩形绘制完成');
        }
      }
    };

    // 处理右键事件（完成多边形）
    const handleRightClick = (e: google.maps.MapMouseEvent) => {
      if (drawingMode === 'polygon' && polygonPointsRef.current.length >= 3) {
        // 创建多边形
        const polygon = new google.maps.Polygon({
          paths: polygonPointsRef.current,
          editable: true,
          draggable: true,
          fillColor: '#667eea',
          fillOpacity: 0.3,
          strokeColor: '#667eea',
          strokeWeight: 2,
          map: map,
        });

        drawnShapesRef.current.push(polygon);

        // 清理临时线条和标记
        if (polylineRef.current) {
          polylineRef.current.setMap(null);
          polylineRef.current = null;
        }

        // 清理临时标记（简化实现）

        // 重置状态
        polygonPointsRef.current = [];
        setDrawingMode(null);
        toast.success('多边形绘制完成');
      }
    };

    // 处理鼠标移动（显示预览）
    const handleMouseMove = (e: google.maps.MapMouseEvent) => {
      if (drawingMode === 'rectangle' && rectangleStartRef.current) {
        // 显示预览矩形
        const startPoint = rectangleStartRef.current;
        const currentPoint = e.latLng!;

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(startPoint);
        bounds.extend(currentPoint);

        if (!rectangleRef.current) {
          rectangleRef.current = new google.maps.Rectangle({
            bounds: bounds,
            fillColor: '#667eea',
            fillOpacity: 0.1,
            strokeColor: '#667eea',
            strokeWeight: 1,
            strokeOpacity: 0.5,
            map: map,
          });
        } else {
          rectangleRef.current.setBounds(bounds);
        }
      }
    };

    const clickListener = map.addListener('click', handleMapClick);
    const rightClickListener = map.addListener('rightclick', handleRightClick);
    const mouseMoveListener = map.addListener('mousemove', handleMouseMove);

    listenersRef.current.push(clickListener, rightClickListener, mouseMoveListener);

    // 改变鼠标样式
    if (drawingMode) {
      map.setOptions({ draggableCursor: 'crosshair' });
    } else {
      map.setOptions({ draggableCursor: 'grab' });
    }

    return () => {
      listenersRef.current.forEach(l => google.maps.event.removeListener(l));
      if (rectangleRef.current) {
        rectangleRef.current.setMap(null);
      }
    };
  }, [map, drawingMode]);

  const handleClearDrawing = () => {
    drawnShapesRef.current.forEach(shape => {
      shape.setMap(null);
    });
    drawnShapesRef.current = [];
    polygonPointsRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (rectangleRef.current) {
      rectangleRef.current.setMap(null);
      rectangleRef.current = null;
    }
    rectangleStartRef.current = null;
    setDrawingMode(null);
    toast.success('已清除所有绘制内容');
  };

  const handleExportDrawing = () => {
    if (drawnShapesRef.current.length === 0) {
      toast.error('没有绘制内容可导出');
      return;
    }

    const features: any[] = [];
    drawnShapesRef.current.forEach((shape, idx) => {
      if (shape instanceof google.maps.Polygon) {
        const paths = shape.getPaths();
        const coordinates: any[] = [];
        paths.forEach(path => {
          path.forEach(latlng => {
            coordinates.push([latlng.lng(), latlng.lat()]);
          });
        });
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
          properties: { id: idx, type: 'polygon' },
        });
      } else if (shape instanceof google.maps.Rectangle) {
        const bounds = shape.getBounds();
        if (bounds) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const coordinates = [
            [sw.lng(), sw.lat()],
            [ne.lng(), sw.lat()],
            [ne.lng(), ne.lat()],
            [sw.lng(), ne.lat()],
            [sw.lng(), sw.lat()],
          ];
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [coordinates],
            },
            properties: { id: idx, type: 'rectangle' },
          });
        }
      }
    });

    const geojson = {
      type: 'FeatureCollection',
      features,
    };

    const dataStr = JSON.stringify(geojson, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `drawing-${Date.now()}.geojson`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('GeoJSON已导出');
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant={drawingMode === 'polygon' ? 'default' : 'outline'}
          onClick={() => {
            if (drawingMode === 'polygon') {
              setDrawingMode(null);
              polygonPointsRef.current = [];
              if (polylineRef.current) {
                polylineRef.current.setMap(null);
                polylineRef.current = null;
              }
            } else {
              setDrawingMode('polygon');
              polygonPointsRef.current = [];
            }
          }}
        >
          多边形
        </Button>
        <Button
          size="sm"
          variant={drawingMode === 'rectangle' ? 'default' : 'outline'}
          onClick={() => {
            if (drawingMode === 'rectangle') {
              setDrawingMode(null);
              rectangleStartRef.current = null;
              if (rectangleRef.current) {
                rectangleRef.current.setMap(null);
                rectangleRef.current = null;
              }
            } else {
              setDrawingMode('rectangle');
              rectangleStartRef.current = null;
            }
          }}
        >
          矩形
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleExportDrawing}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-1" />
          导出
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleClearDrawing}
          className="flex-1"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          清除
        </Button>
      </div>

      {drawingMode && (
        <p className="text-xs text-slate-400 text-center">
          {drawingMode === 'polygon' 
            ? '多边形模式：点击地图添加点，右键完成绘制'
            : '矩形模式：点击两个点设置矩形对角'}
        </p>
      )}
    </div>
  );
}
