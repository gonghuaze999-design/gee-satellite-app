import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SimpleDrawingToolsProps {
  map: google.maps.Map | null;
  onDrawingComplete?: (geometry: any) => void;
}

export function SimpleDrawingTools({ map, onDrawingComplete }: SimpleDrawingToolsProps) {
  const [drawingMode, setDrawingMode] = useState<'polygon' | 'rectangle' | 'circle' | 'marker' | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const drawnShapesRef = useRef<any[]>([]);
  const listenersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
      if (!drawingMode) return;

      if (drawingMode === 'marker') {
        const marker = new google.maps.Marker({
          position: e.latLng,
          map: map,
          draggable: true,
        });
        drawnShapesRef.current.push(marker);
        toast.success('标记已添加');
        return;
      }

      // 对于其他模式，我们需要更复杂的逻辑
      // 这里简化实现，只做基础功能
      if (drawingMode === 'polygon') {
        const polygon = new google.maps.Polygon({
          paths: [e.latLng],
          editable: true,
          draggable: true,
          fillColor: '#667eea',
          fillOpacity: 0.3,
          strokeColor: '#667eea',
          strokeWeight: 2,
          map: map,
        });
        drawnShapesRef.current.push(polygon);
        toast.success('多边形已开始绘制，点击地图继续添加点，右键完成');
      }
    };

    const listener = map.addListener('click', handleMapClick);
    listenersRef.current.push(listener);

    return () => {
      listenersRef.current.forEach(l => google.maps.event.removeListener(l));
    };
  }, [map, drawingMode]);

  const handleClearDrawing = () => {
    drawnShapesRef.current.forEach(shape => {
      shape.setMap(null);
    });
    drawnShapesRef.current = [];
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
          properties: { id: idx },
        });
      } else if (shape instanceof google.maps.Marker) {
        const pos = shape.getPosition();
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [pos!.lng(), pos!.lat()],
          },
          properties: { id: idx },
        });
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
          onClick={() => setDrawingMode(drawingMode === 'polygon' ? null : 'polygon')}
        >
          多边形
        </Button>
        <Button
          size="sm"
          variant={drawingMode === 'rectangle' ? 'default' : 'outline'}
          onClick={() => setDrawingMode(drawingMode === 'rectangle' ? null : 'rectangle')}
        >
          矩形
        </Button>
        <Button
          size="sm"
          variant={drawingMode === 'circle' ? 'default' : 'outline'}
          onClick={() => setDrawingMode(drawingMode === 'circle' ? null : 'circle')}
        >
          圆形
        </Button>
        <Button
          size="sm"
          variant={drawingMode === 'marker' ? 'default' : 'outline'}
          onClick={() => setDrawingMode(drawingMode === 'marker' ? null : 'marker')}
        >
          标记
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
          当前模式: {
            drawingMode === 'polygon' ? '多边形 - 点击地图添加点'
            : drawingMode === 'rectangle' ? '矩形 - 拖动绘制'
            : drawingMode === 'circle' ? '圆形 - 拖动绘制'
            : '标记 - 点击地图添加标记'
          }
        </p>
      )}
    </div>
  );
}
