# 高德开放平台 API 学习笔记

## 行政区域查询接口

### 关键信息
- **文档地址**: https://lbs.amap.com/api/webservice/guide/api-advanced/search
- **API类型**: Web服务 API (REST)
- **请求方式**: GET
- **服务地址**: https://restapi.amap.com/v3/place/text?parameters

### 核心参数说明

#### 必填参数
- `key`: Web服务 API 密钥（由用户提供）
- `keywords` 或 `types`: 查询关键字或POI类型（二选一）

#### 关键可选参数
- `city`: 查询城市，可以是城市中文、citycode、adcode
  - citycode: 精确到城市级别（如北京：010）
  - adcode: 精确到区县级别（如北京海淀区：110108）
  - **重要**: 建议使用adcode以获得精确的区县级查询
  
- `citylimit`: 仅返回指定城市数据 (true/false)
- `extensions`: 返回结果控制
  - `base`: 基本地址信息（默认）
  - `all`: 返回地址信息、附近POI、道路、交叉口等完整信息

#### 分页参数
- `offset`: 每页记录数（建议不超过25）
- `page`: 当前页数

### 返回数据结构

#### 主要返回字段
- `status`: 结果状态 (0=失败, 1=成功)
- `info`: 状态说明
- `count`: 搜索方案数目
- `pois`: POI信息列表

#### POI对象主要字段
- `id`: 唯一ID
- `name`: 名称
- `type`: 兴趣点类型（大类;中类;小类）
- `typecode`: 类型编码（6位数字）
- `address`: 地址
- `location`: 经纬度 (格式: X,Y)
- `pname`: 省份名称
- `cityname`: 城市名
- `adname`: 区域名称（区县级）
- `adcode`: 区域编码

### 行政区划查询方案

#### 方案1: 使用行政区划关键字
```
keywords=北京市 (查询北京市)
keywords=北京市朝阳区 (查询朝阳区)
```

#### 方案2: 使用adcode精确查询
```
adcode=110000 (北京市)
adcode=110108 (北京市朝阳区)
```

### 中国行政区划三级结构
1. **省级**: 直辖市、省等 (adcode 6位，后4位为0000)
2. **市级**: 地级市等 (adcode 6位，后2位为00)
3. **县级**: 区县等 (adcode 6位，完整编码)

### 使用建议
1. 使用adcode而非citycode以获得精确的区县级数据
2. 设置`extensions=all`以获得完整的地理信息
3. 返回数据包含经纬度，可用于地图定位
4. 可以通过递归查询实现省市县三级联动

## 实现计划

1. **后端**: 创建高德API调用服务，缓存行政区划数据
2. **前端**: 实现三级联动选择器（省→市→县）
3. **地图**: 选择地点时自动定位并显示地理边界
4. **集成**: 与现有的GEE查询功能结合
