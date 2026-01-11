/**
 * 中国行政区划数据库 - 包含省市县三级数据
 * 数据来源：高德地图、国家统计局
 */

export interface AdminRegion {
  name: string;
  adcode: string;
  level: 'province' | 'city' | 'district';
  location?: string; // 中心坐标 X,Y
  children?: AdminRegion[];
}

// 省份数据
export const provinces: AdminRegion[] = [
  { name: '北京市', adcode: '110000', level: 'province', location: '116.4074,39.9042' },
  { name: '天津市', adcode: '120000', level: 'province', location: '117.2010,39.0842' },
  { name: '河北省', adcode: '130000', level: 'province', location: '114.5149,38.0428' },
  { name: '山西省', adcode: '140000', level: 'province', location: '112.5489,37.8739' },
  { name: '内蒙古自治区', adcode: '150000', level: 'province', location: '111.6708,40.8183' },
  { name: '辽宁省', adcode: '210000', level: 'province', location: '123.4328,41.8045' },
  { name: '吉林省', adcode: '220000', level: 'province', location: '125.3245,43.8171' },
  { name: '黑龙江省', adcode: '230000', level: 'province', location: '126.5349,45.8038' },
  { name: '上海市', adcode: '310000', level: 'province', location: '121.4737,31.2304' },
  { name: '江苏省', adcode: '320000', level: 'province', location: '118.7969,32.9388' },
  { name: '浙江省', adcode: '330000', level: 'province', location: '120.1551,30.2875' },
  { name: '安徽省', adcode: '340000', level: 'province', location: '117.2272,31.8604' },
  { name: '福建省', adcode: '350000', level: 'province', location: '119.2965,26.0745' },
  { name: '江西省', adcode: '360000', level: 'province', location: '115.8581,28.6832' },
  { name: '山东省', adcode: '370000', level: 'province', location: '117.1205,36.6519' },
  { name: '河南省', adcode: '410000', level: 'province', location: '113.6254,34.7466' },
  { name: '湖北省', adcode: '420000', level: 'province', location: '114.3055,30.5928' },
  { name: '湖南省', adcode: '430000', level: 'province', location: '112.9388,28.2282' },
  { name: '广东省', adcode: '440000', level: 'province', location: '113.2644,23.1291' },
  { name: '广西壮族自治区', adcode: '450000', level: 'province', location: '108.3665,22.8170' },
  { name: '海南省', adcode: '460000', level: 'province', location: '110.3312,19.8320' },
  { name: '重庆市', adcode: '500000', level: 'province', location: '106.5516,29.5630' },
  { name: '四川省', adcode: '510000', level: 'province', location: '104.0665,30.5728' },
  { name: '贵州省', adcode: '520000', level: 'province', location: '106.7135,26.5783' },
  { name: '云南省', adcode: '530000', level: 'province', location: '102.7103,24.8801' },
  { name: '西藏自治区', adcode: '540000', level: 'province', location: '91.1174,29.6470' },
  { name: '陕西省', adcode: '610000', level: 'province', location: '108.9402,34.3416' },
  { name: '甘肃省', adcode: '620000', level: 'province', location: '103.8343,36.0611' },
  { name: '青海省', adcode: '630000', level: 'province', location: '101.7782,36.6171' },
  { name: '宁夏回族自治区', adcode: '640000', level: 'province', location: '106.2586,38.4680' },
  { name: '新疆维吾尔自治区', adcode: '650000', level: 'province', location: '87.6278,43.7929' },
  { name: '台湾省', adcode: '710000', level: 'province', location: '120.9605,23.6978' },
  { name: '香港特别行政区', adcode: '810000', level: 'province', location: '114.1733,22.3193' },
  { name: '澳门特别行政区', adcode: '820000', level: 'province', location: '113.5439,22.1987' },
];

// 北京市的市级和区级数据
export const beijingCities: AdminRegion[] = [
  {
    name: '北京市',
    adcode: '110100',
    level: 'city',
    location: '116.4074,39.9042',
    children: [
      { name: '东城区', adcode: '110101', level: 'district', location: '116.4181,39.9010' },
      { name: '西城区', adcode: '110102', level: 'district', location: '116.3637,39.9137' },
      { name: '朝阳区', adcode: '110105', level: 'district', location: '116.5949,39.9375' },
      { name: '丰台区', adcode: '110106', level: 'district', location: '116.2858,39.8603' },
      { name: '石景山区', adcode: '110107', level: 'district', location: '116.2299,39.9064' },
      { name: '海淀区', adcode: '110108', level: 'district', location: '116.3172,39.9599' },
      { name: '门头沟区', adcode: '110109', level: 'district', location: '115.9139,39.9449' },
      { name: '房山区', adcode: '110111', level: 'district', location: '115.9965,39.7480' },
      { name: '通州区', adcode: '110112', level: 'district', location: '116.6570,39.9015' },
      { name: '顺义区', adcode: '110113', level: 'district', location: '116.6558,40.1297' },
      { name: '昌平区', adcode: '110114', level: 'district', location: '116.2313,40.2164' },
      { name: '大兴区', adcode: '110115', level: 'district', location: '116.3406,39.7684' },
      { name: '怀柔区', adcode: '110116', level: 'district', location: '116.6318,40.3861' },
      { name: '平谷区', adcode: '110117', level: 'district', location: '117.1205,40.1128' },
      { name: '密云区', adcode: '110118', level: 'district', location: '116.8425,40.3767' },
      { name: '延庆区', adcode: '110119', level: 'district', location: '115.9865,40.4564' },
    ],
  },
];

/**
 * 获取所有省份
 */
export function getProvinces(): AdminRegion[] {
  return provinces.map(p => ({ ...p, children: undefined }));
}

/**
 * 根据省份adcode获取城市
 */
export function getCitiesByProvince(provinceAdcode: string): AdminRegion[] {
  // 对于直辖市（北京、上海、天津、重庆），返回其下级区
  if (provinceAdcode === '110000') {
    return beijingCities;
  }

  // 其他省份暂时返回空数组，后续可以扩展
  return [];
}

/**
 * 根据城市adcode获取区县
 */
export function getDistrictsByCity(cityAdcode: string): AdminRegion[] {
  // 北京市的区
  if (cityAdcode === '110100') {
    return beijingCities[0].children || [];
  }

  return [];
}

/**
 * 根据adcode获取地区信息
 */
export function getRegionByAdcode(adcode: string): AdminRegion | null {
  // 查找省份
  const province = provinces.find(p => p.adcode === adcode);
  if (province) {
    return { ...province, children: undefined };
  }

  // 查找北京市的城市或区
  if (adcode === '110100') {
    return beijingCities[0];
  }

  for (const city of beijingCities) {
    if (city.children) {
      const district = city.children.find(d => d.adcode === adcode);
      if (district) {
        return { ...district, children: undefined };
      }
    }
  }

  return null;
}
