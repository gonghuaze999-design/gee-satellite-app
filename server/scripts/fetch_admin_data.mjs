#!/usr/bin/env node
/**
 * 从高德API获取完整的中国行政区划数据（包括所有省市区县和坐标）
 * 用法: node fetch_admin_data.mjs
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

async function fetchDistricts(keywords = '', subdistrict = 1) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        keywords,
        subdistrict,
        key: AMAP_API_KEY,
        extensions: 'all'
      },
      timeout: 10000
    });

    if (response.data.status === '1') {
      return response.data.districts || [];
    } else {
      console.error(`API Error: ${response.data.info}`);
      return [];
    }
  } catch (error) {
    console.error(`Request Error: ${error.message}`);
    return [];
  }
}

function parseDistrict(district, level = 'province') {
  const center = district.center ? district.center.split(',') : [0, 0];
  const lng = parseFloat(center[0]) || 0;
  const lat = parseFloat(center[1]) || 0;

  return {
    name: district.name || '',
    adcode: district.adcode || '',
    level,
    lat,
    lng,
    center: district.center || '',
    area: district.area || 0
  };
}

async function main() {
  console.log('开始从高德API获取完整的行政区划数据...');
  console.log(`API Key: ${AMAP_API_KEY.substring(0, 20)}...`);

  const allData = {
    provinces: [],
    cities: [],
    districts: [],
    timestamp: new Date().toISOString()
  };

  // 第1步：获取所有省份
  console.log('\n[1/3] 获取所有省份...');
  const provincesData = await fetchDistricts('', 1);

  if (provincesData.length === 0) {
    console.error('ERROR: Failed to fetch provinces');
    process.exit(1);
  }

  console.log(`找到 ${provincesData.length} 个省份`);

  for (const province of provincesData) {
    const provinceInfo = parseDistrict(province, 'province');
    allData.provinces.push(provinceInfo);
    console.log(`  ✓ ${provinceInfo.name}`);
  }

  // 第2步：获取所有城市
  console.log('\n[2/3] 获取所有城市...');
  let totalCities = 0;

  for (let i = 0; i < allData.provinces.length; i++) {
    const province = allData.provinces[i];
    console.log(`  [${i + 1}/${allData.provinces.length}] 获取 ${province.name} 的城市...`);

    const citiesData = await fetchDistricts(province.name, 1);

    if (citiesData.length > 0) {
      for (const cityGroup of citiesData) {
        const subDistricts = cityGroup.districts || [];
        for (const city of subDistricts) {
          const cityInfo = parseDistrict(city, 'city');
          cityInfo.provinceAdcode = province.adcode;
          cityInfo.provinceName = province.name;
          allData.cities.push(cityInfo);
          totalCities++;
        }
      }
    }

    // 避免API限流
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`找到 ${totalCities} 个城市`);

  // 第3步：获取所有区县
  console.log('\n[3/3] 获取所有区县...');
  let totalDistricts = 0;

  for (let i = 0; i < allData.cities.length; i++) {
    const city = allData.cities[i];
    if ((i + 1) % 50 === 0) {
      console.log(`  [${i + 1}/${allData.cities.length}] 处理中...`);
    }

    const districtsData = await fetchDistricts(city.name, 1);

    if (districtsData.length > 0) {
      for (const districtGroup of districtsData) {
        const subDistricts = districtGroup.districts || [];
        for (const district of subDistricts) {
          const districtInfo = parseDistrict(district, 'district');
          districtInfo.cityAdcode = city.adcode;
          districtInfo.cityName = city.name;
          districtInfo.provinceAdcode = city.provinceAdcode;
          districtInfo.provinceName = city.provinceName;
          allData.districts.push(districtInfo);
          totalDistricts++;
        }
      }
    }

    // 避免API限流
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`找到 ${totalDistricts} 个区县`);

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
  area?: number;
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
