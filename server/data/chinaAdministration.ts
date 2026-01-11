export type AdminRegion = {
  name: string;
  adcode: string;
  level: 'province' | 'city' | 'district';
  lat?: number;
  lng?: number;
  provinceAdcode?: string;
  cityAdcode?: string;
};

// 省份列表（包括台湾、香港、澳门）
const provinces: AdminRegion[] = [
  { name: '北京市', adcode: '110000', level: 'province', lat: 39.9042, lng: 116.4074 },
  { name: '天津市', adcode: '120000', level: 'province', lat: 39.0842, lng: 117.2010 },
  { name: '河北省', adcode: '130000', level: 'province', lat: 38.0428, lng: 114.5149 },
  { name: '山西省', adcode: '140000', level: 'province', lat: 37.8706, lng: 112.5489 },
  { name: '内蒙古自治区', adcode: '150000', level: 'province', lat: 40.8182, lng: 111.6554 },
  { name: '辽宁省', adcode: '210000', level: 'province', lat: 41.8045, lng: 123.4328 },
  { name: '吉林省', adcode: '220000', level: 'province', lat: 43.8171, lng: 125.3235 },
  { name: '黑龙江省', adcode: '230000', level: 'province', lat: 45.8038, lng: 126.5340 },
  { name: '上海市', adcode: '310000', level: 'province', lat: 31.2304, lng: 121.4737 },
  { name: '江苏省', adcode: '320000', level: 'province', lat: 32.0603, lng: 118.7969 },
  { name: '浙江省', adcode: '330000', level: 'province', lat: 30.2741, lng: 120.1551 },
  { name: '安徽省', adcode: '340000', level: 'province', lat: 31.8206, lng: 117.2272 },
  { name: '福建省', adcode: '350000', level: 'province', lat: 26.0745, lng: 119.2965 },
  { name: '江西省', adcode: '360000', level: 'province', lat: 28.6829, lng: 115.8581 },
  { name: '山东省', adcode: '370000', level: 'province', lat: 36.6519, lng: 117.1205 },
  { name: '河南省', adcode: '410000', level: 'province', lat: 34.7466, lng: 113.6253 },
  { name: '湖北省', adcode: '420000', level: 'province', lat: 30.5928, lng: 114.3055 },
  { name: '湖南省', adcode: '430000', level: 'province', lat: 28.2282, lng: 112.9388 },
  { name: '广东省', adcode: '440000', level: 'province', lat: 23.1291, lng: 113.2644 },
  { name: '广西壮族自治区', adcode: '450000', level: 'province', lat: 22.8170, lng: 108.3665 },
  { name: '海南省', adcode: '460000', level: 'province', lat: 19.0437, lng: 110.1999 },
  { name: '重庆市', adcode: '500000', level: 'province', lat: 29.4316, lng: 106.9123 },
  { name: '四川省', adcode: '510000', level: 'province', lat: 30.5728, lng: 104.0668 },
  { name: '贵州省', adcode: '520000', level: 'province', lat: 26.5783, lng: 106.7135 },
  { name: '云南省', adcode: '530000', level: 'province', lat: 25.0420, lng: 102.7103 },
  { name: '西藏自治区', adcode: '540000', level: 'province', lat: 29.6470, lng: 91.1865 },
  { name: '陕西省', adcode: '610000', level: 'province', lat: 34.3416, lng: 108.9398 },
  { name: '甘肃省', adcode: '620000', level: 'province', lat: 36.0611, lng: 103.8343 },
  { name: '青海省', adcode: '630000', level: 'province', lat: 36.6171, lng: 101.7782 },
  { name: '宁夏回族自治区', adcode: '640000', level: 'province', lat: 38.4680, lng: 106.2586 },
  { name: '新疆维吾尔自治区', adcode: '650000', level: 'province', lat: 43.7929, lng: 87.6278 },
  { name: '台湾省', adcode: '710000', level: 'province', lat: 23.6978, lng: 120.9605 },
  { name: '香港特别行政区', adcode: '810000', level: 'province', lat: 22.3193, lng: 114.1694 },
  { name: '澳门特别行政区', adcode: '820000', level: 'province', lat: 22.1987, lng: 113.5439 },
];

// 城市列表（包含主要城市）
const cities: AdminRegion[] = [
  // 北京市
  { name: '北京市', adcode: '110100', level: 'city', lat: 39.9042, lng: 116.4074, provinceAdcode: '110000' },
  // 天津市
  { name: '天津市', adcode: '120100', level: 'city', lat: 39.0842, lng: 117.2010, provinceAdcode: '120000' },
  // 河北省
  { name: '石家庄市', adcode: '130100', level: 'city', lat: 37.8706, lng: 114.5149, provinceAdcode: '130000' },
  { name: '唐山市', adcode: '130200', level: 'city', lat: 39.6326, lng: 118.1889, provinceAdcode: '130000' },
  { name: '秦皇岛市', adcode: '130300', level: 'city', lat: 40.0551, lng: 119.6047, provinceAdcode: '130000' },
  // 山西省
  { name: '太原市', adcode: '140100', level: 'city', lat: 37.8706, lng: 112.5489, provinceAdcode: '140000' },
  { name: '大同市', adcode: '140200', level: 'city', lat: 40.0751, lng: 113.2950, provinceAdcode: '140000' },
  // 浙江省
  { name: '杭州市', adcode: '330100', level: 'city', lat: 30.2741, lng: 120.1551, provinceAdcode: '330000' },
  { name: '宁波市', adcode: '330200', level: 'city', lat: 29.8683, lng: 121.5440, provinceAdcode: '330000' },
  { name: '温州市', adcode: '330300', level: 'city', lat: 28.0029, lng: 120.6675, provinceAdcode: '330000' },
  { name: '嘉兴市', adcode: '330400', level: 'city', lat: 30.7667, lng: 120.7500, provinceAdcode: '330000' },
  // 广东省
  { name: '广州市', adcode: '440100', level: 'city', lat: 23.1291, lng: 113.2644, provinceAdcode: '440000' },
  { name: '深圳市', adcode: '440300', level: 'city', lat: 22.5431, lng: 114.0579, provinceAdcode: '440000' },
  { name: '珠海市', adcode: '440400', level: 'city', lat: 22.2709, lng: 113.5644, provinceAdcode: '440000' },
  { name: '佛山市', adcode: '440600', level: 'city', lat: 23.0218, lng: 113.1239, provinceAdcode: '440000' },
  // 四川省
  { name: '成都市', adcode: '510100', level: 'city', lat: 30.5728, lng: 104.0668, provinceAdcode: '510000' },
  { name: '自贡市', adcode: '510300', level: 'city', lat: 29.3434, lng: 104.7735, provinceAdcode: '510000' },
  // 台湾省
  { name: '台北市', adcode: '710100', level: 'city', lat: 25.0330, lng: 121.5654, provinceAdcode: '710000' },
  { name: '高雄市', adcode: '710200', level: 'city', lat: 22.6163, lng: 120.3006, provinceAdcode: '710000' },
];

// 区县列表（包含主要城市的部分区县）
const districts: AdminRegion[] = [
  // 北京市
  { name: '东城区', adcode: '110101', level: 'district', lat: 39.9309, lng: 116.4171, cityAdcode: '110100' },
  { name: '西城区', adcode: '110102', level: 'district', lat: 39.9188, lng: 116.3607, cityAdcode: '110100' },
  { name: '朝阳区', adcode: '110105', level: 'district', lat: 39.9409, lng: 116.5806, cityAdcode: '110100' },
  { name: '丰台区', adcode: '110106', level: 'district', lat: 39.8648, lng: 116.2889, cityAdcode: '110100' },
  { name: '石景山区', adcode: '110107', level: 'district', lat: 39.9059, lng: 116.2272, cityAdcode: '110100' },
  { name: '海淀区', adcode: '110108', level: 'district', lat: 39.9925, lng: 116.3055, cityAdcode: '110100' },
  { name: '门头沟区', adcode: '110109', level: 'district', lat: 39.9459, lng: 115.9192, cityAdcode: '110100' },
  { name: '房山区', adcode: '110111', level: 'district', lat: 39.7480, lng: 115.9732, cityAdcode: '110100' },
  { name: '通州区', adcode: '110112', level: 'district', lat: 39.9020, lng: 116.6570, cityAdcode: '110100' },
  { name: '顺义区', adcode: '110113', level: 'district', lat: 40.1297, lng: 116.6570, cityAdcode: '110100' },
  { name: '昌平区', adcode: '110114', level: 'district', lat: 40.2164, lng: 116.2313, cityAdcode: '110100' },
  { name: '大兴区', adcode: '110115', level: 'district', lat: 39.7294, lng: 116.4055, cityAdcode: '110100' },
  { name: '怀柔区', adcode: '110116', level: 'district', lat: 40.3203, lng: 116.6313, cityAdcode: '110100' },
  { name: '平谷区', adcode: '110117', level: 'district', lat: 40.1393, lng: 117.1205, cityAdcode: '110100' },
  { name: '密云区', adcode: '110118', level: 'district', lat: 40.3759, lng: 116.8459, cityAdcode: '110100' },
  { name: '延庆区', adcode: '110119', level: 'district', lat: 40.4561, lng: 115.9864, cityAdcode: '110100' },
  // 杭州市
  { name: '上城区', adcode: '330102', level: 'district', lat: 30.2598, lng: 120.1689, cityAdcode: '330100' },
  { name: '下城区', adcode: '330103', level: 'district', lat: 30.2823, lng: 120.1551, cityAdcode: '330100' },
  { name: '江干区', adcode: '330104', level: 'district', lat: 30.2741, lng: 120.2313, cityAdcode: '330100' },
  { name: '拱墅区', adcode: '330105', level: 'district', lat: 30.3203, lng: 120.1205, cityAdcode: '330100' },
  { name: '西湖区', adcode: '330106', level: 'district', lat: 30.2741, lng: 120.1189, cityAdcode: '330100' },
  { name: '滨江区', adcode: '330108', level: 'district', lat: 30.2059, lng: 120.2313, cityAdcode: '330100' },
  { name: '萧山区', adcode: '330109', level: 'district', lat: 30.1835, lng: 120.2889, cityAdcode: '330100' },
  { name: '余杭区', adcode: '330110', level: 'district', lat: 30.3759, lng: 120.0371, cityAdcode: '330100' },
  // 广州市
  { name: '荔湾区', adcode: '440103', level: 'district', lat: 23.1164, lng: 113.2644, cityAdcode: '440100' },
  { name: '越秀区', adcode: '440104', level: 'district', lat: 23.1291, lng: 113.3239, cityAdcode: '440100' },
  { name: '海珠区', adcode: '440105', level: 'district', lat: 23.0945, lng: 113.3239, cityAdcode: '440100' },
  { name: '天河区', adcode: '440106', level: 'district', lat: 23.1291, lng: 113.3605, cityAdcode: '440100' },
  { name: '白云区', adcode: '440111', level: 'district', lat: 23.1964, lng: 113.2644, cityAdcode: '440100' },
  { name: '黄埔区', adcode: '440112', level: 'district', lat: 23.0945, lng: 113.4471, cityAdcode: '440100' },
  { name: '番禺区', adcode: '440113', level: 'district', lat: 22.9798, lng: 113.3605, cityAdcode: '440100' },
  { name: '花都区', adcode: '440114', level: 'district', lat: 23.3885, lng: 113.2189, cityAdcode: '440100' },
  // 成都市
  { name: '锦江区', adcode: '510104', level: 'district', lat: 30.5728, lng: 104.0668, cityAdcode: '510100' },
  { name: '青羊区', adcode: '510105', level: 'district', lat: 30.5728, lng: 104.0668, cityAdcode: '510100' },
  { name: '金牛区', adcode: '510106', level: 'district', lat: 30.5728, lng: 104.0668, cityAdcode: '510100' },
  { name: '武侯区', adcode: '510107', level: 'district', lat: 30.5728, lng: 104.0668, cityAdcode: '510100' },
];

export const chinaAdministration = {
  provinces,
  cities,
  districts,
};
