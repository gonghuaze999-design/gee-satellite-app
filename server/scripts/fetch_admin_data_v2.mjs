#!/usr/bin/env node
/**
 * 从modood数据 + 高德地理编码获取完整的中国行政区划数据
 * 用法: node fetch_admin_data_v2.mjs
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 获取环境变量
const AMAP_API_KEY = process.env.AMAP_API_KEY;
if (!AMAP_API_KEY) {
  console.error('ERROR: AMAP_API_KEY environment variable not set');
  process.exit(1);
}

const BASE_URL = 'https://restapi.amap.com/v3/config/district';
const GEOCODE_URL = 'https://restapi.amap.com/v3/geocode/geo';

// 缓存坐标，避免重复查询
const coordCache = {};

async function getCoordinates(name, province = '') {
  const cacheKey = `${province}${name}`;
  if (coordCache[cacheKey]) {
    return coordCache[cacheKey];
  }

  try {
    const searchName = province ? `${province}${name}` : name;
    const response = await axios.get(GEOCODE_URL, {
      params: {
        address: searchName,
        key: AMAP_API_KEY
      },
      timeout: 5000
    });

    if (response.data.status === '1' && response.data.geocodes && response.data.geocodes.length > 0) {
      const location = response.data.geocodes[0].location;
      const [lng, lat] = location.split(',');
      const coord = { lat: parseFloat(lat), lng: parseFloat(lng) };
      coordCache[cacheKey] = coord;
      return coord;
    }
  } catch (error) {
    // 忽略错误，使用默认坐标
  }

  return { lat: 0, lng: 0 };
}

async function fetchDistrictsHierarchy(keywords = '', subdistrict = 1) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        keywords,
        subdistrict,
        key: AMAP_API_KEY
      },
      timeout: 10000
    });

    if (response.data.status === '1') {
      return response.data.districts || [];
    }
  } catch (error) {
    console.error(`Request Error: ${error.message}`);
  }

  return [];
}

function flattenDistricts(districts, level = 'province', parentInfo = {}) {
  const result = { provinces: [], cities: [], districts: [] };

  for (const district of districts) {
    const [lng, lat] = district.center ? district.center.split(',').map(parseFloat) : [0, 0];

    const item = {
      name: district.name,
      adcode: district.adcode,
      level,
      lat,
      lng,
      center: district.center || ''
    };

    if (level === 'province') {
      result.provinces.push(item);

      // 递归处理下一级
      if (district.districts && district.districts.length > 0) {
        const subResult = flattenDistricts(district.districts, 'city', { provinceName: item.name, provinceAdcode: item.adcode });
        result.cities.push(...subResult.cities);
        result.districts.push(...subResult.districts);
      }
    } else if (level === 'city') {
      item.provinceAdcode = parentInfo.provinceAdcode;
      item.provinceName = parentInfo.provinceName;
      result.cities.push(item);

      // 递归处理下一级
      if (district.districts && district.districts.length > 0) {
        const subResult = flattenDistricts(district.districts, 'district', {
          provinceName: parentInfo.provinceName,
          provinceAdcode: parentInfo.provinceAdcode,
          cityName: item.name,
          cityAdcode: item.adcode
        });
        result.districts.push(...subResult.districts);
      }
    } else if (level === 'district') {
      item.provinceAdcode = parentInfo.provinceAdcode;
      item.provinceName = parentInfo.provinceName;
      item.cityAdcode = parentInfo.cityAdcode;
      item.cityName = parentInfo.cityName;
      result.districts.push(item);
    }
  }

  return result;
}

async function main() {
  console.log('开始从高德API获取完整的行政区划数据...');
  console.log(`API Key: ${AMAP_API_KEY.substring(0, 20)}...`);

  // 第1步：获取所有省份及其下级行政区
  console.log('\n[1/2] 获取所有省份及其下级行政区...');
  const allDistrictsData = await fetchDistrictsHierarchy('', 3); // subdistrict=3 获取3级数据

  if (allDistrictsData.length === 0) {
    console.error('ERROR: Failed to fetch districts');
    process.exit(1);
  }

  console.log(`找到 ${allDistrictsData.length} 个省份`);

  // 展平数据结构
  console.log('\n[2/2] 处理数据并补充坐标...');
  const flatData = flattenDistricts(allDistrictsData, 'province');

  console.log(`  - 省份: ${flatData.provinces.length}`);
  console.log(`  - 城市: ${flatData.cities.length}`);
  console.log(`  - 区县: ${flatData.districts.length}`);

  // 补充缺失的坐标
  console.log('\n补充缺失的坐标信息...');
  let coordsFilled = 0;

  for (const province of flatData.provinces) {
    if (!province.lat || !province.lng || (province.lat === 0 && province.lng === 0)) {
      const coord = await getCoordinates(province.name);
      province.lat = coord.lat;
      province.lng = coord.lng;
      coordsFilled++;
    }
  }

  for (const city of flatData.cities) {
    if (!city.lat || !city.lng || (city.lat === 0 && city.lng === 0)) {
      const coord = await getCoordinates(city.name, city.provinceName);
      city.lat = coord.lat;
      city.lng = coord.lng;
      coordsFilled++;
    }
    if ((flatData.cities.indexOf(city) + 1) % 50 === 0) {
      console.log(`  已处理 ${flatData.cities.indexOf(city) + 1}/${flatData.cities.length} 个城市...`);
    }
    await new Promise(resolve => setTimeout(resolve, 100)); // 避免限流
  }

  for (const district of flatData.districts) {
    if (!district.lat || !district.lng || (district.lat === 0 && district.lng === 0)) {
      const coord = await getCoordinates(district.name, district.cityName);
      district.lat = coord.lat;
      district.lng = coord.lng;
      coordsFilled++;
    }
    if ((flatData.districts.indexOf(district) + 1) % 100 === 0) {
      console.log(`  已处理 ${flatData.districts.indexOf(district) + 1}/${flatData.districts.length} 个区县...`);
    }
    await new Promise(resolve => setTimeout(resolve, 50)); // 避免限流
  }

  console.log(`补充了 ${coordsFilled} 个缺失的坐标`);

  const allData = {
    ...flatData,
    timestamp: new Date().toISOString()
  };

  // 保存JSON数据
  const jsonOutputFile = path.join(__dirname, '../data/chinaAdministrationComplete.json');
  fs.writeFileSync(jsonOutputFile, JSON.stringify(allData, null, 2), 'utf-8');
  console.log(`\n✅ JSON数据已保存到 ${jsonOutputFile}`);

  // 生成TypeScript文件
  const tsOutputFile = path.join(__dirname, '../data/chinaAdministrationComplete.ts');
  const tsContent = `// 自动生成的完整中国行政区划数据（包括所有省市区县和坐标）
// 生成时间: ${new Date().toISOString()}
// 数据来源: 高德地图API

export type AdminRegion = {
  name: string;
  adcode: string;
  level: 'province' | 'city' | 'district';
  lat: number;
  lng: number;
  center?: string;
  provinceAdcode?: string;
  provinceName?: string;
  cityAdcode?: string;
  cityName?: string;
};

export const chinaAdministrationComplete = {
  provinces: ${JSON.stringify(allData.provinces, null, 2)},
  cities: ${JSON.stringify(allData.cities, null, 2)},
  districts: ${JSON.stringify(allData.districts, null, 2)},
  timestamp: '${allData.timestamp}'
};

// 辅助函数：根据行政区代码查找地区
export function findByAdcode(adcode: string): AdminRegion | undefined {
  for (const province of chinaAdministrationComplete.provinces) {
    if (province.adcode === adcode) return province;
  }
  for (const city of chinaAdministrationComplete.cities) {
    if (city.adcode === adcode) return city;
  }
  for (const district of chinaAdministrationComplete.districts) {
    if (district.adcode === adcode) return district;
  }
  return undefined;
}

// 辅助函数：根据名称查找地区
export function findByName(name: string): AdminRegion | undefined {
  for (const province of chinaAdministrationComplete.provinces) {
    if (province.name === name) return province;
  }
  for (const city of chinaAdministrationComplete.cities) {
    if (city.name === name) return city;
  }
  for (const district of chinaAdministrationComplete.districts) {
    if (district.name === name) return district;
  }
  return undefined;
}

// 辅助函数：获取某个省份的所有城市
export function getCitiesByProvince(provinceName: string): AdminRegion[] {
  return chinaAdministrationComplete.cities.filter(city => city.provinceName === provinceName);
}

// 辅助函数：获取某个城市的所有区县
export function getDistrictsByCity(cityName: string): AdminRegion[] {
  return chinaAdministrationComplete.districts.filter(district => district.cityName === cityName);
}
`;

  fs.writeFileSync(tsOutputFile, tsContent, 'utf-8');
  console.log(`✅ TypeScript文件已保存到 ${tsOutputFile}`);

  // 输出统计信息
  console.log(`\n📊 数据统计：`);
  console.log(`  - 省份: ${allData.provinces.length}`);
  console.log(`  - 城市: ${allData.cities.length}`);
  console.log(`  - 区县: ${allData.districts.length}`);
  console.log(`  - 总计: ${allData.provinces.length + allData.cities.length + allData.districts.length} 条记录`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
