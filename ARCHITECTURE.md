# GEE卫星数据分析平台 - 前后端分离架构设计

## 1. 系统架构概览

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端 (React + Next.js)                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  查询界面组件                                              │   │
│  │  - 行政区划选择 (Province/City/District)                 │   │
│  │  - 时间范围选择 (startDate/endDate)                      │   │
│  │  - 云量阈值过滤 (maxCloudCover)                          │   │
│  │  - 搜索按钮                                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓ tRPC调用                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  结果展示组件                                              │   │
│  │  - 影像列表 (date, cloudCover, quality, sensor)          │   │
│  │  - 缩略图显示 (GEE URL)                                   │   │
│  │  - 影像详情面板                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           ↕ tRPC API
┌─────────────────────────────────────────────────────────────────┐
│                    后端 (Express + tRPC)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  tRPC路由: gee.searchSentinel2                           │   │
│  │  输入参数:                                               │   │
│  │  - geometry: {type, coordinates}                        │   │
│  │  - startDate: string (YYYY-MM-DD)                       │   │
│  │  - endDate: string (YYYY-MM-DD)                         │   │
│  │  - maxCloudCover: number (0-100)                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  GEE查询执行层 (query_sentinel2.py)                      │   │
│  │  - 认证处理 (PEM格式修复)                                │   │
│  │  - 几何体转换                                            │   │
│  │  - Sentinel-2数据查询                                    │   │
│  │  - 缩略图生成                                            │   │
│  │  - 结果组装                                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Google Earth Engine API                                 │   │
│  │  - COPERNICUS/S2_SR_HARMONIZED                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 2. API契约定义

### 2.1 查询接口 (tRPC Procedure)

**路由**: `gee.searchSentinel2`

**输入参数** (SearchSentinel2Input):
```typescript
{
  // 几何体信息（可选，如不提供则使用行政区划边界）
  geometry?: {
    type: 'Polygon' | 'Point' | 'Rectangle';
    coordinates: number[][] | number[];
  };
  
  // 时间范围
  startDate: string;        // 格式: YYYY-MM-DD
  endDate: string;          // 格式: YYYY-MM-DD
  
  // 云量阈值
  maxCloudCover: number;    // 0-100，单位: %
  
  // 行政区划（用于生成geometry）
  province?: string;        // 省份名称
  city?: string;            // 城市名称
  district?: string;        // 区县名称
}
```

**返回数据** (SearchSentinel2Output):
```typescript
{
  success: boolean;
  data?: {
    total: number;           // 返回的影像总数
    images: Array<{
      id: string;            // GEE影像ID
      date: string;          // 获取日期 (YYYY-MM-DD)
      utcTime: string;       // UTC时间戳 (ISO 8601)
      cloudCover: number;    // 云覆盖百分比 (0-100)
      quality: number;       // 质量评分 (0-100)
      sensor: string;        // 传感器名称 (Sentinel-2)
      resolution: number;    // 分辨率 (10)
      thumbnail: string;     // 缩略图URL (GEE getPixels URL)
      ndvi?: number;         // NDVI值 (可选，延迟计算)
    }>;
  };
  error?: string;            // 错误信息
}
```

### 2.2 数据流说明

1. **前端收集查询条件**
   - 用户在UI中选择行政区划（省/市/区）
   - 用户选择时间范围
   - 用户设置云量阈值
   - 用户点击"搜索"按钮

2. **前端调用后端API**
   ```typescript
   const { data } = await trpc.gee.searchSentinel2.useMutation({
     province: '北京市',
     city: '朝阳区',
     startDate: '2024-01-01',
     endDate: '2024-06-30',
     maxCloudCover: 30
   });
   ```

3. **后端处理流程**
   - 接收查询参数
   - 根据行政区划获取边界坐标
   - 调用Python脚本执行GEE查询
   - 解析GEE返回的影像数据
   - 组装响应数据
   - 返回给前端

4. **前端显示结果**
   - 显示影像总数
   - 列表显示每张影像的元数据
   - 显示GEE缩略图URL对应的图片
   - 支持点击影像查看详情

## 3. 后端实现细节

### 3.1 tRPC路由器 (server/routers/gee.ts)

```typescript
// 定义输入schema
const SearchSentinel2Input = z.object({
  geometry: z.object({
    type: z.enum(['Polygon', 'Point', 'Rectangle']),
    coordinates: z.array(z.any())
  }).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  maxCloudCover: z.number().min(0).max(100),
  province: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
});

// 定义输出schema
const SearchSentinel2Output = z.object({
  success: z.boolean(),
  data: z.object({
    total: z.number(),
    images: z.array(z.object({
      id: z.string(),
      date: z.string(),
      utcTime: z.string(),
      cloudCover: z.number(),
      quality: z.number(),
      sensor: z.string(),
      resolution: z.number(),
      thumbnail: z.string(),
      ndvi: z.number().optional(),
    }))
  }).optional(),
  error: z.string().optional(),
});

// 实现procedure
export const geeRouter = createTRPCRouter({
  searchSentinel2: publicProcedure
    .input(SearchSentinel2Input)
    .output(SearchSentinel2Output)
    .mutation(async ({ input }) => {
      try {
        // 1. 根据行政区划获取geometry
        const geometry = getGeometryFromAdminDivision(
          input.province,
          input.city,
          input.district
        ) || input.geometry;

        // 2. 调用Python脚本
        const result = await executeGEEQuery({
          geometry,
          startDate: input.startDate,
          endDate: input.endDate,
          maxCloudCover: input.maxCloudCover,
        });

        // 3. 组装响应
        return {
          success: true,
          data: {
            total: result.length,
            images: result.map(img => ({
              id: img.id,
              date: img.date,
              utcTime: img.utcTime,
              cloudCover: img.cloudCover,
              quality: img.quality,
              sensor: img.sensor,
              resolution: img.resolution,
              thumbnail: img.thumbnail,
            }))
          }
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    })
});
```

### 3.2 Python执行层 (server/scripts/query_sentinel2.py)

- 输入: JSON格式的查询参数
- 输出: JSON格式的影像列表
- 职责:
  - GEE认证
  - 几何体处理
  - Sentinel-2数据查询
  - 缩略图URL生成
  - 结果序列化

## 4. 前端实现细节

### 4.1 查询组件 (client/src/components/SatelliteSearch.tsx)

职责:
- 收集用户输入（行政区划、时间、云量）
- 调用tRPC mutation
- 显示加载状态
- 处理错误

### 4.2 结果显示组件 (client/src/components/ImageList.tsx)

职责:
- 显示影像列表
- 显示缩略图（使用GEE URL）
- 显示元数据（日期、云量、质量等）
- 支持点击查看详情

### 4.3 详情面板 (client/src/components/ImageDetail.tsx)

职责:
- 显示单张影像的完整信息
- 显示高分辨率缩略图
- 支持NDVI计算
- 支持导出

## 5. 数据流示例

### 5.1 查询流程

```
用户输入:
  Province: 北京市
  City: 朝阳区
  StartDate: 2024-01-01
  EndDate: 2024-06-30
  MaxCloudCover: 30

↓ 前端调用 tRPC mutation

后端处理:
  1. 获取朝阳区的边界坐标 (116.4, 39.9, 116.7, 40.2)
  2. 调用 Python脚本:
     python3 query_sentinel2.py '{
       "geometry": {"type": "Rectangle", "coordinates": [...]},
       "startDate": "2024-01-01",
       "endDate": "2024-06-30",
       "maxCloudCover": 30
     }'
  3. GEE查询并返回38张影像
  4. 解析结果并组装响应

↓ 返回结果

前端显示:
  总数: 38张
  列表:
    1. 2024-06-24 | 云量: 1.56% | 质量: 98.44% | 缩略图URL
    2. 2024-06-21 | 云量: 0.23% | 质量: 99.77% | 缩略图URL
    ...
    38. 2024-01-03 | 云量: 10.95% | 质量: 89.05% | 缩略图URL
```

## 6. 关键设计原则

1. **前后端分离**: 前端只负责UI交互和展示，后端负责业务逻辑和GEE调用
2. **API契约清晰**: 明确定义输入输出，使用TypeScript/Zod进行类型检查
3. **错误处理**: 每层都有适当的错误处理和日志记录
4. **性能考虑**: 缩略图使用GEE提供的URL，不在后端生成
5. **可维护性**: 模块化设计，易于扩展和修改

## 7. 环境变量和配置

后端需要的环境变量:
- `GEE_SERVICE_ACCOUNT_KEY`: GEE服务账户密钥（JSON格式）
- `DATABASE_URL`: 数据库连接字符串（可选，用于缓存）

前端需要的环境变量:
- `VITE_APP_ID`: Manus OAuth应用ID
- `VITE_OAUTH_PORTAL_URL`: OAuth登录门户URL

## 8. 缓存策略（可选）

为了提高性能，可以在数据库中缓存查询结果:
- 缓存键: `{province}_{city}_{district}_{startDate}_{endDate}_{maxCloudCover}`
- 缓存有效期: 24小时
- 缓存表: `gee_query_cache`

## 9. 扩展计划

1. **NDVI计算**: 支持在线计算NDVI并可视化
2. **数据导出**: 支持导出GeoTIFF、COG等格式
3. **时间序列分析**: 支持多时间点的NDVI变化分析
4. **高级过滤**: 支持按传感器、质量等多维度过滤
5. **用户收藏**: 支持保存常用查询条件和结果

---

**最后更新**: 2024-01-10
**版本**: 1.0
