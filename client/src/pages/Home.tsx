'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Satellite, Cloud, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { MapView } from '@/components/Map';
import { QueryProgress } from '@/components/QueryProgress';
import { ImageDetailPanel } from '@/components/ImageDetailPanel';
import { useAsyncQuery } from '@/hooks/useAsyncQuery';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';


interface AdministrativeDivision {
  name: string;
  adcode: string;
  level: string;
  location?: string;
}

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
  
  const [selectedProvinceAdcode, setSelectedProvinceAdcode] = useState('110000');
  const [selectedCityAdcode, setSelectedCityAdcode] = useState('110100');
  const [selectedDistrictAdcode, setSelectedDistrictAdcode] = useState('');
  
  const [provincesList, setProvincesList] = useState<AdministrativeDivision[]>([]);
  const [citiesList, setCitiesList] = useState<AdministrativeDivision[]>([]);
  const [districtsList, setDistrictsList] = useState<AdministrativeDivision[]>([]);
  
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-06-30');
  const [maxCloudCover, setMaxCloudCover] = useState(30);
  
  const [imageList, setImageList] = useState<SatelliteImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<SatelliteImage | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
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
  
  // 获取省份列表
  const { data: provincesData } = trpc.amap.getProvinces.useQuery();
  
  // 获取城市列表
  const getCitiesMutation = trpc.amap.getCitiesByProvince.useMutation();
  
  // 获取区县列表
  const getDistrictsMutation = trpc.amap.getDistrictsByCity.useMutation();

  // 初始化省份列表
  useEffect(() => {
    if (provincesData?.success && provincesData.data) {
      setProvincesList(provincesData.data);
    }
  }, [provincesData]);

  // 当省份改变时，获取城市列表
  useEffect(() => {
    if (selectedProvinceAdcode) {
      getCitiesMutation.mutate(
        { provinceAdcode: selectedProvinceAdcode },
        {
          onSuccess: (data) => {
            if (data.success && data.data) {
              setCitiesList(data.data);
              // 选择第一个城市
              if (data.data.length > 0) {
                setSelectedCityAdcode(data.data[0].adcode);
              }
            }
          },
        }
      );
    }
  }, [selectedProvinceAdcode, getCitiesMutation]);

  // 当城市改变时，获取区县列表
  useEffect(() => {
    if (selectedCityAdcode) {
      getDistrictsMutation.mutate(
        { cityAdcode: selectedCityAdcode },
        {
          onSuccess: (data) => {
            if (data.success && data.data) {
              setDistrictsList(data.data);
              // 选择第一个区县
              if (data.data.length > 0) {
                setSelectedDistrictAdcode(data.data[0].adcode);
              }
            }
          },
        }
      );
    }
  }, [selectedCityAdcode, getDistrictsMutation]);

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
    // 设置默认中心到北京
    map.setCenter({ lat: 39.9042, lng: 116.4074 });
    map.setZoom(10);
  }, []);

  // 当选择的地区改变时，自动定位地图
  useEffect(() => {
    if (mapRef.current && selectedDistrictAdcode) {
      // 根据选中的区县获取其坐标并定位地图
      const district = districtsList.find(d => d.adcode === selectedDistrictAdcode);
      if (district && district.location) {
        const [lng, lat] = district.location.split(',').map(Number);
        mapRef.current.setCenter({ lat, lng });
        mapRef.current.setZoom(12);
      } else if (selectedCityAdcode) {
        // 如果没有区县坐标，则使用城市坐标
        const city = citiesList.find(c => c.adcode === selectedCityAdcode);
        if (city && city.location) {
          const [lng, lat] = city.location.split(',').map(Number);
          mapRef.current.setCenter({ lat, lng });
          mapRef.current.setZoom(11);
        } else if (selectedProvinceAdcode) {
          // 如果没有城市坐标，则使用省份坐标
          const province = provincesList.find(p => p.adcode === selectedProvinceAdcode);
          if (province && province.location) {
            const [lng, lat] = province.location.split(',').map(Number);
            mapRef.current.setCenter({ lat, lng });
            mapRef.current.setZoom(9);
          }
        }
      }
    }
  }, [selectedDistrictAdcode, selectedCityAdcode, selectedProvinceAdcode, districtsList, citiesList, provincesList]);

  // 当城市改变时，自动定位地图
  useEffect(() => {
    if (mapRef.current && selectedCityAdcode && !selectedDistrictAdcode) {
      const city = citiesList.find(c => c.adcode === selectedCityAdcode);
      if (city && city.location) {
        const [lng, lat] = city.location.split(',').map(Number);
        mapRef.current.setCenter({ lat, lng });
        mapRef.current.setZoom(11);
      }
    }
  }, [selectedCityAdcode, citiesList, selectedDistrictAdcode]);

  // 当省份改变时，自动定位地图
  useEffect(() => {
    if (mapRef.current && selectedProvinceAdcode && !selectedCityAdcode) {
      const province = provincesList.find(p => p.adcode === selectedProvinceAdcode);
      if (province && province.location) {
        const [lng, lat] = province.location.split(',').map(Number);
        mapRef.current.setCenter({ lat, lng });
        mapRef.current.setZoom(9);
      }
    }
  }, [selectedProvinceAdcode, provincesList, selectedCityAdcode]);

  const handleSearch = useCallback(() => {
    setImageList([]);
    setSelectedImageId('');
    setTaskId(null);

    // 获取选中的省市县名称
    const province = provincesList.find(p => p.adcode === selectedProvinceAdcode);
    const city = citiesList.find(c => c.adcode === selectedCityAdcode);
    const district = districtsList.find(d => d.adcode === selectedDistrictAdcode);

    searchAsyncMutation.mutate({
      province: province?.name || '',
      city: city?.name || '',
      district: district?.name || '',
      startDate,
      endDate,
      maxCloudCover,
    });
  }, [selectedProvinceAdcode, selectedCityAdcode, selectedDistrictAdcode, provincesList, citiesList, districtsList, startDate, endDate, maxCloudCover, searchAsyncMutation]);

  const handleImageSelect = useCallback((image: SatelliteImage) => {
    setSelectedImageId(image.id);
    setSelectedImage(image);
    setShowDetailPanel(true);
  }, []);

  const handleLoadToMap = useCallback((image: SatelliteImage) => {
    toast.info(`已将 ${image.date} 的影像加载到地图`);
  }, []);

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
                <Select value={selectedProvinceAdcode} onValueChange={setSelectedProvinceAdcode}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {provincesList.map(p => (
                      <SelectItem key={p.adcode} value={p.adcode} className="text-white">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-white">城市</Label>
                <Select value={selectedCityAdcode} onValueChange={setSelectedCityAdcode}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {citiesList.map(c => (
                      <SelectItem key={c.adcode} value={c.adcode} className="text-white">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-white">区县</Label>
                <Select value={selectedDistrictAdcode} onValueChange={setSelectedDistrictAdcode}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {districtsList.map(d => (
                      <SelectItem key={d.adcode} value={d.adcode} className="text-white">
                        {d.name}
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

        {/* 影像详情面板 */}
        {showDetailPanel && (
          <ImageDetailPanel
            image={selectedImage}
            onClose={() => setShowDetailPanel(false)}
            onLoadToMap={handleLoadToMap}
          />
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
