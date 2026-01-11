/**
 * 中国34个省级行政区数据
 * 包含：31个省 + 5个自治区 + 4个直辖市 + 2个特别行政区
 * 数据来源：高德地图API
 */

export interface Province {
  name: string;
  adcode: string;
  center?: {
    lng: number;
    lat: number;
  };
}

export const chinaProvinces: Province[] = [
  // 直辖市
  { name: '北京市', adcode: '110000', center: { lng: 116.4074, lat: 39.9042 } },
  { name: '天津市', adcode: '120000', center: { lng: 117.2008, lat: 39.0842 } },
  { name: '上海市', adcode: '310000', center: { lng: 121.4737, lat: 31.2304 } },
  { name: '重庆市', adcode: '500000', center: { lng: 106.5516, lat: 29.5630 } },

  // 自治区
  { name: '内蒙古自治区', adcode: '150000', center: { lng: 111.8065, lat: 40.8182 } },
  { name: '广西壮族自治区', adcode: '450000', center: { lng: 108.3369, lat: 22.8170 } },
  { name: '西藏自治区', adcode: '540000', center: { lng: 91.1174, lat: 29.6470 } },
  { name: '宁夏回族自治区', adcode: '640000', center: { lng: 106.2586, lat: 38.4680 } },
  { name: '新疆维吾尔自治区', adcode: '650000', center: { lng: 87.6278, lat: 43.7929 } },

  // 省份
  { name: '河北省', adcode: '130000', center: { lng: 114.5149, lat: 38.0428 } },
  { name: '山西省', adcode: '140000', center: { lng: 112.5489, lat: 37.8706 } },
  { name: '辽宁省', adcode: '210000', center: { lng: 123.4328, lat: 41.8045 } },
  { name: '吉林省', adcode: '220000', center: { lng: 125.3245, lat: 43.8171 } },
  { name: '黑龙江省', adcode: '230000', center: { lng: 126.5349, lat: 45.8038 } },
  { name: '江苏省', adcode: '320000', center: { lng: 118.7969, lat: 32.0603 } },
  { name: '浙江省', adcode: '330000', center: { lng: 120.1551, lat: 30.2875 } },
  { name: '安徽省', adcode: '340000', center: { lng: 117.2272, lat: 31.8604 } },
  { name: '福建省', adcode: '350000', center: { lng: 119.2965, lat: 26.0745 } },
  { name: '江西省', adcode: '360000', center: { lng: 115.8581, lat: 28.6832 } },
  { name: '山东省', adcode: '370000', center: { lng: 117.0208, lat: 36.6519 } },
  { name: '河南省', adcode: '410000', center: { lng: 113.6254, lat: 34.7466 } },
  { name: '湖北省', adcode: '420000', center: { lng: 114.3055, lat: 30.5928 } },
  { name: '湖南省', adcode: '430000', center: { lng: 112.9388, lat: 28.2282 } },
  { name: '广东省', adcode: '440000', center: { lng: 113.2644, lat: 23.1291 } },
  { name: '海南省', adcode: '460000', center: { lng: 110.3312, lat: 19.8387 } },
  { name: '四川省', adcode: '510000', center: { lng: 104.0665, lat: 30.5728 } },
  { name: '贵州省', adcode: '520000', center: { lng: 106.7135, lat: 26.5783 } },
  { name: '云南省', adcode: '530000', center: { lng: 102.7103, lat: 24.8801 } },
  { name: '陕西省', adcode: '610000', center: { lng: 108.9398, lat: 34.3416 } },
  { name: '甘肃省', adcode: '620000', center: { lng: 103.8343, lat: 36.0611 } },
  { name: '青海省', adcode: '630000', center: { lng: 101.7782, lat: 36.6171 } },

  // 特别行政区
  { name: '香港特别行政区', adcode: '810000', center: { lng: 114.1733, lat: 22.3193 } },
  { name: '澳门特别行政区', adcode: '820000', center: { lng: 113.5439, lat: 22.1987 } },

  // 台湾（暂不处理）
  // { name: '台湾省', adcode: '710000', center: { lng: 120.9605, lat: 23.6978 } },
];

/**
 * 根据省份名称获取adcode
 */
export function getProvinceAdcode(provinceName: string): string | null {
  const province = chinaProvinces.find(p => p.name === provinceName);
  return province?.adcode || null;
}

/**
 * 根据adcode获取省份信息
 */
export function getProvinceByAdcode(adcode: string): Province | null {
  return chinaProvinces.find(p => p.adcode === adcode) || null;
}
