# 中国行政区划数据库

## 概述

本数据库包含中国全国34个省级行政区的完整行政区划数据，包括省、市、县三级行政区划信息。

**数据来源：** 用户提供的Word文档《全国34个省级单元.docx》  
**数据格式：** JSON  
**数据文件：** `china_admin_divisions.json`  
**最后更新：** 2026-01-12

## 数据统计

- **总记录数：** 3,306 条
- **省级行政区：** 34 个
- **地级市：** 365 个
- **县级行政区：** 2,907 个
- **坐标完整率：** 99.97%

## 数据结构

每条记录包含以下字段：

```typescript
interface AdministrativeDivision {
  adcode: string;      // 行政区划代码（6位数字）
  name: string;        // 行政区名称
  level: 'province' | 'city' | 'district';  // 行政级别
  lng: number;         // 经度
  lat: number;         // 纬度
  parentCode?: string; // 上级行政区代码
}
```

## 数据示例

```json
{
  "adcode": "110000",
  "name": "北京市",
  "level": "province",
  "lng": 116.4074,
  "lat": 39.9042
}
```

## API接口

本数据库通过tRPC提供以下查询接口：

### 1. 获取所有省份

```typescript
trpc.adminDivision.getProvinces.useQuery()
```

返回34个省级行政区的列表。

### 2. 获取省份下的城市

```typescript
trpc.adminDivision.getCitiesByProvince.useQuery({ provinceCode: '110000' })
```

返回指定省份下的所有地级市。

### 3. 获取城市下的区县

```typescript
trpc.adminDivision.getDistrictsByCity.useQuery({ cityCode: '110100' })
```

返回指定城市下的所有县级行政区。

### 4. 根据代码查询

```typescript
trpc.adminDivision.getByCode.useQuery({ adcode: '110000' })
```

根据行政区划代码查询单个行政区信息。

### 5. 模糊搜索

```typescript
trpc.adminDivision.search.useQuery({ keyword: '北京' })
```

根据关键词模糊搜索行政区。

### 6. 统计信息

```typescript
trpc.adminDivision.getStats.useQuery()
```

返回数据库的统计信息（总数、各级别数量等）。

## 使用说明

### 前端使用

```typescript
import { trpc } from '@/lib/trpc';

// 获取所有省份
const { data: provinces } = trpc.adminDivision.getProvinces.useQuery();

// 获取某个省份的城市
const { data: cities } = trpc.adminDivision.getCitiesByProvince.useQuery({
  provinceCode: selectedProvinceCode
});

// 获取某个城市的区县
const { data: districts } = trpc.adminDivision.getDistrictsByCity.useQuery({
  cityCode: selectedCityCode
});
```

### 后端使用

```typescript
import adminDivisionsData from './data/china_admin_divisions.json';

// 直接使用JSON数据
const provinces = adminDivisionsData.filter(d => d.level === 'province');
```

## 数据质量

- ✅ 所有省级行政区数据完整
- ✅ 所有地级市数据完整
- ✅ 所有县级行政区数据完整
- ✅ 99.97%的记录包含经纬度坐标
- ⚠️ 1个县级行政区缺失坐标数据

## 长期维护

本数据库将作为**标准地名数据源**长期保存和维护，用于：

1. **本项目**：GEE卫星数据分析平台的行政区划选择功能
2. **其他任务**：需要中国行政区划数据的其他项目
3. **数据参考**：作为标准的行政区划代码和坐标参考

## 数据更新

如需更新数据，请：

1. 更新 `china_admin_divisions.json` 文件
2. 更新本README中的统计信息
3. 更新"最后更新"日期
4. 运行测试验证数据完整性

## 相关文件

- `china_admin_divisions.json` - 主数据文件
- `liaoning_admin_data.json` - 辽宁省数据（已废弃，被主数据文件替代）
- `liaoning_admin_data.md` - 辽宁省数据文档（已废弃）

## 许可证

本数据库仅供学习和研究使用。
