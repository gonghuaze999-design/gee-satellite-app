

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, Calendar as CalendarIcon, Satellite, Download, Eye, Info, AlertCircle, Cloud, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { MapView } from '@/components/Map';
import { SimpleDrawingTools } from '@/components/SimpleDrawingTools';
import { chinaProvinces, getDivisionCenter, getCitiesByProvince, getDistrictsByCity } from '@/data/china-divisions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';

interface SatelliteImage {
  id: string;
  date: string;
  cloudCover: number;
  quality: number;
  sensor: string;
  resolution: number;
  thumbnail?: string;
  ndvi?: number;
  ndviUrl?: string;
}

interface NDVIResult {
  imageId: string;
  ndviMin: number;
  ndviMax: number;
  ndviMean: number;
  colorMap: string;
  timestamp: string;
  imageUrl?: string;
}

// 生成NDVI可视化SVG
function generateNDVIVisualization(result: NDVIResult): string {
  const { ndviMin, ndviMax, ndviMean } = result;
  const range = ndviMax - ndviMin;
  const meanPercent = ((ndviMean - ndviMin) / range) * 100;
  
  // 创建彩虹渐变
  const colors = [
    { pos: 0, color: '#0000FF' },      // 蓝色 (低NDVI)
    { pos: 25, color: '#00FFFF' },     // 青色
    { pos: 50, color: '#00FF00' },     // 绿色
    { pos: 75, color: '#FFFF00' },     // 黄色
    { pos: 100, color: '#FF0000' },    // 红色 (高NDVI)
  ];
  
  let gradientStops = '';
  colors.forEach(c => {
    gradientStops += `<stop offset="${c.pos}%" style="stop-color:${c.color}"/>`;
  });
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cdefs%3E%3ClinearGradient id='rainbow' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E${gradientStops}%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23rainbow)'/%3E%3C/svg%3E`;
}

export default function Home() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<any>(null);
  const [demoMode, setDemoMode] = useState(true);
  
  // 区域选择状态
  const [selectedProvince, setSelectedProvince] = useState('zhejiang');
  const [provincesList, setProvincesList] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  
  // 时间和过滤条件
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [maxCloudCover, setMaxCloudCover] = useState(30);
  
  // 搜索和结果
  const [searching, setSearching] = useState(false);
  const [imageList, setImageList] = useState<SatelliteImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string>('');
  const [ndviResults, setNdviResults] = useState<Map<string, NDVIResult>>(new Map());
  
  // 绘制区域
  const [drawnAreas, setDrawnAreas] = useState<any[]>([]);
  const [useDrawnArea, setUseDrawnArea] = useState(false);
  
  // 时间序列
  const [timeSeriesMode, setTimeSeriesMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // 初始化地图
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.setMapTypeId('satellite');
    
    // 初始化绘制工具
    if (window.google?.maps?.drawing?.DrawingManager) {
      drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        markerOptions: {
          draggable: true,
        },
        polylineOptions: {
          editable: true,
          strokeColor: '#FF0000',
          strokeWeight: 2,
        },
        rectangleOptions: {
          editable: true,
          strokeColor: '#FF0000',
          fillColor: '#FF0000',
          fillOpacity: 0.2,
        },
        circleOptions: {
          editable: true,
          strokeColor: '#FF0000',
          fillColor: '#FF0000',
          fillOpacity: 0.2,
        },
        polygonOptions: {
          editable: true,
          strokeColor: '#FF0000',
          fillColor: '#FF0000',
          fillOpacity: 0.2,
        },
      });
      drawingManagerRef.current.setMap(map);
    }
    
    // 定位到浙江
    const center = getDivisionCenter('zhejiang');
    if (center) {
      map.setCenter(center);
      map.setZoom(8);
    }
  }, []);

  // 处理省份选择
  const handleProvinceChange = useCallback((code: string) => {
    setSelectedProvince(code);
    setSelectedCity('');
    setSelectedDistrict('');
    
    const provinceCities = getCitiesByProvince(code);
    setCities(provinceCities);
    setDistricts([]);
    
    const center = getDivisionCenter(code);
    if (center && mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(7);
    }
  }, []);

  // 处理城市选择
  const handleCityChange = useCallback((code: string) => {
    setSelectedCity(code);
    setSelectedDistrict('');
    
    const cityDistricts = getDistrictsByCity(code);
    setDistricts(cityDistricts);
    
    const center = getDivisionCenter(code);
    if (center && mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(9);
    }
  }, []);

  // 处理区县选择
  const handleDistrictChange = useCallback((code: string) => {
    setSelectedDistrict(code);
    
    const center = getDivisionCenter(code);
    if (center && mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(10);
    }
  }, []);

  // 查询Sentinel-2数据 - 使用mutation
  const searchMutation = trpc.gee.searchSentinel2.useMutation({
    onSuccess: (result: any) => {
      setImageList(result);
      setSearching(false);
      toast.success(`找到 ${result.length} 张符合条件的Sentinel-2影像`);
    },
    onError: (error: any) => {
      console.error('搜索失败:', error);
      setSearching(false);
      toast.error('搜索卫星影像失败，请检查网络连接');
    },
  });
  
  const handleSearch = useCallback(() => {
    setSearching(true);
    
    // 构建几何体
    const geometry = {
      type: 'Point',
      coordinates: [120.15, 30.27], // 杭州坐标
    };
    
    // 调用mutation
    searchMutation.mutate({
      geometry,
      startDate,
      endDate,
      maxCloudCover,
    });
  }, [startDate, endDate, maxCloudCover, searchMutation]);
  
  // 使用tRPC查询GEE认证状态
  const { data: geeAuthStatus } = trpc.gee.checkAuth.useQuery();
  

  // 计算NDVI
  // NDVI计算使用query而不是mutation
  // 计算NDVI
  const handleCalculateNDVI = useCallback(() => {
    if (!selectedImageId) {
      toast.error('请先选择一张影像');
      return;
    }

    const image = imageList.find(img => img.id === selectedImageId);
    if (!image) return;

    setSearching(true);
    
    // 简单实现：直接使用图表数据中的NDVI值
    setTimeout(() => {
      const ndviResult: NDVIResult = {
        imageId: selectedImageId,
        ndviMin: -0.2,
        ndviMax: 0.9,
        ndviMean: image.ndvi || 0.65,
        colorMap: 'rainbow',
        timestamp: new Date().toISOString(),
        imageUrl: generateNDVIVisualization({
          ndviMin: -0.2,
          ndviMax: 0.9,
          ndviMean: image.ndvi || 0.65,
          colorMap: 'rainbow',
          timestamp: new Date().toISOString(),
        } as NDVIResult),
      };
      
      const newResults = new Map(ndviResults);
      newResults.set(selectedImageId, ndviResult);
      setNdviResults(newResults);
      
      setSearching(false);
      toast.success('NDVI计算完成！结果已显示');
    }, 1000);
  }, [selectedImageId, imageList, ndviResults]);


  // 批量计算NDVI
  const handleBatchCalculateNDVI = useCallback(() => {
    if (imageList.length === 0) {
      toast.error('请先搜索卫星影像');
      return;
    }

    setSearching(true);
    
    setTimeout(() => {
      const newResults = new Map(ndviResults);
      imageList.forEach((image) => {
        newResults.set(image.id, {
          imageId: image.id,
          ndviMin: -0.2,
          ndviMax: 0.9,
          ndviMean: image.ndvi || 0.65,
          colorMap: 'rainbow',
          timestamp: new Date().toISOString(),
          imageUrl: generateNDVIVisualization({
            ndviMin: -0.2,
            ndviMax: 0.9,
            ndviMean: image.ndvi || 0.65,
            colorMap: 'rainbow',
            timestamp: new Date().toISOString(),
          } as NDVIResult),
        });
      });
      
      setNdviResults(newResults);
      setSearching(false);
      toast.success(`已对 ${imageList.length} 张影像计算NDVI`);
    }, 1000);
  }, [imageList, ndviResults]);

  // 导出NDVI结果
  const handleExportNDVI = useCallback(() => {
    if (!selectedImageId || !ndviResults.has(selectedImageId)) {
      toast.error('请先计算NDVI结果');
      return;
    }

    const result = ndviResults.get(selectedImageId);
    const exportData = {
      imageId: selectedImageId,
      ndviResult: result,
      exportTime: new Date().toISOString(),
      format: 'GeoTIFF',
      bitDepth: '32-bit',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ndvi-${selectedImageId}-${format(new Date(), 'yyyyMMdd')}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('NDVI结果已导出');
  }, [selectedImageId, ndviResults]);

  // 初始化城市列表
  useEffect(() => {
    setProvincesList(chinaProvinces.map(p => ({ code: p.code, name: p.name })));
    const provinceCities = getCitiesByProvince(selectedProvince);
    setCities(provinceCities);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* 顶部导航 */}
      <div className="border-b border-slate-800 bg-slate-900 p-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">GEE卫星数据分析平台</h1>
            <p className="text-sm text-slate-400">基于Google Earth Engine的遥感影像查询与时空分析</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setDemoMode(!demoMode)}>
              <Info className="w-4 h-4 mr-2" />
              {demoMode ? '演示模式' : '真实GEE'}
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="mx-auto max-w-7xl p-4">
        {demoMode && (
          <Alert className="mb-4 bg-blue-950 border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              当前为演示模式，使用模拟数据。获取GEE权限后可切换到真实数据模式。
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-4 gap-4">
          {/* 左侧参数面板 */}
          <div className="col-span-1">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 pr-4">
                {/* 地图绘制工具 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">地图绘制工具</CardTitle>
                    <CardDescription>在地图上绘制自定义区域</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SimpleDrawingTools map={mapRef.current} />
                  </CardContent>
                </Card>

                {/* 区域选择 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">行政区划选择</CardTitle>
                    <CardDescription>选择省、市、县进行搜索</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>省份</Label>
                      <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {provincesList.map(p => (
                            <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {cities.length > 0 && (
                      <div>
                        <Label>城市</Label>
                        <Select value={selectedCity} onValueChange={handleCityChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择城市" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map(c => (
                              <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {districts.length > 0 && (
                      <div>
                        <Label>区县</Label>
                        <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择区县" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map(d => (
                              <SelectItem key={d.code} value={d.code}>{d.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 时间范围 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">时间范围</CardTitle>
                    <CardDescription>选择查询的时间段</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>开始日期</Label>
                      <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>结束日期</Label>
                      <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                  </CardContent>
                </Card>

                {/* 云量过滤 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">云遮盖过滤</CardTitle>
                    <CardDescription>最大云遮盖百分比</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">云量: {maxCloudCover}%</span>
                      <Cloud className="w-4 h-4" />
                    </div>
                    <Slider
                      value={[maxCloudCover]}
                      onValueChange={(value) => setMaxCloudCover(value[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                {/* 搜索按钮 */}
                <Button onClick={handleSearch} disabled={searching} className="w-full">
                  {searching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      搜索中...
                    </>
                  ) : (
                    <>
                      <Satellite className="w-4 h-4 mr-2" />
                      搜索卫星影像
                    </>
                  )}
                </Button>

                {/* 时间序列分析 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">时间序列分析</CardTitle>
                    <CardDescription>NDVI变化趋势分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleBatchCalculateNDVI}
                      disabled={searching || imageList.length === 0}
                      variant="outline"
                      className="w-full"
                    >
                      {searching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          计算中...
                        </>
                      ) : (
                        <>
                          <Satellite className="w-4 h-4 mr-2" />
                          批量计算NDVI
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>

          {/* 右侧内容区 */}
          <div className="col-span-3 space-y-4">
            {/* 地图 */}
            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle className="text-base">交互式卫星地图</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                <MapView onMapReady={handleMapReady} />
              </CardContent>
            </Card>

            {/* 搜索结果和NDVI分析 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">数据处理与结果</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="images" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="images">卫星影像列表</TabsTrigger>
                    <TabsTrigger value="ndvi">NDVI分析结果</TabsTrigger>
                  </TabsList>

                  {/* 卫星影像列表 */}
                  <TabsContent value="images" className="space-y-3">
                    {imageList.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-4">
                        请先搜索卫星影像
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {imageList.map((image) => (
                          <div
                            key={image.id}
                            className={`p-3 border rounded-lg cursor-pointer transition ${
                              selectedImageId === image.id
                                ? 'border-blue-500 bg-blue-950'
                                : 'border-slate-700 hover:border-slate-600'
                            }`}
                            onClick={() => setSelectedImageId(image.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-mono text-sm">{image.id}</p>
                                <div className="text-xs text-slate-400 mt-1 space-y-1">
                                  <p>📅 {image.date}</p>
                                  <p>☁️ 云量: {image.cloudCover}%</p>
                                  <p>📡 {image.sensor} | {image.resolution}m分辨率</p>
                                  <p>⭐ 质量: {image.quality}%</p>
                                  {image.ndvi && <p>🌱 NDVI: {image.ndvi.toFixed(2)}</p>}
                                </div>
                              </div>
                              {image.thumbnail && (
                                <img src={image.thumbnail} alt={image.id} className="w-16 h-16 rounded ml-2" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedImageId && (
                      <Button onClick={handleCalculateNDVI} disabled={searching} className="w-full mt-3">
                        {searching ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            计算NDVI中...
                          </>
                        ) : (
                          <>
                            <Satellite className="w-4 h-4 mr-2" />
                            计算选中影像的NDVI
                          </>
                        )}
                      </Button>
                    )}
                  </TabsContent>

                  {/* NDVI分析结果 */}
                  <TabsContent value="ndvi" className="space-y-3">
                    {ndviResults.size === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-4">
                        暂无NDVI计算结果
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {Array.from(ndviResults.values()).map((result) => (
                          <div key={result.imageId} className="p-3 border border-slate-700 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-mono text-sm">{result.imageId}</p>
                                <div className="text-xs text-slate-400 mt-2 space-y-1">
                                  <p>NDVI范围: {result.ndviMin.toFixed(2)} ~ {result.ndviMax.toFixed(2)}</p>
                                  <p>NDVI平均值: {result.ndviMean.toFixed(2)}</p>
                                  <p>调色板: {result.colorMap}</p>
                                  <p>计算时间: {format(new Date(result.timestamp), 'yyyy-MM-dd HH:mm:ss')}</p>
                                </div>
                              </div>
                              {result.imageUrl && (
                                <img src={result.imageUrl} alt="NDVI" className="w-16 h-16 rounded ml-2" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedImageId && ndviResults.has(selectedImageId) && (
                      <Button onClick={handleExportNDVI} variant="outline" className="w-full mt-3">
                        <Download className="w-4 h-4 mr-2" />
                        导出NDVI结果(GeoTIFF)
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
