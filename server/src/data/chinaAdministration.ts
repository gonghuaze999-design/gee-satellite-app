/**
 * 中国行政区划完整数据
 * 数据来源：全国34个省级单元Word文档
 * 包含：34个省级行政区 + 365个地级市 + 2907个县级行政区
 * 总计：3306条记录
 */

export interface AdministrativeRegion {
  name: string;
  adcode: string;
  level: 'province' | 'city' | 'district';
  lng: number;
  lat: number;
  provinceCode: string;
  provinceName: string;
  cityCode?: string;
  cityName?: string;
}

// 导入JSON数据
import chinaAdminData from './chinaAdministration.json';

export const chinaAdministration: AdministrativeRegion[] = chinaAdminData as AdministrativeRegion[];

/**
 * 获取所有省级行政区
 */
export function getProvinces(): AdministrativeRegion[] {
  return chinaAdministration.filter(region => region.level === 'province');
}

/**
 * 根据省份代码获取所有地级市
 */
export function getCitiesByProvince(provinceCode: string): AdministrativeRegion[] {
  return chinaAdministration.filter(
    region => region.level === 'city' && region.provinceCode === provinceCode
  );
}

/**
 * 根据地级市代码获取所有县级行政区
 */
export function getDistrictsByCity(cityCode: string): AdministrativeRegion[] {
  return chinaAdministration.filter(
    region => region.level === 'district' && region.cityCode === cityCode
  );
}

/**
 * 根据行政区代码获取行政区信息
 */
export function getRegionByAdcode(adcode: string): AdministrativeRegion | undefined {
  return chinaAdministration.find(region => region.adcode === adcode);
}

/**
 * 搜索行政区（支持模糊匹配名称）
 */
export function searchRegions(keyword: string): AdministrativeRegion[] {
  const lowerKeyword = keyword.toLowerCase();
  return chinaAdministration.filter(region =>
    region.name.toLowerCase().includes(lowerKeyword)
  );
}
