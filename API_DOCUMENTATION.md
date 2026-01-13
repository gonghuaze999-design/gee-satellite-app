# 行政区划数据库 API 文档

## 概述

本API提供全国34个省级单元的完整行政区划数据查询服务，包括省、市、县三级行政区划信息。

**数据来源：** 全国34个省级单元Word文档  
**数据规模：**
- 省级行政区：34个
- 地级市：365个
- 县级行政区：2,907个
- 总计：3,306条记录

**最后更新：** 2026-01-12

---

## 数据结构

### AdministrativeRegion

```typescript
interface AdministrativeRegion {
  name: string;           // 行政区名称
  adcode: string;         // 行政区代码（6位）
  level: 'province' | 'city' | 'district';  // 行政级别
  lng: number;            // 经度
  lat: number;            // 纬度
  provinceCode: string;   // 所属省份代码
  provinceName: string;   // 所属省份名称
  cityCode?: string;      // 所属地级市代码（仅县级有）
  cityName?: string;      // 所属地级市名称（仅县级有）
}
```

---

## API 接口

### 1. 获取所有省级行政区

**接口路径：** `trpc.adminDivision.getProvinces.useQuery()`

**请求参数：** 无

**返回数据：**
```typescript
AdministrativeRegion[]  // 34个省级行政区数组
```

**示例：**
```typescript
const { data: provinces } = trpc.adminDivision.getProvinces.useQuery();
// 返回：
// [
//   { name: "北京市", adcode: "110000", level: "province", lng: 116.4074, lat: 39.9042, ... },
//   { name: "辽宁省", adcode: "210000", level: "province", lng: 123.4351, lat: 41.8367, ... },
//   ...
// ]
```

---

### 2. 根据省份代码获取所有地级市

**接口路径：** `trpc.adminDivision.getCitiesByProvince.useQuery()`

**请求参数：**
```typescript
{
  provinceCode: string  // 省份行政区代码（如：210000）
}
```

**返回数据：**
```typescript
AdministrativeRegion[]  // 该省份下的所有地级市数组
```

**示例：**
```typescript
const { data: cities } = trpc.adminDivision.getCitiesByProvince.useQuery({
  provinceCode: "210000"  // 辽宁省
});
// 返回：
// [
//   { name: "沈阳市", adcode: "210100", level: "city", lng: 123.4568, lat: 41.7957, ... },
//   { name: "大连市", adcode: "210200", level: "city", lng: 121.6450, lat: 38.9184, ... },
//   ...
// ]
```

---

### 3. 根据地级市代码获取所有县级行政区

**接口路径：** `trpc.adminDivision.getDistrictsByCity.useQuery()`

**请求参数：**
```typescript
{
  cityCode: string  // 地级市行政区代码（如：210100）
}
```

**返回数据：**
```typescript
AdministrativeRegion[]  // 该地级市下的所有县级行政区数组
```

**示例：**
```typescript
const { data: districts } = trpc.adminDivision.getDistrictsByCity.useQuery({
  cityCode: "210100"  // 沈阳市
});
// 返回：
// [
//   { name: "和平区", adcode: "210102", level: "district", lng: 123.4568, lat: 41.7957, cityName: "沈阳市", ... },
//   { name: "沈河区", adcode: "210103", level: "district", lng: 123.4588, lat: 41.7957, cityName: "沈阳市", ... },
//   ...
// ]
```

---

### 4. 根据行政区代码获取详细信息

**接口路径：** `trpc.adminDivision.getRegionByAdcode.useQuery()`

**请求参数：**
```typescript
{
  adcode: string  // 行政区代码（6位）
}
```

**返回数据：**
```typescript
AdministrativeRegion  // 行政区详细信息
```

**示例：**
```typescript
const { data: region } = trpc.adminDivision.getRegionByAdcode.useQuery({
  adcode: "210102"  // 沈阳市和平区
});
// 返回：
// {
//   name: "和平区",
//   adcode: "210102",
//   level: "district",
//   lng: 123.4568,
//   lat: 41.7957,
//   provinceCode: "210000",
//   provinceName: "辽宁省",
//   cityCode: "210100",
//   cityName: "沈阳市"
// }
```

---

### 5. 搜索行政区（模糊匹配）

**接口路径：** `trpc.adminDivision.searchRegions.useQuery()`

**请求参数：**
```typescript
{
  keyword: string  // 搜索关键词
}
```

**返回数据：**
```typescript
AdministrativeRegion[]  // 匹配的行政区数组
```

**示例：**
```typescript
const { data: results } = trpc.adminDivision.searchRegions.useQuery({
  keyword: "朝阳"
});
// 返回：
// [
//   { name: "朝阳区", adcode: "110105", level: "district", cityName: "北京市", ... },
//   { name: "朝阳区", adcode: "220104", level: "district", cityName: "长春市", ... },
//   { name: "朝阳市", adcode: "211300", level: "city", provinceName: "辽宁省", ... },
//   { name: "朝阳县", adcode: "211321", level: "district", cityName: "朝阳市", ... },
//   ...
// ]
```

---

### 6. 获取数据库统计信息

**接口路径：** `trpc.adminDivision.getStatistics.useQuery()`

**请求参数：** 无

**返回数据：**
```typescript
{
  totalProvinces: number;    // 省级行政区总数
  totalCities: number;       // 地级市总数
  totalDistricts: number;    // 县级行政区总数
  totalRegions: number;      // 总记录数
  dataSource: string;        // 数据来源
  lastUpdated: string;       // 最后更新日期
}
```

**示例：**
```typescript
const { data: stats } = trpc.adminDivision.getStatistics.useQuery();
// 返回：
// {
//   totalProvinces: 34,
//   totalCities: 365,
//   totalDistricts: 2907,
//   totalRegions: 3306,
//   dataSource: "全国34个省级单元Word文档",
//   lastUpdated: "2026-01-12"
// }
```

---

## 使用示例

### 完整的三级联动选择器

```typescript
import { trpc } from '@/lib/trpc';
import { useState } from 'react';

function AdminDivisionSelector() {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // 获取所有省份
  const { data: provinces } = trpc.adminDivision.getProvinces.useQuery();

  // 获取选中省份的城市
  const { data: cities } = trpc.adminDivision.getCitiesByProvince.useQuery(
    { provinceCode: selectedProvince },
    { enabled: !!selectedProvince }
  );

  // 获取选中城市的区县
  const { data: districts } = trpc.adminDivision.getDistrictsByCity.useQuery(
    { cityCode: selectedCity },
    { enabled: !!selectedCity }
  );

  return (
    <div>
      <select onChange={(e) => {
        setSelectedProvince(e.target.value);
        setSelectedCity('');
        setSelectedDistrict('');
      }}>
        <option value="">请选择省份</option>
        {provinces?.map(p => (
          <option key={p.adcode} value={p.adcode}>{p.name}</option>
        ))}
      </select>

      <select onChange={(e) => {
        setSelectedCity(e.target.value);
        setSelectedDistrict('');
      }} disabled={!selectedProvince}>
        <option value="">请选择城市</option>
        {cities?.map(c => (
          <option key={c.adcode} value={c.adcode}>{c.name}</option>
        ))}
      </select>

      <select onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedCity}>
        <option value="">请选择区县</option>
        {districts?.map(d => (
          <option key={d.adcode} value={d.adcode}>{d.name}</option>
        ))}
      </select>
    </div>
  );
}
```

---

## 错误处理

所有API接口在出现错误时会抛出异常，建议使用tRPC的错误处理机制：

```typescript
const { data, error, isError } = trpc.adminDivision.getRegionByAdcode.useQuery({
  adcode: "999999"  // 不存在的代码
});

if (isError) {
  console.error('查询失败:', error.message);
  // 错误信息：未找到行政区代码为 999999 的行政区
}
```

---

## 注意事项

1. **行政区代码格式：** 所有行政区代码均为6位字符串
   - 省级：后4位为0（如：210000）
   - 地级：后2位为0（如：210100）
   - 县级：6位数字（如：210102）

2. **直辖市处理：** 北京、天津、上海、重庆四个直辖市的provinceCode和cityCode相同

3. **特别行政区：** 香港（810000）、澳门（820000）、台湾（710000）也包含在数据库中

4. **坐标系统：** 所有经纬度坐标使用WGS84坐标系

5. **数据完整性：** 所有3,306条记录均包含完整的名称、代码、经纬度信息

---

## 测试建议

建议测试以下场景：
1. 查询所有省份（应返回34条）
2. 查询辽宁省的城市（应返回14个地级市）
3. 查询沈阳市的区县（应返回13个县级行政区）
4. 搜索"朝阳"（应返回多个匹配结果）
5. 查询不存在的代码（应返回错误）
