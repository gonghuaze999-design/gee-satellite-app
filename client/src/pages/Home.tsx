'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, Calendar as CalendarIcon, Satellite, Download, Eye, Info, AlertCircle, Cloud } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MapView } from '@/components/Map';
import { DrawingTools } from '@/components/DrawingTools';
import { getCountries, getProvinces, getDivisionCenter, getDivisionBounds, getCitiesByProvince, getDistrictsByProvince } from '@/data/china-administrative-divisions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface ImageInfo {
  id: string;
  date: string;
  cloudCover: number;
  quality: number;
  ndvi?: number;
}

export default function Home() {
  const [geeReady, setGeeReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // 搜索参数
  const [country, setCountry] = useState('china');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2023, 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [maxCloudCover, setMaxCloudCover] = useState(30);
  const [imageList, setImageList] = useState<ImageInfo[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [calculateNDVI, setCalculateNDVI] = useState(false);
  const [ndviResult, setNdviResult] = useState<any>(null);
  
  // 绘制区域
  const [drawnGeometry, setDrawnGeometry] = useState<any>(null);
  const [useDrawnArea, setUseDrawnArea] = useState(false);

  // 加载Earth Engine（可选）
  useEffect(() => {
    const loadGEE = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://earthengine.googleapis.com/v1/earthengine_loader.js';
        script.async = true;
        script.onload = () => {
          const checkEE = setInterval(() => {
            if (window.ee) {
              clearInterval(checkEE);
              window.ee.initialize(
                null,
                null,
                () => {
                  console.log('Earth Engine initialized');
                  setGeeReady(true);
                },
                (error: any) => {
                  console.warn('Earth Engine initialization failed:', error);
                  setGeeReady(false);
                }
              );
            }
          }, 100);
          
          setTimeout(() => {
            clearInterval(checkEE);
            if (!window.ee) {
              console.warn('Earth Engine not available');
            }
          }, 5000);
        };
        script.onerror = () => {
          console.warn('Failed to load Earth Engine');
        };
        document.head.appendChild(script);
      } catch (error) {
        console.warn('Failed to load Earth Engine:', error);
      }
    };

    loadGEE();
  }, []);

  // 地图准备就绪
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    console.log('Map ready');
    map.setMapTypeId('satellite');
    map.setCenter({ lat: 35.0, lng: 105.0 });
    map.setZoom(4);
  }, []);

  // 处理国家选择
  const handleCountryChange = useCallback((countryCode: string) => {
    setCountry(countryCode);
    setProvince('');
    setCity('');
    setDistrict('');
    const center = getDivisionCenter(countryCode);
    if (center && mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(4);
    }
  }, []);

  // 处理省份选择
  const handleProvinceChange = useCallback((provinceCode: string) => {
    setProvince(provinceCode);
    setCity('');
    setDistrict('');
    const center = getDivisionCenter(provinceCode);
    if (center && mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(7);
    }
  }, []);

  // 处理市级选择
  const handleCityChange = useCallback((cityCode: string) => {
    setCity(cityCode);
    setDistrict('');
    const center = getDivisionCenter(cityCode);
    if (center && mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(8);
    }
  }, []);

  // 处理区县选择
  const handleDistrictChange = useCallback((districtCode: string) => {
    setDistrict(districtCode);
    const center = getDivisionCenter(districtCode);
    if (center && mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(10);
    }
  }, []);

  // 模拟数据搜索
  const handleSearch = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockImages: ImageInfo[] = [
        { id: 'S2_001', date: '2024-01-15', cloudCover: 5, quality: 95, ndvi: 0.65 },
        { id: 'S2_002', date: '2024-01-20', cloudCover: 12, quality: 88, ndvi: 0.62 },
        { id: 'S2_003', date: '2024-02-05', cloudCover: 25, quality: 82, ndvi: 0.68 },
        { id: 'S2_004', date: '2024-02-15', cloudCover: 8, quality: 92, ndvi: 0.71 },
        { id: 'S2_005', date: '2024-03-01', cloudCover: 15, quality: 85, ndvi: 0.75 },
      ];
      
      const filtered = mockImages.filter(img => img.cloudCover <= maxCloudCover);
      setImageList(filtered);
      setLoading(false);
      toast.success(`找到 ${filtered.length} 张符合条件的影像`);
    }, 1000);
  }, [maxCloudCover]);

  // 计算NDVI
  const handleCalculateNDVI = useCallback(() => {
    if (!selectedImage) {
      toast.error('请先选择一张影像');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const image = imageList.find(img => img.id === selectedImage);
      if (image) {
        setNdviResult({
          imageId: selectedImage,
          ndviValue: image.ndvi,
          minValue: -1,
          maxValue: 1,
          colorMap: 'rainbow',
          timestamp: new Date().toISOString(),
        });
        toast.success('NDVI计算完成！结果已在地图上显示');
      }
      setLoading(false);
    }, 1500);
  }, [selectedImage, imageList]);

  // 导出数据
  const handleExport = useCallback(() => {
    if (!selectedImage) {
      toast.error('请先选择一张影像');
      return;
    }

    const image = imageList.find(img => img.id === selectedImage);
    if (image) {
      const exportData = {
        imageId: image.id,
        date: image.date,
        cloudCover: image.cloudCover,
        ndvi: calculateNDVI ? ndviResult?.ndviValue : null,
        exportTime: new Date().toISOString(),
        format: 'GeoTIFF',
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `satellite-export-${image.id}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('数据已导出');
    }
  }, [selectedImage, imageList, calculateNDVI, ndviResult]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* 顶部导航 */}
      <div className="border-b border-slate-800 bg-slate-900 p-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">GEE卫星数据分析平台</h1>
            <p className="text-sm text-slate-400">基于Google Earth Engine的遥感影像查询与分析</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setDemoMode(!demoMode)}>
              <Info className="w-4 h-4 mr-2" />
              {demoMode ? '演示模式' : '真实GEE'}
            </Button>
            <Button variant="outline" size="sm">
              切换到真实GEE
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="mx-auto max-w-7xl p-4">
        {demoMode && (
          <Alert className="mb-4 bg-blue-950 border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              当前为演示模式，显示模拟数据。如需使用真实的Google Earth Engine数据，请先在
              <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                GEE官网
              </a>
              中申请访问权限，然后点击右上角"切换到真实GEE"按钮。
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* 左侧面板 */}
          <div className="lg:col-span-1">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 pr-4">
                {/* 地图绘制工具 */}
                <DrawingTools
                  map={mapRef.current}
                  onDrawingComplete={(geometry) => {
                    setDrawnGeometry(geometry);
                    setUseDrawnArea(true);
                    toast.success('绘制完成！');
                  }}
                  onDrawingCleared={() => {
                    setDrawnGeometry(null);
                    setUseDrawnArea(false);
                  }}
                />

                {/* 区域选择 */}
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      区域选择
                    </CardTitle>
                    <CardDescription>
                      {useDrawnArea ? '已使用绘制区域' : '选择行政区划范围'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">国家</label>
                      <Select value={country} onValueChange={handleCountryChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择国家" />
                        </SelectTrigger>
                        <SelectContent>
                          {getCountries().map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {country === 'china' && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-2 block">省份</label>
                          <Select value={province} onValueChange={handleProvinceChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择省份" />
                            </SelectTrigger>
                            <SelectContent>
                              {getProvinces(country).map((p) => (
                                <SelectItem key={p.code} value={p.code}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {province && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">市级</label>
                            <Select value={city} onValueChange={handleCityChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="选择市级" />
                              </SelectTrigger>
                              <SelectContent>
                                {getCitiesByProvince(province).map((c) => (
                                  <SelectItem key={c.code} value={c.code}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {city && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">区县</label>
                            <Select value={district} onValueChange={handleDistrictChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="选择区县" />
                              </SelectTrigger>
                              <SelectContent>
                                {getDistrictsByProvince(province)
                                  .filter((d) => {
                                    const cityObj = getCitiesByProvince(province).find((c) => c.code === city);
                                    return cityObj?.children?.some((child) => child.code === d.code);
                                  })
                                  .map((d) => (
                                    <SelectItem key={d.code} value={d.code}>
                                      {d.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* 时间范围选择 */}
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      时间范围
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">开始日期</label>
                      <input
                        type="date"
                        value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">结束日期</label>
                      <input
                        type="date"
                        value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setEndDate(new Date(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 云量过滤 */}
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Cloud className="w-4 h-4" />
                      云量过滤
                    </CardTitle>
                    <CardDescription>最大云遮盖百分比</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">云遮盖百分比</label>
                        <span className="text-sm font-semibold text-blue-400">{maxCloudCover}%</span>
                      </div>
                      <Slider
                        value={[maxCloudCover]}
                        onValueChange={(val) => setMaxCloudCover(val[0])}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      仅显示云遮盖百分比不超过 {maxCloudCover}% 的影像
                    </p>
                  </CardContent>
                </Card>

                {/* 搜索按钮 */}
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      搜索中...
                    </>
                  ) : (
                    <>
                      <Satellite className="w-4 h-4 mr-2" />
                      搜索卫星数据
                    </>
                  )}
                </Button>

                {/* 搜索结果列表 */}
                {imageList.length > 0 && (
                  <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">搜索结果</CardTitle>
                      <CardDescription>{imageList.length} 张符合条件的影像</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {imageList.map((img) => (
                          <div
                            key={img.id}
                            onClick={() => setSelectedImage(img.id)}
                            className={`p-3 rounded border cursor-pointer transition ${
                              selectedImage === img.id
                                ? 'bg-blue-900 border-blue-500'
                                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{img.id}</p>
                                <p className="text-xs text-slate-400">{img.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-300">云量: {img.cloudCover}%</p>
                                <p className="text-xs text-slate-300">质量: {img.quality}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 算法处理 */}
                {selectedImage && (
                  <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">算法处理</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ndvi"
                          checked={calculateNDVI}
                          onCheckedChange={(checked) => setCalculateNDVI(checked as boolean)}
                        />
                        <label htmlFor="ndvi" className="text-sm cursor-pointer">
                          NDVI 植被指数
                        </label>
                      </div>
                      <Button
                        onClick={handleCalculateNDVI}
                        disabled={loading || !calculateNDVI}
                        className="w-full bg-green-600 hover:bg-green-700 text-sm"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            计算中...
                          </>
                        ) : (
                          '计算'
                        )}
                      </Button>
                      <Button
                        onClick={handleExport}
                        disabled={!selectedImage}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        导出数据
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* NDVI结果显示 */}
                {ndviResult && (
                  <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">NDVI结果</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-slate-800 rounded">
                        <p className="text-xs text-slate-400">NDVI值范围</p>
                        <p className="text-lg font-bold text-blue-400">
                          {ndviResult.ndviValue.toFixed(2)}
                        </p>
                      </div>
                      <div className="h-6 bg-gradient-to-r from-blue-600 via-green-600 to-red-600 rounded"></div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>低 (-1)</span>
                        <span>中 (0)</span>
                        <span>高 (+1)</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        蓝色：水体/低植被 | 绿色：中等植被 | 红色：高植被覆盖
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* 右侧地图 */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-900 border-slate-700 h-[calc(100vh-200px)]">
              <CardContent className="p-0 h-full">
                <MapView onMapReady={handleMapReady} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
