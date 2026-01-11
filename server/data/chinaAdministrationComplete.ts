// 自动生成的完整中国行政区划数据库
// 生成时间: 2026-01-11T12:47:23.064Z
// 数据来源: 高德地图API
// 结构: 1个国家 + 34个省 + 395个地级市 + 3242个县级行政区

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

let cachedData: any = null;

function loadData() {
  if (cachedData) return cachedData;

  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const jsonPath = path.join(__dirname, 'chinaAdministrationComplete.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    cachedData = JSON.parse(jsonContent);
    return cachedData;
  } catch (error) {
    console.error('Failed to load chinaAdministrationComplete.json:', error);
    return { country: [], provinces: [], cities: [], districts: [] };
  }
}

export const chinaAdministrationComplete = {
  get country(): AdminRegion[] {
    return loadData().country || [];
  },
  get provinces(): AdminRegion[] {
    return loadData().provinces || [];
  },
  get cities(): AdminRegion[] {
    return loadData().cities || [];
  },
  get districts(): AdminRegion[] {
    return loadData().districts || [];
  },
  get timestamp(): string {
    return loadData().timestamp || '';
  }
};

export function findByName(name: string): AdminRegion | undefined {
  const data = loadData();
  for (const item of (data.country || [])) {
    if (item.name === name) return item;
  }
  for (const item of (data.provinces || [])) {
    if (item.name === name) return item;
  }
  for (const item of (data.cities || [])) {
    if (item.name === name) return item;
  }
  for (const item of (data.districts || [])) {
    if (item.name === name) return item;
  }
  return undefined;
}

export function getCitiesByProvince(provinceName: string): AdminRegion[] {
  const data = loadData();
  return (data.cities || []).filter((city: AdminRegion) => city.provinceName === provinceName);
}

export function getDistrictsByCity(cityName: string): AdminRegion[] {
  const data = loadData();
  return (data.districts || []).filter((district: AdminRegion) => district.cityName === cityName);
}
