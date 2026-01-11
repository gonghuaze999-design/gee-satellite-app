'use client';

import { X, Calendar, Cloud, Zap, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

interface SatelliteImage {
  id: string;
  date: string;
  utcTime?: string;
  cloudCover: number;
  quality: number;
  sensor: string;
  resolution: number;
  thumbnail: string;
  ndvi?: number;
}

interface ImageDetailPanelProps {
  image: SatelliteImage | null;
  onClose: () => void;
  onLoadToMap?: (image: SatelliteImage) => void;
}

export function ImageDetailPanel({
  image,
  onClose,
  onLoadToMap,
}: ImageDetailPanelProps) {
  const [opacity, setOpacity] = useState(100);

  if (!image) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-white">错误</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-red-400">无法加载影像详情，请重新选择</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 sticky top-0 bg-slate-800 border-b border-slate-700">
          <CardTitle className="text-white">卫星影像详情</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* 缩略图 */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">预览图</h3>
            {image.thumbnail ? (
              <img
                src={image.thumbnail}
                alt="卫星影像预览"
                className="w-full h-64 rounded-lg object-cover border border-slate-600"
              />
            ) : (
              <div className="w-full h-64 rounded-lg bg-slate-700 flex items-center justify-center border border-slate-600">
                <span className="text-gray-400">暂无预览图</span>
              </div>
            )}
          </div>

          {/* 基本信息 */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">基本信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 p-3 rounded">
                <p className="text-gray-400 text-sm">影像ID</p>
                <p className="text-white font-mono text-sm break-all">{image.id}</p>
              </div>
              <div className="bg-slate-700 p-3 rounded">
                <p className="text-gray-400 text-sm">获取日期</p>
                <p className="text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {image.date}
                </p>
              </div>
              <div className="bg-slate-700 p-3 rounded">
                <p className="text-gray-400 text-sm">传感器</p>
                <p className="text-white">{image.sensor}</p>
              </div>
              <div className="bg-slate-700 p-3 rounded">
                <p className="text-gray-400 text-sm">空间分辨率</p>
                <p className="text-white">{image.resolution}m</p>
              </div>
            </div>
          </div>

          {/* 质量指标 */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">质量指标</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-300 flex items-center gap-2">
                    <Cloud className="w-4 h-4" />
                    云量覆盖
                  </label>
                  <span className="text-white font-semibold">{image.cloudCover ? image.cloudCover.toFixed(2) : 'N/A'}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(image.cloudCover, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-300 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    影像质量
                  </label>
                  <span className="text-white font-semibold">{image.quality ? (image.quality * 100).toFixed(0) : 'N/A'}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(image.quality * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* NDVI指数 */}
          {image.ndvi !== undefined && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold">植被指数 (NDVI)</h3>
              <div className="bg-slate-700 p-4 rounded">
                <p className="text-gray-400 text-sm mb-2">NDVI值</p>
                <p className="text-white text-2xl font-bold">{image.ndvi ? image.ndvi.toFixed(3) : 'N/A'}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {image.ndvi > 0.5
                    ? '✅ 植被覆盖度高'
                    : image.ndvi > 0.3
                      ? '⚠️ 植被覆盖度中等'
                      : '❌ 植被覆盖度低'}
                </p>
              </div>
            </div>
          )}

          {/* 地图叠加选项 */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">地图显示</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">透明度: {opacity}%</label>
                <Slider
                  value={[opacity]}
                  onValueChange={(value) => setOpacity(value[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <Button
                onClick={() => onLoadToMap?.(image)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                加载到地图 (透明度 {opacity}%)
              </Button>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-4 border-t border-slate-700">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              关闭
            </Button>
            <Button
              onClick={() => {
                // 下载功能
                toast.info('下载功能开发中');
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              下载影像
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 简单的toast提示（如果没有引入toast库）
const toast = {
  info: (message: string) => console.log(message),
};
