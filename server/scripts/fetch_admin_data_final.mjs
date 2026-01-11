#!/usr/bin/env node
/**
 * 使用modood完整数据 + 高德地理编码获取完整的中国行政区划数据
 * 用法: node fetch_admin_data_final.mjs
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

const GEOCODE_URL = 'https://restapi.amap.com/v3/geocode/geo';

// 缓存坐标，避免重复查询
const coordCache = {};

async function getCoordinates(name, province = '', city = '') {
  const cacheKey = `${province}|${city}|${name}`;
  if (coordCache[cacheKey]) {
    return coordCache[cacheKey];
  }

  try {
    // 构建搜索地址
    let searchName = name;
    if (province && province !== '中华人民共和国') {
      searchName = province + name;
    }
    if (city && city !== province) {
      searchName = city + name;
    }

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
    // 忽略错误
  }

  return { lat: 0, lng: 0 };
}

async function main() {
  console.log('开始构建完整的中国行政区划数据库...');
  console.log(`API Key: ${AMAP_API_KEY.substring(0, 20)}...`);

  // 从modood数据加载行政区划结构
  console.log('\n[1/3] 加载modood行政区划数据...');
  const pcaPath = '/tmp/Administrative-divisions-of-China/dist/pca.json';
  
  if (!fs.existsSync(pcaPath)) {
    console.error('ERROR: modood data not found. Please ensure Administrative-divisions-of-China is cloned to /tmp');
    process.exit(1);
  }

  const pcaData = JSON.parse(fs.readFileSync(pcaPath, 'utf-8'));
  
  const allData = {
    provinces: [],
    cities: [],
    districts: [],
    timestamp: new Date().toISOString()
  };

  // 处理省份和城市
  console.log('[2/3] 处理省份和城市...');
  let cityCount = 0;
  let districtCount = 0;

  for (const [provinceName, provinceData] of Object.entries(pcaData)) {
    // 添加省份
    const provinceCoord = await getCoordinates(provinceName);
    allData.provinces.push({
      name: provinceName,
      adcode: '',
      level: 'province',
      lat: provinceCoord.lat,
      lng: provinceCoord.lng
    });

    console.log(`  ✓ ${provinceName}`);

    // 处理城市和区县
    if (provinceData['市辖区']) {
      // 直辖市的情况（北京、上海、天津、重庆）
      const cityName = provinceName;
      const cityCoord = await getCoordinates(cityName);
      allData.cities.push({
        name: cityName,
        adcode: '',
        level: 'city',
        lat: cityCoord.lat,
        lng: cityCoord.lng,
        provinceAdcode: '',
        provinceName: provinceName
      });
      cityCount++;

      // 处理区县
      if (provinceData['市辖区'] && Array.isArray(provinceData['市辖区'])) {
        for (const districtName of provinceData['市辖区']) {
          const districtCoord = await getCoordinates(districtName, provinceName, cityName);
          allData.districts.push({
            name: districtName,
            adcode: '',
            level: 'district',
            lat: districtCoord.lat,
            lng: districtCoord.lng,
            cityAdcode: '',
            cityName: cityName,
            provinceAdcode: '',
            provinceName: provinceName
          });
          districtCount++;
        }
      }
    } else {
      // 普通省份的情况
      for (const [cityName, cityData] of Object.entries(provinceData)) {
        if (cityName === '市辖区') continue;

        const cityCoord = await getCoordinates(cityName, provinceName);
        allData.cities.push({
          name: cityName,
          adcode: '',
          level: 'city',
          lat: cityCoord.lat,
          lng: cityCoord.lng,
          provinceAdcode: '',
          provinceName: provinceName
        });
        cityCount++;

        // 处理区县
        if (cityData && Array.isArray(cityData)) {
          for (const districtName of cityData) {
            const districtCoord = await getCoordinates(districtName, provinceName, cityName);
            allData.districts.push({
              name: districtName,
              adcode: '',
              level: 'district',
              lat: districtCoord.lat,
              lng: districtCoord.lng,
              cityAdcode: '',
              cityName: cityName,
              provinceAdcode: '',
              provinceName: provinceName
            });
            districtCount++;
          }
        }

        // 避免API限流
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  console.log(`\n[3/3] 保存数据...`);
  console.log(`  - 省份: ${allData.provinces.length}`);
  console.log(`  - 城市: ${allData.cities.length}`);
  console.log(`  - 区县: ${allData.districts.length}`);

  // 保存JSON数据
  const jsonOutputFile = path.join(__dirname, '../data/chinaAdministrationComplete.json');
  fs.writeFileSync(jsonOutputFile, JSON.stringify(allData, null, 2), 'utf-8');
  console.log(`\n✅ JSON数据已保存到 ${jsonOutputFile}`);

  // 生成TypeScript文件
  const tsOutputFile = path.join(__dirname, '../data/chinaAdministrationComplete.ts');
  const tsContent = `// 自动生成的完整中国行政区划数据（包括所有省市区县和坐标）
// 生成时间: ${new Date().toISOString()}
// 数据来源: modood + 高德地图API

export type AdminRegion = {
  name: string;
  adcode: string;
  level: 'province' | 'city' | 'district';
  lat: number;
  lng: number;
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
  console.log(`\n📊 最终数据统计：`);
  console.log(`  - 省份: ${allData.provinces.length}`);
  console.log(`  - 城市: ${allData.cities.length}`);
  console.log(`  - 区县: ${allData.districts.length}`);
  console.log(`  - 总计: ${allData.provinces.length + allData.cities.length + allData.districts.length} 条记录`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
