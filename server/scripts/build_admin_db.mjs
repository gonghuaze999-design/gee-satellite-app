#!/usr/bin/env node
/**
 * 从高德API获取完整的中国行政区划数据
 * 结构：1个国家 + 34个省 + 293个地级市 + 2845个县级行政区
 * 用法: node build_admin_db.mjs
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AMAP_API_KEY = process.env.AMAP_API_KEY;
if (!AMAP_API_KEY) {
  console.error('ERROR: AMAP_API_KEY not set');
  process.exit(1);
}

const BASE_URL = 'https://restapi.amap.com/v3/config/district';

async function fetchDistricts(keywords = '', subdistrict = 1, showlog = true) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        keywords,
        subdistrict,
        key: AMAP_API_KEY
      },
      timeout: 15000
    });

    if (response.data.status === '1') {
      return response.data.districts || [];
    } else {
      if (showlog) console.error(`API Error: ${response.data.info}`);
      return [];
    }
  } catch (error) {
    if (showlog) console.error(`Request Error: ${error.message}`);
    return [];
  }
}

function extractCoordinates(centerStr) {
  if (!centerStr) return { lat: 0, lng: 0 };
  const [lng, lat] = centerStr.split(',').map(parseFloat);
  return { lat: isNaN(lat) ? 0 : lat, lng: isNaN(lng) ? 0 : lng };
}

async function main() {
  console.log('从高德API获取完整的中国行政区划数据...');
  console.log(`API Key: ${AMAP_API_KEY.substring(0, 20)}...\n`);

  const allData = {
    country: [],
    provinces: [],
    cities: [],
    districts: [],
    timestamp: new Date().toISOString()
  };

  // 第1步：获取国家级（中华人民共和国）
  console.log('[1/4] 获取国家级数据...');
  const countryData = await fetchDistricts('', 1);
  if (countryData.length > 0) {
    const country = countryData[0];
    allData.country.push({
      name: country.name,
      adcode: country.adcode,
      level: 'country',
      lat: extractCoordinates(country.center).lat,
      lng: extractCoordinates(country.center).lng
    });
    console.log(`✓ ${country.name}`);
  }

  // 第2步：获取所有省份
  console.log('\n[2/4] 获取34个省份...');
  const provincesData = await fetchDistricts('', 1);
  
  if (provincesData.length === 0) {
    console.error('ERROR: Failed to fetch provinces');
    process.exit(1);
  }

  // 处理省份（第一层的districts就是34个省份）
  let provinceList = [];
  if (provincesData[0] && provincesData[0].districts) {
    provinceList = provincesData[0].districts;
  }

  console.log(`找到 ${provinceList.length} 个省份`);

  for (const province of provinceList) {
    allData.provinces.push({
      name: province.name,
      adcode: province.adcode,
      level: 'province',
      lat: extractCoordinates(province.center).lat,
      lng: extractCoordinates(province.center).lng
    });
  }

  // 第3步：获取所有地级市
  console.log('\n[3/4] 获取293个地级市...');
  let cityCount = 0;

  for (let i = 0; i < provinceList.length; i++) {
    const province = provinceList[i];
    console.log(`  [${i + 1}/${provinceList.length}] 获取 ${province.name} 的城市...`);

    const citiesData = await fetchDistricts(province.name, 1, false);

    if (citiesData.length > 0 && citiesData[0].districts) {
      for (const city of citiesData[0].districts) {
        allData.cities.push({
          name: city.name,
          adcode: city.adcode,
          level: 'city',
          lat: extractCoordinates(city.center).lat,
          lng: extractCoordinates(city.center).lng,
          provinceAdcode: province.adcode,
          provinceName: province.name
        });
        cityCount++;
      }
    }

    // 避免API限流
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`找到 ${cityCount} 个地级市`);

  // 第4步：获取所有县级行政区
  console.log('\n[4/4] 获取2845个县级行政区...');
  let districtCount = 0;

  for (let i = 0; i < allData.cities.length; i++) {
    const city = allData.cities[i];

    if ((i + 1) % 50 === 0) {
      console.log(`  [${i + 1}/${allData.cities.length}] 处理中...`);
    }

    const districtsData = await fetchDistricts(city.name, 1, false);

    if (districtsData.length > 0 && districtsData[0].districts) {
      for (const district of districtsData[0].districts) {
        allData.districts.push({
          name: district.name,
          adcode: district.adcode,
          level: 'district',
          lat: extractCoordinates(district.center).lat,
          lng: extractCoordinates(district.center).lng,
          cityAdcode: city.adcode,
          cityName: city.name,
          provinceAdcode: city.provinceAdcode,
          provinceName: city.provinceName
        });
        districtCount++;
      }
    }

    // 避免API限流
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`找到 ${districtCount} 个县级行政区`);

  // 保存JSON
  const jsonFile = path.join(__dirname, '../data/chinaAdministrationComplete.json');
  fs.writeFileSync(jsonFile, JSON.stringify(allData, null, 2), 'utf-8');
  console.log(`\n✅ JSON已保存: ${jsonFile}`);

  // 生成TypeScript文件
  const tsFile = path.join(__dirname, '../data/chinaAdministrationComplete.ts');
  const tsContent = `// 自动生成的完整中国行政区划数据库
// 生成时间: ${new Date().toISOString()}
// 数据来源: 高德地图API
// 结构: 1个国家 + 34个省 + ${cityCount}个地级市 + ${districtCount}个县级行政区

export type AdminRegion = {
  name: string;
  adcode: string;
  level: 'country' | 'province' | 'city' | 'district';
  lat: number;
  lng: number;
  provinceAdcode?: string;
  provinceName?: string;
  cityAdcode?: string;
  cityName?: string;
};

export const chinaAdministrationComplete = {
  country: ${JSON.stringify(allData.country, null, 2)},
  provinces: ${JSON.stringify(allData.provinces, null, 2)},
  cities: ${JSON.stringify(allData.cities, null, 2)},
  districts: ${JSON.stringify(allData.districts, null, 2)},
  timestamp: '${allData.timestamp}'
};

export function findByName(name: string): AdminRegion | undefined {
  for (const item of chinaAdministrationComplete.country) {
    if (item.name === name) return item;
  }
  for (const item of chinaAdministrationComplete.provinces) {
    if (item.name === name) return item;
  }
  for (const item of chinaAdministrationComplete.cities) {
    if (item.name === name) return item;
  }
  for (const item of chinaAdministrationComplete.districts) {
    if (item.name === name) return item;
  }
  return undefined;
}

export function getCitiesByProvince(provinceName: string): AdminRegion[] {
  return chinaAdministrationComplete.cities.filter(city => city.provinceName === provinceName);
}

export function getDistrictsByCity(cityName: string): AdminRegion[] {
  return chinaAdministrationComplete.districts.filter(district => district.cityName === cityName);
}
`;

  fs.writeFileSync(tsFile, tsContent, 'utf-8');
  console.log(`✅ TypeScript已保存: ${tsFile}`);

  console.log(`\n📊 最终统计：`);
  console.log(`  - 国家: ${allData.country.length}`);
  console.log(`  - 省份: ${allData.provinces.length}`);
  console.log(`  - 地级市: ${allData.cities.length}`);
  console.log(`  - 县级行政区: ${allData.districts.length}`);
  console.log(`  - 总计: ${allData.country.length + allData.provinces.length + allData.cities.length + allData.districts.length} 条记录`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
