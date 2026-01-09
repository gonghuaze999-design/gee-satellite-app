import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Calendar as CalendarIcon, Satellite, Download, Eye, Info, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { MapView } from "@/components/Map";
import { DrawingTools } from "@/components/DrawingTools";
import { getCountries, getProvinces, getDivisionCenter, getDivisionBounds } from "@/data/administrative-divisions";

interface ImageInfo {
  id: string;
  date: string;
  cloudCover: number;
  bounds?: google.maps.LatLngBoundsLiteral;
}

export default function Home() {
  const [geeReady, setGeeReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // 搜索参数
  const [country, setCountry] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2023, 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [imageList, setImageList] = useState<ImageInfo[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [calculateNDVI, setCalculateNDVI] = useState(false);
  
  // 当前图层
  const [currentOverlay, setCurrentOverlay] = useState<google.maps.ImageMapType | null>(null);
  
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
    const center = getDivisionCenter(countryCode);
    if (center && mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(4);
    }
  }, []);

  // 处理省份选择
  const handleProvinceChange = useCallback((provinceCode: string) => {
    setProvince(provinceCode);
    const center = getDivisionCenter(provinceCode);
    const bounds = getDivisionBounds(provinceCode);
    if (mapRef.current) {
      if (bounds) {
        const latLngBounds = new google.maps.LatLngBounds(
          { lat: bounds.south, lng: bounds.west },
          { lat: bounds.north, lng: bounds.east }
        );
        mapRef.current.fitBounds(latLngBounds);
      } else if (center) {
        mapRef.current.setCenter(center);
        mapRef.current.setZoom(6);
      }
    }
  }, []);

  // 用户认证
  const handleLogin = useCallback(() => {
    if (!window.ee) {
      toast.error('Earth Engine未加载，请使用演示模式');
      return;
    }

    window.ee.data.authenticateViaPopup((success: boolean) => {
      if (success) {
        setAuthenticated(true);
        setDemoMode(false);
        toast.success('登录成功，已切换到真实GEE模式');
      } else {
        toast.error('登录失败');
      }
    });
  }, []);

  // 生成演示数据
  const generateDemoData = useCallback((start: Date, end: Date): ImageInfo[] => {
    const images: ImageInfo[] = [];
    const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const imageCount = Math.min(Math.floor(daysDiff / 10), 10); // 每10天一个影像，最多10个
    
    for (let i = 0; i < imageCount; i++) {
      const date = new Date(start.getTime() + (daysDiff / imageCount) * i * 24 * 60 * 60 * 1000);
      images.push({
        id: `DEMO/S2_SR/${format(date, 'yyyyMMdd')}_${Math.random().toString(36).substr(2, 9)}`,
        date: format(date, 'yyyy-MM-dd'),
        cloudCover: Math.random() * 30,
        bounds: {
          north: 36.0 + Math.random() * 2,
          south: 34.0 + Math.random() * 2,
          east: 106.0 + Math.random() * 2,
          west: 104.0 + Math.random() * 2,
        }
      });
    }
    
    return images.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  // 搜索影像（演示模式）
  const handleDemoSearch = useCallback(() => {
    if (!startDate || !endDate) {
      toast.error('请选择时间范围');
      return;
    }

    setLoading(true);
    
    // 模拟网络延迟
    setTimeout(() => {
      const demoImages = generateDemoData(startDate, endDate);
      setImageList(demoImages);
      setLoading(false);
      toast.success(`找到 ${demoImages.length} 个演示影像`);
    }, 1000);
  }, [startDate, endDate, generateDemoData]);

  // 搜索影像（真实GEE模式）
  const handleRealSearch = useCallback(async () => {
    if (!geeReady || !authenticated) {
      toast.error('请先登录GEE账户');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('请选择时间范围');
      return;
    }

    try {
      setLoading(true);
      
      const collection = window.ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
        .filterDate(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))
        .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 30);

      collection.size().evaluate((count: number) => {
        if (count === 0) {
          toast.info('未找到符合条件的影像');
          setImageList([]);
          setLoading(false);
          return;
        }

        const limit = Math.min(count, 10);
        collection.limit(limit).getInfo((info: any) => {
          const images: ImageInfo[] = info.features.map((feature: any) => ({
            id: feature.id,
            date: feature.properties['system:time_start'] 
              ? new Date(feature.properties['system:time_start']).toISOString().split('T')[0]
              : 'Unknown',
            cloudCover: feature.properties['CLOUDY_PIXEL_PERCENTAGE'] || 0,
          }));
          
          setImageList(images);
          setLoading(false);
          toast.success(`找到 ${count} 个影像，显示前 ${limit} 个`);
        });
      });
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('搜索失败');
      setLoading(false);
    }
  }, [geeReady, authenticated, startDate, endDate]);

  // 统一搜索入口
  const handleSearch = useCallback(() => {
    if (demoMode) {
      handleDemoSearch();
    } else {
      handleRealSearch();
    }
  }, [demoMode, handleDemoSearch, handleRealSearch]);

  // 可视化影像（演示模式）
  const handleDemoVisualize = useCallback((image: ImageInfo) => {
    if (!mapRef.current) {
      toast.error('地图未就绪');
      return;
    }

    // 移除之前的图层
    if (currentOverlay) {
      mapRef.current.overlayMapTypes.clear();
    }

    // 使用Sentinel-2的真实瓦片服务作为演示
    const tileUrl = calculateNDVI
      ? `https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/demo-ndvi/tiles/{z}/{x}/{y}`
      : `https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/demo-rgb/tiles/{z}/{x}/{y}`;

    const imageMapType = new google.maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        return tileUrl
          .replace('{z}', zoom.toString())
          .replace('{x}', coord.x.toString())
          .replace('{y}', coord.y.toString());
      },
      tileSize: new google.maps.Size(256, 256),
      opacity: 0.8,
      name: calculateNDVI ? 'NDVI' : 'RGB',
    });

    mapRef.current.overlayMapTypes.push(imageMapType);
    setCurrentOverlay(imageMapType);

    // 移动地图到影像范围
    if (image.bounds) {
      mapRef.current.fitBounds(image.bounds);
    }

    toast.success(calculateNDVI ? '演示NDVI图层已加载' : '演示RGB图层已加载');
  }, [calculateNDVI, currentOverlay]);

  // 可视化影像（真实GEE模式）
  const handleRealVisualize = useCallback((imageId: string) => {
    if (!mapRef.current || !geeReady || !authenticated) {
      toast.error('GEE未就绪');
      return;
    }

    try {
      if (currentOverlay) {
        mapRef.current.overlayMapTypes.clear();
      }

      const image = window.ee.Image(imageId);
      let vizImage = image;
      let vizParams: any = {};

      if (calculateNDVI) {
        const ndvi = image.normalizedDifference(['B8', 'B4']);
        vizImage = ndvi;
        vizParams = {
          min: -1,
          max: 1,
          palette: ['blue', 'cyan', 'green', 'yellow', 'red']
        };
      } else {
        vizParams = {
          bands: ['B4', 'B3', 'B2'],
          min: 0,
          max: 3000,
          gamma: 1.4
        };
      }

      vizImage.getMap(vizParams, (mapId: any) => {
        const tileSource = new window.ee.layers.EarthEngineTileSource(mapId);
        const overlay = new window.ee.layers.ImageOverlay(tileSource);
        
        if (mapRef.current && mapRef.current.overlayMapTypes) {
          mapRef.current.overlayMapTypes.push(overlay);
          setCurrentOverlay(overlay);
          toast.success(calculateNDVI ? 'NDVI计算完成' : '影像加载完成');
        }
      });
    } catch (error) {
      console.error('Visualization failed:', error);
      toast.error('可视化失败');
    }
  }, [geeReady, authenticated, calculateNDVI, currentOverlay]);

  // 统一可视化入口
  const handleVisualize = useCallback((imageId: string) => {
    const image = imageList.find(img => img.id === imageId);
    if (!image) return;

    if (demoMode) {
      handleDemoVisualize(image);
    } else {
      handleRealVisualize(imageId);
    }
  }, [demoMode, imageList, handleDemoVisualize, handleRealVisualize]);

  // 下载影像
  const handleDownload = useCallback((imageId: string) => {
    if (demoMode) {
      toast.info('演示模式下载功能不可用，请使用真实GEE模式');
    } else {
      toast.info('导出功能需要配置服务账户，请联系管理员');
    }
  }, [demoMode]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Satellite className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">GEE卫星数据分析平台</h1>
                <p className="text-sm text-muted-foreground">基于Google Earth Engine的遥感影像检索与分析</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {demoMode ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    演示模式
                  </div>
                  <Button onClick={handleLogin} disabled={!geeReady} variant="outline">
                    切换到真实GEE
                  </Button>
                </div>
              ) : authenticated ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  GEE已连接
                </div>
              ) : (
                <Button onClick={handleLogin} disabled={!geeReady}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  使用Google账户登录
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6">
        {/* 提示信息 */}
        {demoMode && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              当前为演示模式，显示模拟数据。如需使用真实的Google Earth Engine数据，请先在
              <a href="https://code.earthengine.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline mx-1">
                GEE官网
              </a>
              申请访问权限，然后点击右上角"切换到真实GEE"按钮登录。
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-1 space-y-4">
            {/* 地图绘制 */}
            <DrawingTools 
              map={mapRef.current}
              onDrawingComplete={(geometry) => {
                setDrawnGeometry(geometry);
                setUseDrawnArea(true);
              }}
              onDrawingCleared={() => {
                setDrawnGeometry(null);
                setUseDrawnArea(false);
              }}
            />

            {/* 区域选择 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
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
                {country && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">省份/州</label>
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
                )}
              </CardContent>
            </Card>

            {/* 时间选择 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  时间范围
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">开始日期</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'yyyy-MM-dd') : '选择日期'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">结束日期</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'yyyy-MM-dd') : '选择日期'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* 分析选项 */}
            <Card>
              <CardHeader>
                <CardTitle>在线分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ndvi" 
                    checked={calculateNDVI}
                    onCheckedChange={(checked) => setCalculateNDVI(checked as boolean)}
                  />
                  <label htmlFor="ndvi" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    计算NDVI植被指数
                  </label>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSearch} className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              搜索影像
            </Button>
          </div>

          {/* 右侧地图和结果 */}
          <div className="lg:col-span-3 space-y-4">
            {/* 地图 */}
            <Card>
              <CardContent className="p-0">
                <MapView 
                  className="w-full h-[500px] rounded-lg"
                  initialCenter={{ lat: 35.0, lng: 105.0 }}
                  initialZoom={4}
                  onMapReady={handleMapReady}
                />
              </CardContent>
            </Card>

            {/* 搜索结果 */}
            {imageList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>搜索结果</CardTitle>
                  <CardDescription>
                    找到 {imageList.length} 个{demoMode ? '演示' : 'Sentinel-2'}影像
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {imageList.map((image) => (
                        <div
                          key={image.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedImage === image.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedImage(image.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{image.id}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                日期: {image.date} | 云量: {image.cloudCover.toFixed(1)}%
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVisualize(image.id);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                显示
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(image.id);
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                导出
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
