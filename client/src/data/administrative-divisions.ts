/**
 * 行政区划数据
 * 包含国家、省份、城市等多级行政区划
 */

export interface AdministrativeDivision {
  code: string;
  name: string;
  level: 'country' | 'province' | 'city';
  center: { lat: number; lng: number };
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  children?: AdministrativeDivision[];
}

export const COUNTRIES: AdministrativeDivision[] = [
  {
    code: 'CN',
    name: '中国',
    level: 'country',
    center: { lat: 35.8617, lng: 104.1954 },
    bounds: {
      north: 53.5610,
      south: 18.2241,
      east: 135.0852,
      west: 73.5006,
    },
    children: [
      // 华北地区
      {
        code: 'BJ',
        name: '北京',
        level: 'province',
        center: { lat: 39.9042, lng: 116.4074 },
        bounds: { north: 40.4549, south: 39.4387, east: 117.5171, west: 115.7066 },
      },
      {
        code: 'TJ',
        name: '天津',
        level: 'province',
        center: { lat: 39.0842, lng: 117.2010 },
        bounds: { north: 39.8149, south: 38.3144, east: 117.7691, west: 116.7055 },
      },
      {
        code: 'HE',
        name: '河北',
        level: 'province',
        center: { lat: 37.8706, lng: 114.8581 },
        bounds: { north: 42.6009, south: 36.0611, east: 119.6381, west: 113.4327 },
      },
      {
        code: 'SX',
        name: '山西',
        level: 'province',
        center: { lat: 37.8706, lng: 112.5489 },
        bounds: { north: 40.4358, south: 34.2658, east: 114.3359, west: 110.0684 },
      },
      {
        code: 'NM',
        name: '内蒙古',
        level: 'province',
        center: { lat: 49.8038, lng: 119.2965 },
        bounds: { north: 53.3955, south: 37.2410, east: 126.9154, west: 97.1289 },
      },
      // 华东地区
      {
        code: 'LN',
        name: '辽宁',
        level: 'province',
        center: { lat: 41.8045, lng: 123.4328 },
        bounds: { north: 43.2618, south: 38.7314, east: 125.3245, west: 118.4206 },
      },
      {
        code: 'JL',
        name: '吉林',
        level: 'province',
        center: { lat: 43.8171, lng: 125.3235 },
        bounds: { north: 46.8859, south: 40.8278, east: 131.1659, west: 121.7147 },
      },
      {
        code: 'HL',
        name: '黑龙江',
        level: 'province',
        center: { lat: 45.8038, lng: 126.5340 },
        bounds: { north: 53.5538, south: 43.2767, east: 135.2965, west: 121.1147 },
      },
      {
        code: 'SH',
        name: '上海',
        level: 'province',
        center: { lat: 31.2304, lng: 121.4737 },
        bounds: { north: 31.8683, south: 30.7103, east: 122.2008, west: 120.8575 },
      },
      {
        code: 'JS',
        name: '江苏',
        level: 'province',
        center: { lat: 32.9388, lng: 120.5954 },
        bounds: { north: 35.0725, south: 30.6553, east: 121.9371, west: 118.4251 },
      },
      {
        code: 'ZJ',
        name: '浙江',
        level: 'province',
        center: { lat: 30.2741, lng: 120.1551 },
        bounds: { north: 31.1116, south: 27.2010, east: 123.1025, west: 118.0894 },
      },
      {
        code: 'AH',
        name: '安徽',
        level: 'province',
        center: { lat: 31.8206, lng: 117.2272 },
        bounds: { north: 34.3821, south: 29.3827, east: 119.6301, west: 114.9673 },
      },
      {
        code: 'FJ',
        name: '福建',
        level: 'province',
        center: { lat: 26.0745, lng: 119.2965 },
        bounds: { north: 28.3236, south: 23.5008, east: 120.7965, west: 116.9170 },
      },
      {
        code: 'JX',
        name: '江西',
        level: 'province',
        center: { lat: 28.6832, lng: 115.8581 },
        bounds: { north: 30.4767, south: 24.5338, east: 117.9340, west: 113.3368 },
      },
      {
        code: 'SD',
        name: '山东',
        level: 'province',
        center: { lat: 36.0671, lng: 120.3826 },
        bounds: { north: 37.9140, south: 34.3852, east: 122.4142, west: 114.4995 },
      },
      // 中南地区
      {
        code: 'HA',
        name: '河南',
        level: 'province',
        center: { lat: 34.7466, lng: 113.6253 },
        bounds: { north: 36.3612, south: 32.1545, east: 116.6837, west: 110.2145 },
      },
      {
        code: 'HB',
        name: '湖北',
        level: 'province',
        center: { lat: 30.5928, lng: 114.3055 },
        bounds: { north: 33.2957, south: 28.0438, east: 116.5428, west: 108.6127 },
      },
      {
        code: 'HN',
        name: '湖南',
        level: 'province',
        center: { lat: 27.6104, lng: 111.7088 },
        bounds: { north: 30.1287, south: 24.7389, east: 114.1529, west: 108.7768 },
      },
      {
        code: 'GD',
        name: '广东',
        level: 'province',
        center: { lat: 23.1291, lng: 113.2644 },
        bounds: { north: 25.3134, south: 20.1276, east: 116.0544, west: 109.6299 },
      },
      {
        code: 'GX',
        name: '广西',
        level: 'province',
        center: { lat: 22.8170, lng: 108.3665 },
        bounds: { north: 26.3840, south: 20.8969, east: 112.0445, west: 104.4260 },
      },
      {
        code: 'HI',
        name: '海南',
        level: 'province',
        center: { lat: 19.0437, lng: 110.1987 },
        bounds: { north: 20.2510, south: 18.2213, east: 111.0534, west: 108.6171 },
      },
      // 西南地区
      {
        code: 'CQ',
        name: '重庆',
        level: 'province',
        center: { lat: 29.4316, lng: 106.9123 },
        bounds: { north: 32.1897, south: 28.2282, east: 110.1119, west: 105.1722 },
      },
      {
        code: 'SC',
        name: '四川',
        level: 'province',
        center: { lat: 30.5728, lng: 104.0668 },
        bounds: { north: 34.3999, south: 25.5010, east: 108.6318, west: 97.2084 },
      },
      {
        code: 'GZ',
        name: '贵州',
        level: 'province',
        center: { lat: 26.5783, lng: 106.7135 },
        bounds: { north: 29.1317, south: 24.1380, east: 109.5083, west: 103.7329 },
      },
      {
        code: 'YN',
        name: '云南',
        level: 'province',
        center: { lat: 24.8801, lng: 102.9103 },
        bounds: { north: 29.2319, south: 21.4903, east: 106.1959, west: 97.1680 },
      },
      {
        code: 'XZ',
        name: '西藏',
        level: 'province',
        center: { lat: 29.6470, lng: 91.1865 },
        bounds: { north: 36.4761, south: 26.7381, east: 99.1161, west: 78.0191 },
      },
      // 西北地区
      {
        code: 'SN',
        name: '陕西',
        level: 'province',
        center: { lat: 34.3416, lng: 108.9398 },
        bounds: { north: 39.7450, south: 31.8662, east: 111.4909, west: 104.6659 },
      },
      {
        code: 'GS',
        name: '甘肃',
        level: 'province',
        center: { lat: 35.9375, lng: 103.8343 },
        bounds: { north: 42.9689, south: 32.1117, east: 108.4667, west: 92.1307 },
      },
      {
        code: 'QH',
        name: '青海',
        level: 'province',
        center: { lat: 36.6171, lng: 101.7782 },
        bounds: { north: 39.1897, south: 32.1545, east: 104.6659, west: 89.3520 },
      },
      {
        code: 'NX',
        name: '宁夏',
        level: 'province',
        center: { lat: 38.4680, lng: 106.2586 },
        bounds: { north: 39.5005, south: 35.1394, east: 107.3968, west: 104.1719 },
      },
      {
        code: 'XJ',
        name: '新疆',
        level: 'province',
        center: { lat: 43.7929, lng: 87.6278 },
        bounds: { north: 49.1897, south: 34.2658, east: 96.0371, west: 73.4236 },
      },
      // 港澳台
      {
        code: 'HK',
        name: '香港',
        level: 'province',
        center: { lat: 22.3193, lng: 114.1694 },
        bounds: { north: 22.5173, south: 22.1530, east: 114.4312, west: 113.8360 },
      },
      {
        code: 'MO',
        name: '澳门',
        level: 'province',
        center: { lat: 22.1987, lng: 113.5439 },
        bounds: { north: 22.2144, south: 22.1590, east: 113.5754, west: 113.5244 },
      },
      {
        code: 'TW',
        name: '台湾',
        level: 'province',
        center: { lat: 23.6978, lng: 120.9605 },
        bounds: { north: 25.3622, south: 21.8667, east: 121.9449, west: 119.5347 },
      },
    ],
  },
  {
    code: 'US',
    name: '美国',
    level: 'country',
    center: { lat: 37.0902, lng: -95.7129 },
    bounds: {
      north: 49.3830,
      south: 24.5210,
      east: -66.9326,
      west: -125.0011,
    },
  },
  {
    code: 'JP',
    name: '日本',
    level: 'country',
    center: { lat: 36.2048, lng: 138.2529 },
    bounds: {
      north: 45.5514,
      south: 24.2285,
      east: 145.8041,
      west: 123.0626,
    },
  },
  {
    code: 'IN',
    name: '印度',
    level: 'country',
    center: { lat: 20.5937, lng: 78.9629 },
    bounds: {
      north: 35.5047,
      south: 6.7535,
      east: 97.4025,
      west: 68.1766,
    },
  },
  {
    code: 'BR',
    name: '巴西',
    level: 'country',
    center: { lat: -14.2350, lng: -51.9253 },
    bounds: {
      north: 5.2419,
      south: -33.7683,
      east: -34.7931,
      west: -73.9850,
    },
  },
  {
    code: 'AU',
    name: '澳大利亚',
    level: 'country',
    center: { lat: -25.2744, lng: 133.7751 },
    bounds: {
      north: -10.0823,
      south: -43.6345,
      east: 153.6371,
      west: 112.9211,
    },
  },
];

/**
 * 获取国家列表
 */
export function getCountries(): AdministrativeDivision[] {
  return COUNTRIES;
}

/**
 * 获取指定国家的省份列表
 */
export function getProvinces(countryCode: string): AdministrativeDivision[] {
  const country = COUNTRIES.find(c => c.code === countryCode);
  return country?.children || [];
}

/**
 * 根据代码获取行政区划
 */
export function getDivisionByCode(code: string): AdministrativeDivision | undefined {
  // 先从国家列表中查找
  let division = COUNTRIES.find(c => c.code === code);
  if (division) return division;

  // 再从省份列表中查找
  for (const country of COUNTRIES) {
    if (country.children) {
      division = country.children.find(p => p.code === code);
      if (division) return division;
    }
  }

  return undefined;
}

/**
 * 获取行政区划的地理边界
 */
export function getDivisionBounds(code: string): {
  north: number;
  south: number;
  east: number;
  west: number;
} | null {
  const division = getDivisionByCode(code);
  return division?.bounds || null;
}

/**
 * 获取行政区划的中心坐标
 */
export function getDivisionCenter(code: string): { lat: number; lng: number } | null {
  const division = getDivisionByCode(code);
  return division?.center || null;
}
