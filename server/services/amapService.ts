import { chinaAdministration } from "../data/chinaAdministration";

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
  return chinaAdministration.provinces;
}

/**
 * 获取指定省份下的所有城市 - 使用本地数据库
 */
export async function getCitiesByProvince(provinceAdcode: string): Promise<AmapRegion[]> {
  return chinaAdministration.cities.filter(
    (c) => c.provinceAdcode === provinceAdcode
  );
}

/**
 * 获取指定城市下的所有区县 - 使用本地数据库
 */
export async function getDistrictsByCity(cityAdcode: string): Promise<AmapRegion[]> {
  return chinaAdministration.districts.filter(
    (d) => d.cityAdcode === cityAdcode
  );
}

/**
 * 根据adcode获取地区的经纬度坐标
 */
export async function getLocationByAdcode(adcode: string): Promise<{ lat: number; lng: number } | null> {
  // 先查找省份
  let region = chinaAdministration.provinces.find((p) => p.adcode === adcode);
  if (region && region.lat && region.lng) {
    return { lat: region.lat, lng: region.lng };
  }

  // 再查找城市
  region = chinaAdministration.cities.find((c) => c.adcode === adcode);
  if (region && region.lat && region.lng) {
    return { lat: region.lat, lng: region.lng };
  }

  // 最后查找区县
  region = chinaAdministration.districts.find((d) => d.adcode === adcode);
  if (region && region.lat && region.lng) {
    return { lat: region.lat, lng: region.lng };
  }

  return null;
}
