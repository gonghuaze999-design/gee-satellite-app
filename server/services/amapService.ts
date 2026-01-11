import {
  getProvinces as getProvincesLocal,
  getCitiesByProvince as getCitiesByProvinceLocal,
  getDistrictsByCity as getDistrictsByCityLocal,
  getRegionByAdcode as getRegionByAdcodeLocal,
  type AdminRegion,
} from '../data/chinaAdministration';

export type AmapRegion = AdminRegion;

/**
 * 获取所有省份 - 使用本地数据库
 */
export async function getProvinces(): Promise<AmapRegion[]> {
  try {
    return getProvincesLocal();
  } catch (error) {
    console.error('[AMAP] Failed to get provinces:', error);
    throw error;
  }
}

/**
 * 获取指定省份下的所有城市 - 使用本地数据库
 */
export async function getCitiesByProvince(provinceAdcode: string): Promise<AmapRegion[]> {
  try {
    return getCitiesByProvinceLocal(provinceAdcode);
  } catch (error) {
    console.error('[AMAP] Failed to get cities:', error);
    return [];
  }
}

/**
 * 获取指定城市下的所有区县 - 使用本地数据库
 */
export async function getDistrictsByCity(cityAdcode: string): Promise<AmapRegion[]> {
  try {
    return getDistrictsByCityLocal(cityAdcode);
  } catch (error) {
    console.error('[AMAP] Failed to get districts:', error);
    return [];
  }
}

/**
 * 根据adcode获取地区信息 - 使用本地数据库
 */
export async function getRegionByAdcode(adcode: string): Promise<AmapRegion | null> {
  try {
    return getRegionByAdcodeLocal(adcode);
  } catch (error) {
    console.error('[AMAP] Failed to get region by adcode:', error);
    throw error;
  }
}
