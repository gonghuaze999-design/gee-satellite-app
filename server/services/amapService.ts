import { chinaAdministrationComplete } from "../data/chinaAdministrationComplete";

export type AmapRegion = {
  name: string;
  adcode: string;
  level: 'province' | 'city' | 'district';
  lat?: number;
  lng?: number;
};

/**
 * 获取所有省份 - 使用本地数据库
 */
export async function getProvinces(): Promise<AmapRegion[]> {
  return chinaAdministrationComplete.provinces.map(p => ({
    name: p.name,
    adcode: p.adcode,
    level: 'province' as const,
    lat: p.lat,
    lng: p.lng
  }));
}

/**
 * 获取指定省份下的所有城市 - 使用本地数据库
 */
export async function getCitiesByProvince(provinceAdcode: string): Promise<AmapRegion[]> {
  return chinaAdministrationComplete.cities.filter(
    (c) => c.provinceAdcode === provinceAdcode
  ).map(c => ({
    name: c.name,
    adcode: c.adcode,
    level: 'city' as const,
    lat: c.lat,
    lng: c.lng
  }));
}

/**
 * 获取指定城市下的所有区县 - 使用本地数据库
 */
export async function getDistrictsByCity(cityAdcode: string): Promise<AmapRegion[]> {
  return chinaAdministrationComplete.districts.filter(
    (d) => d.cityAdcode === cityAdcode
  ).map(d => ({
    name: d.name,
    adcode: d.adcode,
    level: 'district' as const,
    lat: d.lat,
    lng: d.lng
  }));
}

/**
 * 根据adcode获取地区的经纬度坐标
 */
export async function getLocationByAdcode(adcode: string): Promise<{ lat: number; lng: number } | null> {
  // 先查找省份
  let region = chinaAdministrationComplete.provinces.find((p) => p.adcode === adcode);
  if (region && region.lat && region.lng) {
    return { lat: region.lat, lng: region.lng };
  }

  // 再查找城市
  region = chinaAdministrationComplete.cities.find((c) => c.adcode === adcode);
  if (region && region.lat && region.lng) {
    return { lat: region.lat, lng: region.lng };
  }

  // 最后查找区县
  region = chinaAdministrationComplete.districts.find((d) => d.adcode === adcode);
  if (region && region.lat && region.lng) {
    return { lat: region.lat, lng: region.lng };
  }

  return null;
}
