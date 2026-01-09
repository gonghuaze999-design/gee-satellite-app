'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DrawingToolsProps {
  map: google.maps.Map | null;
  onDrawingComplete?: (geometry: any) => void;
  onDrawingCleared?: () => void;
}

export function DrawingTools({ map, onDrawingComplete, onDrawingCleared }: DrawingToolsProps) {
  const drawingManagerRef = useRef<any>(null);
  const drawnShapesRef = useRef<any>(null);
  const [drawingMode, setDrawingMode] = useState<string | null>(null);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [geometryInfo, setGeometryInfo] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化Drawing Manager
  useEffect(() => {
    if (!map || isInitialized) {
      setIsLoading(false);
      return;
    }

    // 检查Drawing库是否已加载
    const checkAndInit = () => {
      if (!window.google?.maps?.drawing?.DrawingManager) {
        setTimeout(checkAndInit, 100);
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

        drawingManager.setMap(map);
        drawingManagerRef.current = drawingManager;

        // 监听绘制完成事件
        window.google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
          handleDrawingComplete(event);
        });

        setIsInitialized(true);
        setIsLoading(false);
        console.log('Drawing Manager initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Drawing Manager:', error);
        setIsLoading(false);
      }
    };

    checkAndInit();
  }, [map, isInitialized]);

  // 处理绘制完成
  const handleDrawingComplete = useCallback((event: any) => {
    const shape = event.overlay;
    shape.type = event.type;

    // 清除之前的绘制
    if (drawnShapesRef.current) {
      drawnShapesRef.current.setMap(null);
    }

    drawnShapesRef.current = shape;
    setHasDrawing(true);

    // 获取几何信息
    let geometry: any = null;
    if (event.type === 'polygon') {
      const paths = shape.getPath().getArray();
      geometry = {
        type: 'Polygon',
        coordinates: [paths.map((p: any) => [p.lng(), p.lat()])],
      };
      setGeometryInfo(`多边形: ${paths.length} 个顶点`);
    } else if (event.type === 'rectangle') {
      const bounds = shape.getBounds();
      geometry = {
        type: 'Polygon',
        coordinates: [[
          [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
          [bounds.getNorthEast().lng(), bounds.getSouthWest().lat()],
          [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()],
          [bounds.getSouthWest().lng(), bounds.getNorthEast().lat()],
          [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
        ]],
      };
      setGeometryInfo(`矩形: ${(bounds.getNorthEast().lat() - bounds.getSouthWest().lat()).toFixed(2)}° × ${(bounds.getNorthEast().lng() - bounds.getSouthWest().lng()).toFixed(2)}°`);
    } else if (event.type === 'circle') {
      const center = shape.getCenter();
      const radius = shape.getRadius();
      geometry = {
        type: 'Point',
        coordinates: [center.lng(), center.lat()],
        radius: radius,
      };
      setGeometryInfo(`圆形: 半径 ${(radius / 1000).toFixed(2)} km`);
    } else if (event.type === 'marker') {
      const pos = shape.getPosition();
      geometry = {
        type: 'Point',
        coordinates: [pos.lng(), pos.lat()],
      };
      setGeometryInfo(`标记: ${pos.lat().toFixed(4)}, ${pos.lng().toFixed(4)}`);
    }

    // 禁用绘制模式
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
    setDrawingMode(null);

    if (onDrawingComplete) {
      onDrawingComplete(geometry);
    }

    toast.success('绘制完成！');
  }, [onDrawingComplete]);

  // 设置绘制模式
  const setMode = useCallback((mode: string) => {
    if (!drawingManagerRef.current) {
      toast.error('绘制工具未初始化');
      return;
    }

    const modeMap: Record<string, any> = {
      polygon: window.google.maps.drawing.OverlayType.POLYGON,
      rectangle: window.google.maps.drawing.OverlayType.RECTANGLE,
      circle: window.google.maps.drawing.OverlayType.CIRCLE,
      marker: window.google.maps.drawing.OverlayType.MARKER,
    };

    drawingManagerRef.current.setDrawingMode(modeMap[mode]);
    setDrawingMode(mode);
    toast.info(`已启用${mode === 'polygon' ? '多边形' : mode === 'rectangle' ? '矩形' : mode === 'circle' ? '圆形' : '标记'}绘制模式`);
  }, []);

  // 导出GeoJSON
  const handleExport = useCallback(() => {
    if (!drawnShapesRef.current) {
      toast.error('没有绘制的区域');
      return;
    }

    let geometry: any = null;
    const type = drawnShapesRef.current.type;

    if (type === 'polygon') {
      const paths = drawnShapesRef.current.getPath().getArray();
      geometry = {
        type: 'Polygon',
        coordinates: [paths.map((p: any) => [p.lng(), p.lat()])],
      };
    } else if (type === 'rectangle') {
      const bounds = drawnShapesRef.current.getBounds();
      geometry = {
        type: 'Polygon',
        coordinates: [[
          [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
          [bounds.getNorthEast().lng(), bounds.getSouthWest().lat()],
          [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()],
          [bounds.getSouthWest().lng(), bounds.getNorthEast().lat()],
          [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()],
        ]],
      };
    } else if (type === 'circle') {
      const center = drawnShapesRef.current.getCenter();
      const radius = drawnShapesRef.current.getRadius();
      geometry = {
        type: 'Point',
        coordinates: [center.lng(), center.lat()],
        radius: radius,
      };
    } else if (type === 'marker') {
      const pos = drawnShapesRef.current.getPosition();
      geometry = {
        type: 'Point',
        coordinates: [pos.lng(), pos.lat()],
      };
    }

    const geojson = {
      type: 'Feature',
      geometry: geometry,
      properties: {
        name: '绘制区域',
        timestamp: new Date().toISOString(),
      },
    };

    const dataStr = JSON.stringify(geojson, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `drawn-area-${Date.now()}.geojson`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('GeoJSON已导出');
  }, []);

  // 清除绘制
  const handleClear = useCallback(() => {
    if (drawnShapesRef.current) {
      drawnShapesRef.current.setMap(null);
      drawnShapesRef.current = null;
    }
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
    setHasDrawing(false);
    setDrawingMode(null);
    setGeometryInfo('');

    if (onDrawingCleared) {
      onDrawingCleared();
    }

    toast.success('已清除绘制');
  }, [onDrawingCleared]);

  if (isLoading) {
    return (
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">地图绘制工具</CardTitle>
          <CardDescription>在地图上绘制自定义区域进行精确检索</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="ml-2 text-slate-400">正在加载绘制工具...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">地图绘制工具</CardTitle>
        <CardDescription>在地图上绘制自定义区域进行精确检索</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant={drawingMode === 'polygon' ? 'default' : 'outline'}
            onClick={() => setMode('polygon')}
            className={drawingMode === 'polygon' ? 'bg-blue-600' : ''}
          >
            多边形
          </Button>
          <Button
            size="sm"
            variant={drawingMode === 'rectangle' ? 'default' : 'outline'}
            onClick={() => setMode('rectangle')}
            className={drawingMode === 'rectangle' ? 'bg-blue-600' : ''}
          >
            矩形
          </Button>
          <Button
            size="sm"
            variant={drawingMode === 'circle' ? 'default' : 'outline'}
            onClick={() => setMode('circle')}
            className={drawingMode === 'circle' ? 'bg-blue-600' : ''}
          >
            圆形
          </Button>
          <Button
            size="sm"
            variant={drawingMode === 'marker' ? 'default' : 'outline'}
            onClick={() => setMode('marker')}
            className={drawingMode === 'marker' ? 'bg-blue-600' : ''}
          >
            标记
          </Button>
        </div>

        {hasDrawing && (
          <div className="p-3 bg-slate-800 rounded border border-slate-700">
            <p className="text-sm text-slate-300">{geometryInfo}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleExport}
            disabled={!hasDrawing}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleClear}
            disabled={!hasDrawing}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
