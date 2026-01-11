'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Satellite, Cloud, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { MapView } from '@/components/Map';
import { QueryProgress } from '@/components/QueryProgress';
import { useAsyncQuery } from '@/hooks/useAsyncQuery';
import { chinaProvinces } from '@/data/china-divisions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';

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

export default function Home() {
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const [selectedProvince, setSelectedProvince] = useState('beijing');
  const [selectedCity, setSelectedCity] = useState('beijing');
  const [selectedDistrict, setSelectedDistrict] = useState('chaoyang');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-06-30');
  const [maxCloudCover, setMaxCloudCover] = useState(30);
  
  const [imageList, setImageList] = useState<SatelliteImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string>('');
  const [taskId, setTaskId] = useState<string | null>(null);
  
  const { status: queryStatus, isLoading, cancel } = useAsyncQuery({
    taskId,
    onComplete: (result) => {
      if (result && result.images) {
        setImageList(result.images);
        toast.success(`成功查询到 ${result.images.length} 张卫星影像`);
      }
    },
    onError: (error) => {
      toast.error(`查询失败: ${error}`);
    },
  });
  
  const { data: geeAuthStatus } = trpc.gee.checkAuth.useQuery();

  const searchAsyncMutation = trpc.gee.searchSentinel2Async.useMutation({
    onSuccess: (data) => {
      console.log('[Search] 异步查询已创建:', data.taskId);
      setTaskId(data.taskId);
    },
    onError: (error: any) => {
      console.error('[Search] 创建查询任务失败:', error);
      toast.error('创建查询任务失败');
    },
  });

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleSearch = useCallback(() => {
    setImageList([]);
    setSelectedImageId('');
    setTaskId(null);

    searchAsyncMutation.mutate({
      province: selectedProvince,
      city: selectedCity,
      district: selectedDistrict,
      startDate,
      endDate,
      maxCloudCover,
    });
  }, [selectedProvince, selectedCity, selectedDistrict, startDate, endDate, maxCloudCover, searchAsyncMutation]);

  const handleImageSelect = useCallback((image: SatelliteImage) => {
    setSelectedImageId(image.id);
  }, []);

  const provincesList = chinaProvinces.map(p => ({
    code: p.code,
    name: p.name,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center justify-center gap-3">
            <Satellite className="w-10 h-10 text-blue-400" />
            GEE卫星数据分析平台
          </h1>
          <p className="text-gray-300 text-lg">
            {geeAuthStatus?.configured 
              ? '✅ 已连接真实GEE数据源' 
              : '⚠️ GEE服务未配置'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">查询条件</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-white">省份</Label>
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {provincesList.map(p => (
                      <SelectItem key={p.code} value={p.code} className="text-white">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  开始日期
                </Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  结束日期
                </Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-white flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  最大云量: {maxCloudCover}%
                </Label>
                <Slider
                  value={[maxCloudCover]}
                  onValueChange={(value) => setMaxCloudCover(value[0])}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={isLoading || searchAsyncMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading || searchAsyncMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    查询中...
                  </>
                ) : (
                  <>
                    <Satellite className="w-4 h-4 mr-2" />
                    搜索卫星影像
                  </>
                )}
              </Button>

              {isLoading && (
                <Button
                  onClick={cancel}
                  variant="outline"
                  className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  取消查询
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800 border-slate-700 overflow-hidden" style={{ height: '400px' }}>
              <MapView onMapReady={handleMapReady} />
            </Card>

            {queryStatus && (
              <QueryProgress
                status={queryStatus}
                isLoading={isLoading}
                onCancel={cancel}
              />
            )}

            {imageList.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    查询结果 ({imageList.length} 张影像)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2 pr-4">
                      {imageList.map((image) => (
                        <div
                          key={image.id}
                          onClick={() => handleImageSelect(image)}
                          className={`p-3 rounded cursor-pointer transition-colors ${
                            selectedImageId === image.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 hover:bg-slate-600 text-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold">{image.date}</p>
                              <p className="text-sm">
                                云量: {image.cloudCover.toFixed(2)}% | 分辨率: {image.resolution}m
                              </p>
                            </div>
                            {image.thumbnail && (
                              <img
                                src={image.thumbnail}
                                alt="缩略图"
                                className="w-12 h-12 rounded ml-2 object-cover"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {!isLoading && imageList.length === 0 && !queryStatus && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-12 pb-12 text-center">
                  <Satellite className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    设置查询条件后，点击"搜索卫星影像"开始查询
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
