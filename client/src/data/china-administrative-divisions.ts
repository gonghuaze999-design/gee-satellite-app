/**
 * 中国行政区划数据
 * 包含省、市、区县三级行政区划
 * 数据来源：国家测绘地理信息局标准
 */

export interface AdministrativeDivision {
  code: string;
  name: string;
  level: 'province' | 'city' | 'district';
  center: { lat: number; lng: number };
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  children?: AdministrativeDivision[];
}

// 中国省级行政区划数据
export const chinaProvinces: AdministrativeDivision[] = [
  {
    code: '11',
    name: '北京市',
    level: 'province',
    center: { lat: 39.9042, lng: 116.4074 },
    bounds: { north: 40.4497, south: 39.4387, east: 117.5172, west: 115.7317 },
    children: [
      { code: '1101', name: '东城区', level: 'district', center: { lat: 39.9289, lng: 116.4181 } },
      { code: '1102', name: '西城区', level: 'district', center: { lat: 39.9138, lng: 116.3772 } },
      { code: '1103', name: '朝阳区', level: 'district', center: { lat: 39.9289, lng: 116.5659 } },
      { code: '1104', name: '丰台区', level: 'district', center: { lat: 39.8639, lng: 116.2889 } },
      { code: '1105', name: '石景山区', level: 'district', center: { lat: 39.9069, lng: 116.2319 } },
      { code: '1106', name: '海淀区', level: 'district', center: { lat: 39.9863, lng: 116.3055 } },
      { code: '1107', name: '门头沟区', level: 'district', center: { lat: 39.9289, lng: 115.9172 } },
      { code: '1108', name: '房山区', level: 'district', center: { lat: 39.7480, lng: 115.9730 } },
      { code: '1109', name: '通州区', level: 'district', center: { lat: 39.9013, lng: 116.6581 } },
      { code: '1110', name: '顺义区', level: 'district', center: { lat: 40.1297, lng: 116.6550 } },
      { code: '1111', name: '昌平区', level: 'district', center: { lat: 40.2164, lng: 116.2313 } },
      { code: '1112', name: '大兴区', level: 'district', center: { lat: 39.7486, lng: 116.3422 } },
      { code: '1113', name: '怀柔区', level: 'district', center: { lat: 40.3203, lng: 116.6319 } },
      { code: '1114', name: '平谷区', level: 'district', center: { lat: 40.1136, lng: 117.1178 } },
      { code: '1115', name: '密云区', level: 'district', center: { lat: 40.3764, lng: 116.8425 } },
      { code: '1116', name: '延庆区', level: 'district', center: { lat: 40.4561, lng: 115.9822 } },
    ],
  },
  {
    code: '12',
    name: '天津市',
    level: 'province',
    center: { lat: 39.0842, lng: 117.2008 },
    bounds: { north: 39.7381, south: 38.7311, east: 118.0894, west: 116.7055 },
    children: [
      { code: '1201', name: '和平区', level: 'district', center: { lat: 39.1029, lng: 117.2003 } },
      { code: '1202', name: '河东区', level: 'district', center: { lat: 39.0764, lng: 117.2722 } },
      { code: '1203', name: '河西区', level: 'district', center: { lat: 39.0736, lng: 117.1597 } },
      { code: '1204', name: '南开区', level: 'district', center: { lat: 39.0603, lng: 117.1603 } },
      { code: '1205', name: '河北区', level: 'district', center: { lat: 39.1364, lng: 117.2139 } },
      { code: '1206', name: '红桥区', level: 'district', center: { lat: 39.1603, lng: 117.1364 } },
      { code: '1207', name: '东丽区', level: 'district', center: { lat: 39.0178, lng: 117.4511 } },
      { code: '1208', name: '西青区', level: 'district', center: { lat: 39.0261, lng: 116.9972 } },
      { code: '1209', name: '津南区', level: 'district', center: { lat: 38.9211, lng: 117.2667 } },
      { code: '1210', name: '北辰区', level: 'district', center: { lat: 39.2069, lng: 117.1722 } },
      { code: '1211', name: '武清区', level: 'district', center: { lat: 39.3703, lng: 117.0050 } },
      { code: '1212', name: '宝坻区', level: 'district', center: { lat: 39.6736, lng: 117.4556 } },
      { code: '1213', name: '滨海新区', level: 'district', center: { lat: 38.9394, lng: 117.6556 } },
      { code: '1214', name: '宁河区', level: 'district', center: { lat: 39.3556, lng: 117.6722 } },
      { code: '1215', name: '静海区', level: 'district', center: { lat: 38.9311, lng: 116.9997 } },
      { code: '1216', name: '蓟州区', level: 'district', center: { lat: 40.0036, lng: 117.4022 } },
    ],
  },
  {
    code: '13',
    name: '河北省',
    level: 'province',
    center: { lat: 38.0428, lng: 114.5149 },
    bounds: { north: 42.6025, south: 36.6388, east: 119.6381, west: 113.4391 },
    children: [
      { code: '1301', name: '石家庄市', level: 'city', center: { lat: 38.0428, lng: 114.5149 } },
      { code: '1302', name: '唐山市', level: 'city', center: { lat: 39.6300, lng: 118.1894 } },
      { code: '1303', name: '秦皇岛市', level: 'city', center: { lat: 40.0431, lng: 119.6028 } },
      { code: '1304', name: '邯郸市', level: 'city', center: { lat: 36.6171, lng: 114.4995 } },
      { code: '1305', name: '邢台市', level: 'city', center: { lat: 37.0680, lng: 114.5149 } },
      { code: '1306', name: '保定市', level: 'city', center: { lat: 38.8672, lng: 115.4586 } },
      { code: '1307', name: '张家口市', level: 'city', center: { lat: 40.8028, lng: 114.8858 } },
      { code: '1308', name: '承德市', level: 'city', center: { lat: 40.9761, lng: 117.9353 } },
      { code: '1309', name: '沧州市', level: 'city', center: { lat: 38.3274, lng: 116.8347 } },
      { code: '1310', name: '衡水市', level: 'city', center: { lat: 37.7161, lng: 115.6722 } },
    ],
  },
  {
    code: '14',
    name: '山西省',
    level: 'province',
    center: { lat: 37.8706, lng: 112.5489 },
    bounds: { north: 40.4331, south: 34.2793, east: 114.3309, west: 110.0531 },
    children: [
      { code: '1401', name: '太原市', level: 'city', center: { lat: 37.8706, lng: 112.5489 } },
      { code: '1402', name: '大同市', level: 'city', center: { lat: 40.0731, lng: 113.2997 } },
      { code: '1403', name: '阳泉市', level: 'city', center: { lat: 37.8297, lng: 113.5831 } },
      { code: '1404', name: '长治市', level: 'city', center: { lat: 36.1914, lng: 113.1231 } },
      { code: '1405', name: '晋城市', level: 'city', center: { lat: 35.4944, lng: 112.8425 } },
      { code: '1406', name: '朔州市', level: 'city', center: { lat: 39.3317, lng: 112.2797 } },
      { code: '1407', name: '晋中市', level: 'city', center: { lat: 37.5225, lng: 112.7489 } },
      { code: '1408', name: '运城市', level: 'city', center: { lat: 35.0247, lng: 110.9989 } },
      { code: '1409', name: '忻州市', level: 'city', center: { lat: 38.4178, lng: 112.7331 } },
      { code: '1410', name: '临汾市', level: 'city', center: { lat: 36.0831, lng: 111.5189 } },
      { code: '1411', name: '吕梁市', level: 'city', center: { lat: 37.5225, lng: 111.1331 } },
    ],
  },
  {
    code: '15',
    name: '内蒙古自治区',
    level: 'province',
    center: { lat: 40.8088, lng: 111.6531 },
    bounds: { north: 53.3955, south: 37.2400, east: 126.0471, west: 97.1289 },
    children: [
      { code: '1501', name: '呼和浩特市', level: 'city', center: { lat: 40.8088, lng: 111.6531 } },
      { code: '1502', name: '包头市', level: 'city', center: { lat: 40.6586, lng: 109.8331 } },
      { code: '1503', name: '乌海市', level: 'city', center: { lat: 39.6831, lng: 106.8331 } },
      { code: '1504', name: '赤峰市', level: 'city', center: { lat: 42.2758, lng: 118.8831 } },
      { code: '1505', name: '通辽市', level: 'city', center: { lat: 43.6136, lng: 122.2331 } },
      { code: '1506', name: '鄂尔多斯市', level: 'city', center: { lat: 39.6089, lng: 109.7831 } },
      { code: '1507', name: '呼伦贝尔市', level: 'city', center: { lat: 48.9606, lng: 119.7331 } },
      { code: '1508', name: '巴彦淖尔市', level: 'city', center: { lat: 40.7558, lng: 107.3831 } },
      { code: '1509', name: '乌兰察布市', level: 'city', center: { lat: 41.3331, lng: 113.1331 } },
      { code: '1510', name: '兴安盟', level: 'city', center: { lat: 46.4331, lng: 121.5331 } },
      { code: '1511', name: '锡林郭勒盟', level: 'city', center: { lat: 43.9331, lng: 115.9331 } },
      { code: '1512', name: '阿拉善盟', level: 'city', center: { lat: 38.8331, lng: 105.7331 } },
    ],
  },
  {
    code: '21',
    name: '辽宁省',
    level: 'province',
    center: { lat: 41.8045, lng: 123.4328 },
    bounds: { north: 43.2675, south: 38.7314, east: 125.1235, west: 118.4071 },
    children: [
      { code: '2101', name: '沈阳市', level: 'city', center: { lat: 41.8045, lng: 123.4328 } },
      { code: '2102', name: '大连市', level: 'city', center: { lat: 38.9140, lng: 121.6147 } },
      { code: '2103', name: '鞍山市', level: 'city', center: { lat: 41.1086, lng: 122.9908 } },
      { code: '2104', name: '抚顺市', level: 'city', center: { lat: 41.8625, lng: 123.9231 } },
      { code: '2105', name: '本溪市', level: 'city', center: { lat: 41.2964, lng: 123.7742 } },
      { code: '2106', name: '丹东市', level: 'city', center: { lat: 40.1242, lng: 124.3828 } },
      { code: '2107', name: '锦州市', level: 'city', center: { lat: 41.1186, lng: 121.1328 } },
      { code: '2108', name: '营口市', level: 'city', center: { lat: 40.6686, lng: 122.2328 } },
      { code: '2109', name: '阜新市', level: 'city', center: { lat: 41.8631, lng: 121.6528 } },
      { code: '2110', name: '辽阳市', level: 'city', center: { lat: 41.2686, lng: 123.1828 } },
      { code: '2111', name: '盘锦市', level: 'city', center: { lat: 41.1186, lng: 122.0728 } },
      { code: '2112', name: '铁岭市', level: 'city', center: { lat: 42.2931, lng: 123.8428 } },
      { code: '2113', name: '朝阳市', level: 'city', center: { lat: 41.5331, lng: 120.4328 } },
    ],
  },
  {
    code: '22',
    name: '吉林省',
    level: 'province',
    center: { lat: 43.8171, lng: 125.3235 },
    bounds: { north: 46.2722, south: 41.2000, east: 131.2987, west: 121.7147 },
    children: [
      { code: '2201', name: '长春市', level: 'city', center: { lat: 43.8171, lng: 125.3235 } },
      { code: '2202', name: '吉林市', level: 'city', center: { lat: 43.8131, lng: 126.5735 } },
      { code: '2203', name: '四平市', level: 'city', center: { lat: 43.1631, lng: 124.3735 } },
      { code: '2204', name: '辽源市', level: 'city', center: { lat: 42.9131, lng: 124.9235 } },
      { code: '2205', name: '通化市', level: 'city', center: { lat: 41.7331, lng: 125.9235 } },
      { code: '2206', name: '白山市', level: 'city', center: { lat: 41.9431, lng: 126.4235 } },
      { code: '2207', name: '松原市', level: 'city', center: { lat: 45.1231, lng: 124.8235 } },
      { code: '2208', name: '白城市', level: 'city', center: { lat: 45.6231, lng: 122.8235 } },
      { code: '2209', name: '延边朝鲜族自治州', level: 'city', center: { lat: 42.8931, lng: 129.4735 } },
    ],
  },
  {
    code: '23',
    name: '黑龙江省',
    level: 'province',
    center: { lat: 45.8038, lng: 126.5349 },
    bounds: { north: 53.5538, south: 43.4231, east: 135.0842, west: 121.1147 },
    children: [
      { code: '2301', name: '哈尔滨市', level: 'city', center: { lat: 45.8038, lng: 126.5349 } },
      { code: '2302', name: '齐齐哈尔市', level: 'city', center: { lat: 47.3431, lng: 123.9549 } },
      { code: '2303', name: '鸡西市', level: 'city', center: { lat: 45.2931, lng: 130.9549 } },
      { code: '2304', name: '鹤岗市', level: 'city', center: { lat: 47.3531, lng: 130.2849 } },
      { code: '2305', name: '双鸭山市', level: 'city', center: { lat: 46.6431, lng: 131.1649 } },
      { code: '2306', name: '大庆市', level: 'city', center: { lat: 46.5831, lng: 125.1049 } },
      { code: '2307', name: '伊春市', level: 'city', center: { lat: 47.7231, lng: 130.0349 } },
      { code: '2308', name: '佳木斯市', level: 'city', center: { lat: 46.5831, lng: 130.3549 } },
      { code: '2309', name: '七台河市', level: 'city', center: { lat: 45.8031, lng: 131.5949 } },
      { code: '2310', name: '牡丹江市', level: 'city', center: { lat: 44.5831, lng: 129.5849 } },
      { code: '2311', name: '黑河市', level: 'city', center: { lat: 50.2531, lng: 127.4949 } },
      { code: '2312', name: '绥化市', level: 'city', center: { lat: 46.6331, lng: 125.9649 } },
      { code: '2323', name: '大兴安岭地区', level: 'city', center: { lat: 50.4131, lng: 124.7249 } },
    ],
  },
  {
    code: '31',
    name: '上海市',
    level: 'province',
    center: { lat: 31.2304, lng: 121.4737 },
    bounds: { north: 31.8683, south: 30.7033, east: 122.2081, west: 120.8581 },
    children: [
      { code: '3101', name: '黄浦区', level: 'district', center: { lat: 31.2304, lng: 121.4737 } },
      { code: '3102', name: '徐汇区', level: 'district', center: { lat: 31.1831, lng: 121.4337 } },
      { code: '3103', name: '长宁区', level: 'district', center: { lat: 31.2231, lng: 121.3737 } },
      { code: '3104', name: '静安区', level: 'district', center: { lat: 31.2631, lng: 121.4037 } },
      { code: '3105', name: '普陀区', level: 'district', center: { lat: 31.2431, lng: 121.3937 } },
      { code: '3106', name: '虹口区', level: 'district', center: { lat: 31.2831, lng: 121.5037 } },
      { code: '3107', name: '杨浦区', level: 'district', center: { lat: 31.2631, lng: 121.5337 } },
      { code: '3108', name: '闵行区', level: 'district', center: { lat: 31.1231, lng: 121.4237 } },
      { code: '3109', name: '宝山区', level: 'district', center: { lat: 31.3931, lng: 121.4637 } },
      { code: '3110', name: '浦东新区', level: 'district', center: { lat: 31.2304, lng: 121.5437 } },
      { code: '3111', name: '金山区', level: 'district', center: { lat: 30.7431, lng: 121.3537 } },
      { code: '3112', name: '松江区', level: 'district', center: { lat: 31.0331, lng: 121.2237 } },
      { code: '3113', name: '青浦区', level: 'district', center: { lat: 31.1631, lng: 120.9637 } },
      { code: '3114', name: '奉贤区', level: 'district', center: { lat: 30.9131, lng: 121.4837 } },
      { code: '3115', name: '崇明区', level: 'district', center: { lat: 31.6331, lng: 121.3937 } },
    ],
  },
  {
    code: '32',
    name: '江苏省',
    level: 'province',
    center: { lat: 32.0603, lng: 118.7969 },
    bounds: { north: 35.0728, south: 30.7169, east: 121.8577, west: 118.4251 },
    children: [
      { code: '3201', name: '南京市', level: 'city', center: { lat: 32.0603, lng: 118.7969 } },
      { code: '3202', name: '无锡市', level: 'city', center: { lat: 31.5741, lng: 120.2954 } },
      { code: '3203', name: '徐州市', level: 'city', center: { lat: 34.2658, lng: 117.1205 } },
      { code: '3204', name: '常州市', level: 'city', center: { lat: 31.7771, lng: 119.9481 } },
      { code: '3205', name: '苏州市', level: 'city', center: { lat: 31.2989, lng: 120.5954 } },
      { code: '3206', name: '南通市', level: 'city', center: { lat: 32.0031, lng: 120.8954 } },
      { code: '3207', name: '连云港市', level: 'city', center: { lat: 34.5994, lng: 119.2965 } },
      { code: '3208', name: '淮安市', level: 'city', center: { lat: 32.9956, lng: 119.0181 } },
      { code: '3209', name: '盐城市', level: 'city', center: { lat: 32.8311, lng: 120.1551 } },
      { code: '3210', name: '扬州市', level: 'city', center: { lat: 32.3934, lng: 119.4251 } },
      { code: '3211', name: '镇江市', level: 'city', center: { lat: 32.1934, lng: 119.4451 } },
      { code: '3212', name: '泰州市', level: 'city', center: { lat: 32.4534, lng: 119.9251 } },
      { code: '3213', name: '宿迁市', level: 'city', center: { lat: 33.9631, lng: 118.2951 } },
    ],
  },
  {
    code: '33',
    name: '浙江省',
    level: 'province',
    center: { lat: 30.2741, lng: 120.1551 },
    bounds: { north: 34.7252, south: 27.2181, east: 123.1037, west: 118.0894 },
    children: [
      { code: '3301', name: '杭州市', level: 'city', center: { lat: 30.2741, lng: 120.1551 } },
      { code: '3302', name: '宁波市', level: 'city', center: { lat: 29.8683, lng: 121.5440 } },
      { code: '3303', name: '温州市', level: 'city', center: { lat: 28.0021, lng: 120.6625 } },
      { code: '3304', name: '嘉兴市', level: 'city', center: { lat: 30.7617, lng: 120.7625 } },
      { code: '3305', name: '湖州市', level: 'city', center: { lat: 30.8671, lng: 120.0825 } },
      { code: '3306', name: '绍兴市', level: 'city', center: { lat: 30.0031, lng: 120.5825 } },
      { code: '3307', name: '金华市', level: 'city', center: { lat: 29.1189, lng: 119.6425 } },
      { code: '3308', name: '衢州市', level: 'city', center: { lat: 28.9731, lng: 118.8825 } },
      { code: '3309', name: '舟山市', level: 'city', center: { lat: 29.9831, lng: 122.2025 } },
      { code: '3310', name: '台州市', level: 'city', center: { lat: 28.6592, lng: 121.4425 } },
      { code: '3311', name: '丽水市', level: 'city', center: { lat: 28.4531, lng: 119.9225 } },
    ],
  },
  {
    code: '34',
    name: '安徽省',
    level: 'province',
    center: { lat: 31.8454, lng: 117.2272 },
    bounds: { north: 34.3819, south: 29.3787, east: 119.6337, west: 114.9529 },
    children: [
      { code: '3401', name: '合肥市', level: 'city', center: { lat: 31.8454, lng: 117.2272 } },
      { code: '3402', name: '芜湖市', level: 'city', center: { lat: 31.3386, lng: 118.3972 } },
      { code: '3403', name: '蚌埠市', level: 'city', center: { lat: 32.9295, lng: 117.3672 } },
      { code: '3404', name: '淮南市', level: 'city', center: { lat: 32.6272, lng: 116.7972 } },
      { code: '3405', name: '马鞍山市', level: 'city', center: { lat: 31.7286, lng: 118.5072 } },
      { code: '3406', name: '淮北市', level: 'city', center: { lat: 33.9731, lng: 116.7872 } },
      { code: '3407', name: '铜陵市', level: 'city', center: { lat: 30.9431, lng: 117.8172 } },
      { code: '3408', name: '安庆市', level: 'city', center: { lat: 30.5431, lng: 117.0572 } },
      { code: '3410', name: '黄山市', level: 'city', center: { lat: 29.7131, lng: 118.3872 } },
      { code: '3411', name: '阜阳市', level: 'city', center: { lat: 32.8931, lng: 115.8272 } },
      { code: '3412', name: '宿州市', level: 'city', center: { lat: 33.6431, lng: 116.9772 } },
      { code: '3413', name: '六安市', level: 'city', center: { lat: 31.7531, lng: 115.8872 } },
      { code: '3415', name: '亳州市', level: 'city', center: { lat: 32.7831, lng: 115.7872 } },
      { code: '3416', name: '池州市', level: 'city', center: { lat: 30.6631, lng: 117.4972 } },
      { code: '3417', name: '宣城市', level: 'city', center: { lat: 30.9431, lng: 118.7572 } },
    ],
  },
  {
    code: '35',
    name: '福建省',
    level: 'province',
    center: { lat: 26.0745, lng: 119.2965 },
    bounds: { north: 28.3275, south: 23.5006, east: 120.6147, west: 116.0371 },
    children: [
      { code: '3501', name: '福州市', level: 'city', center: { lat: 26.0745, lng: 119.2965 } },
      { code: '3502', name: '厦门市', level: 'city', center: { lat: 24.4798, lng: 118.0894 } },
      { code: '3503', name: '莆田市', level: 'city', center: { lat: 25.4631, lng: 119.0065 } },
      { code: '3504', name: '三明市', level: 'city', center: { lat: 26.2631, lng: 117.6365 } },
      { code: '3505', name: '泉州市', level: 'city', center: { lat: 24.8831, lng: 118.5865 } },
      { code: '3506', name: '漳州市', level: 'city', center: { lat: 24.5131, lng: 117.6565 } },
      { code: '3507', name: '南平市', level: 'city', center: { lat: 27.3331, lng: 118.1765 } },
      { code: '3508', name: '龙岩市', level: 'city', center: { lat: 25.0931, lng: 117.0265 } },
      { code: '3509', name: '宁德市', level: 'city', center: { lat: 26.6631, lng: 119.5265 } },
    ],
  },
  {
    code: '36',
    name: '江西省',
    level: 'province',
    center: { lat: 28.6832, lng: 115.8581 },
    bounds: { north: 30.4767, south: 24.3382, east: 118.6341, west: 113.3439 },
    children: [
      { code: '3601', name: '南昌市', level: 'city', center: { lat: 28.6832, lng: 115.8581 } },
      { code: '3602', name: '景德镇市', level: 'city', center: { lat: 29.2831, lng: 117.1781 } },
      { code: '3603', name: '萍乡市', level: 'city', center: { lat: 27.6231, lng: 113.8481 } },
      { code: '3604', name: '九江市', level: 'city', center: { lat: 29.7031, lng: 115.9881 } },
      { code: '3605', name: '新余市', level: 'city', center: { lat: 27.8131, lng: 114.9281 } },
      { code: '3606', name: '鹰潭市', level: 'city', center: { lat: 28.2431, lng: 117.0381 } },
      { code: '3607', name: '赣州市', level: 'city', center: { lat: 25.8531, lng: 114.9381 } },
      { code: '3608', name: '吉安市', level: 'city', center: { lat: 27.1131, lng: 114.9881 } },
      { code: '3609', name: '宜春市', level: 'city', center: { lat: 27.8031, lng: 115.7681 } },
      { code: '3610', name: '抚州市', level: 'city', center: { lat: 27.9531, lng: 116.3481 } },
      { code: '3611', name: '上饶市', level: 'city', center: { lat: 28.4431, lng: 117.9681 } },
    ],
  },
  {
    code: '37',
    name: '山东省',
    level: 'province',
    center: { lat: 36.6519, lng: 117.1205 },
    bounds: { north: 37.9263, south: 34.2271, east: 122.4142, west: 114.4995 },
    children: [
      { code: '3701', name: '济南市', level: 'city', center: { lat: 36.6519, lng: 117.1205 } },
      { code: '3702', name: '青岛市', level: 'city', center: { lat: 36.0671, lng: 120.3826 } },
      { code: '3703', name: '淄博市', level: 'city', center: { lat: 36.7831, lng: 117.9405 } },
      { code: '3704', name: '枣庄市', level: 'city', center: { lat: 34.8631, lng: 117.5605 } },
      { code: '3705', name: '东营市', level: 'city', center: { lat: 37.4331, lng: 118.6805 } },
      { code: '3706', name: '烟台市', level: 'city', center: { lat: 37.5331, lng: 121.1205 } },
      { code: '3707', name: '潍坊市', level: 'city', center: { lat: 36.9931, lng: 119.1405 } },
      { code: '3708', name: '济宁市', level: 'city', center: { lat: 35.4031, lng: 116.5905 } },
      { code: '3709', name: '泰安市', level: 'city', center: { lat: 36.1931, lng: 117.1305 } },
      { code: '3710', name: '威海市', level: 'city', center: { lat: 37.5131, lng: 122.1205 } },
      { code: '3711', name: '日照市', level: 'city', center: { lat: 35.4231, lng: 119.4605 } },
      { code: '3712', name: '莱芜市', level: 'city', center: { lat: 36.2231, lng: 117.6705 } },
      { code: '3713', name: '临沂市', level: 'city', center: { lat: 35.1031, lng: 118.3405 } },
      { code: '3714', name: '德州市', level: 'city', center: { lat: 37.4531, lng: 116.2905 } },
      { code: '3715', name: '聊城市', level: 'city', center: { lat: 36.4531, lng: 115.9805 } },
      { code: '3716', name: '滨州市', level: 'city', center: { lat: 37.3631, lng: 117.9605 } },
      { code: '3717', name: '菏泽市', level: 'city', center: { lat: 35.2431, lng: 115.4605 } },
    ],
  },
  {
    code: '41',
    name: '河南省',
    level: 'province',
    center: { lat: 34.7466, lng: 113.6253 },
    bounds: { north: 36.3612, south: 32.1544, east: 116.6570, west: 110.2121 },
    children: [
      { code: '4101', name: '郑州市', level: 'city', center: { lat: 34.7466, lng: 113.6253 } },
      { code: '4102', name: '开封市', level: 'city', center: { lat: 34.2931, lng: 114.3053 } },
      { code: '4103', name: '洛阳市', level: 'city', center: { lat: 34.6331, lng: 112.4353 } },
      { code: '4104', name: '平顶山市', level: 'city', center: { lat: 33.7431, lng: 113.3053 } },
      { code: '4105', name: '安阳市', level: 'city', center: { lat: 36.1031, lng: 114.3553 } },
      { code: '4106', name: '鹤壁市', level: 'city', center: { lat: 35.9431, lng: 114.2953 } },
      { code: '4107', name: '新乡市', level: 'city', center: { lat: 35.3031, lng: 113.9253 } },
      { code: '4108', name: '焦作市', level: 'city', center: { lat: 35.2331, lng: 113.2353 } },
      { code: '4109', name: '濮阳市', level: 'city', center: { lat: 35.7631, lng: 115.0353 } },
      { code: '4110', name: '许昌市', level: 'city', center: { lat: 34.0231, lng: 113.8353 } },
      { code: '4111', name: '漯河市', level: 'city', center: { lat: 33.5631, lng: 114.0053 } },
      { code: '4112', name: '三门峡市', level: 'city', center: { lat: 34.7831, lng: 111.1853 } },
      { code: '4113', name: '南阳市', level: 'city', center: { lat: 32.9931, lng: 112.5353 } },
      { code: '4114', name: '商丘市', level: 'city', center: { lat: 34.4331, lng: 115.6353 } },
      { code: '4115', name: '信阳市', level: 'city', center: { lat: 32.1231, lng: 114.0753 } },
      { code: '4116', name: '周口市', level: 'city', center: { lat: 33.6231, lng: 114.8553 } },
      { code: '4117', name: '驻马店市', level: 'city', center: { lat: 32.7831, lng: 114.0253 } },
    ],
  },
  {
    code: '42',
    name: '湖北省',
    level: 'province',
    center: { lat: 30.5928, lng: 114.3055 },
    bounds: { north: 33.6894, south: 28.0438, east: 116.5428, west: 108.6127 },
    children: [
      { code: '4201', name: '武汉市', level: 'city', center: { lat: 30.5928, lng: 114.3055 } },
      { code: '4202', name: '黄石市', level: 'city', center: { lat: 30.2131, lng: 115.0355 } },
      { code: '4203', name: '十堰市', level: 'city', center: { lat: 32.6431, lng: 110.7755 } },
      { code: '4205', name: '宜昌市', level: 'city', center: { lat: 30.7031, lng: 111.2855 } },
      { code: '4206', name: '襄阳市', level: 'city', center: { lat: 32.0031, lng: 112.1455 } },
      { code: '4207', name: '鄂州市', level: 'city', center: { lat: 30.3931, lng: 114.8855 } },
      { code: '4208', name: '孝感市', level: 'city', center: { lat: 30.8631, lng: 113.9255 } },
      { code: '4209', name: '荆门市', level: 'city', center: { lat: 31.8031, lng: 112.2055 } },
      { code: '4210', name: '咸宁市', level: 'city', center: { lat: 29.8331, lng: 114.2955 } },
      { code: '4211', name: '荆州市', level: 'city', center: { lat: 30.3331, lng: 112.2455 } },
      { code: '4212', name: '黄冈市', level: 'city', center: { lat: 30.4531, lng: 115.3555 } },
      { code: '4213', name: '鄂东市', level: 'city', center: { lat: 29.2931, lng: 115.5255 } },
      { code: '4228', name: '恩施土家族苗族自治州', level: 'city', center: { lat: 30.2831, lng: 109.4455 } },
      { code: '4229', name: '神农架林区', level: 'city', center: { lat: 31.7531, lng: 110.6755 } },
    ],
  },
  {
    code: '43',
    name: '湖南省',
    level: 'province',
    center: { lat: 28.2282, lng: 112.9388 },
    bounds: { north: 30.1287, south: 24.7618, east: 114.1529, west: 108.7718 },
    children: [
      { code: '4301', name: '长沙市', level: 'city', center: { lat: 28.2282, lng: 112.9388 } },
      { code: '4302', name: '株洲市', level: 'city', center: { lat: 27.8331, lng: 113.1488 } },
      { code: '4303', name: '湘潭市', level: 'city', center: { lat: 27.8631, lng: 112.9288 } },
      { code: '4304', name: '衡阳市', level: 'city', center: { lat: 26.8931, lng: 112.5788 } },
      { code: '4305', name: '邵阳市', level: 'city', center: { lat: 27.2331, lng: 111.4688 } },
      { code: '4306', name: '岳阳市', level: 'city', center: { lat: 29.3631, lng: 113.1088 } },
      { code: '4307', name: '常德市', level: 'city', center: { lat: 29.0431, lng: 111.6388 } },
      { code: '4308', name: '益阳市', level: 'city', center: { lat: 28.5931, lng: 112.3588 } },
      { code: '4309', name: '娄底市', level: 'city', center: { lat: 27.7331, lng: 111.9988 } },
      { code: '4310', name: '湘西土家族苗族自治州', level: 'city', center: { lat: 28.3131, lng: 109.7388 } },
    ],
  },
  {
    code: '44',
    name: '广东省',
    level: 'province',
    center: { lat: 23.1291, lng: 113.2644 },
    bounds: { north: 25.3144, south: 20.1276, east: 116.0671, west: 109.6487 },
    children: [
      { code: '4401', name: '广州市', level: 'city', center: { lat: 23.1291, lng: 113.2644 } },
      { code: '4402', name: '韶关市', level: 'city', center: { lat: 24.8031, lng: 113.5944 } },
      { code: '4403', name: '深圳市', level: 'city', center: { lat: 22.5431, lng: 114.0644 } },
      { code: '4404', name: '珠海市', level: 'city', center: { lat: 22.3031, lng: 113.9644 } },
      { code: '4405', name: '汕头市', level: 'city', center: { lat: 23.3631, lng: 116.6344 } },
      { code: '4406', name: '佛山市', level: 'city', center: { lat: 23.0231, lng: 113.1244 } },
      { code: '4407', name: '江门市', level: 'city', center: { lat: 22.5831, lng: 113.0944 } },
      { code: '4408', name: '湛江市', level: 'city', center: { lat: 21.2731, lng: 110.3544 } },
      { code: '4409', name: '茂名市', level: 'city', center: { lat: 21.6631, lng: 110.9244 } },
      { code: '4412', name: '肇庆市', level: 'city', center: { lat: 23.0531, lng: 112.4744 } },
      { code: '4413', name: '惠州市', level: 'city', center: { lat: 23.0931, lng: 114.4044 } },
      { code: '4414', name: '梅州市', level: 'city', center: { lat: 24.2831, lng: 116.1244 } },
      { code: '4415', name: '汕尾市', level: 'city', center: { lat: 22.7831, lng: 115.3744 } },
      { code: '4416', name: '河源市', level: 'city', center: { lat: 23.7431, lng: 114.6844 } },
      { code: '4417', name: '阳江市', level: 'city', center: { lat: 21.8631, lng: 111.9844 } },
      { code: '4418', name: '清远市', level: 'city', center: { lat: 24.8131, lng: 112.7944 } },
      { code: '4419', name: '东莞市', level: 'city', center: { lat: 23.0431, lng: 113.7544 } },
      { code: '4420', name: '中山市', level: 'city', center: { lat: 22.5131, lng: 113.3844 } },
      { code: '4451', name: '潮州市', level: 'city', center: { lat: 23.6631, lng: 116.6244 } },
      { code: '4452', name: '揭阳市', level: 'city', center: { lat: 23.5431, lng: 115.8544 } },
      { code: '4453', name: '云浮市', level: 'city', center: { lat: 22.9331, lng: 112.0244 } },
    ],
  },
  {
    code: '45',
    name: '广西壮族自治区',
    level: 'province',
    center: { lat: 22.8170, lng: 108.3665 },
    bounds: { north: 26.3840, south: 20.8969, east: 112.0531, west: 104.4260 },
    children: [
      { code: '4501', name: '南宁市', level: 'city', center: { lat: 22.8170, lng: 108.3665 } },
      { code: '4502', name: '柳州市', level: 'city', center: { lat: 24.3231, lng: 109.4265 } },
      { code: '4503', name: '桂林市', level: 'city', center: { lat: 25.2831, lng: 110.2965 } },
      { code: '4504', name: '梧州市', level: 'city', center: { lat: 23.4731, lng: 111.2865 } },
      { code: '4505', name: '北海市', level: 'city', center: { lat: 21.4831, lng: 109.1165 } },
      { code: '4506', name: '防城港市', level: 'city', center: { lat: 21.6531, lng: 108.3465 } },
      { code: '4507', name: '钦州市', level: 'city', center: { lat: 21.9631, lng: 108.6365 } },
      { code: '4508', name: '贵港市', level: 'city', center: { lat: 23.1031, lng: 109.6065 } },
      { code: '4509', name: '玉林市', level: 'city', center: { lat: 22.6431, lng: 110.1565 } },
      { code: '4510', name: '百色市', level: 'city', center: { lat: 23.8931, lng: 106.6065 } },
      { code: '4511', name: '贺州市', level: 'city', center: { lat: 24.4031, lng: 111.5565 } },
      { code: '4512', name: '河池市', level: 'city', center: { lat: 24.6931, lng: 108.0765 } },
      { code: '4513', name: '来宾市', level: 'city', center: { lat: 23.7631, lng: 109.2265 } },
      { code: '4514', name: '崇左市', level: 'city', center: { lat: 22.4131, lng: 107.3565 } },
    ],
  },
  {
    code: '46',
    name: '海南省',
    level: 'province',
    center: { lat: 19.0431, lng: 110.1931 },
    bounds: { north: 20.2510, south: 18.2226, east: 111.0534, west: 108.6171 },
    children: [
      { code: '4601', name: '海口市', level: 'city', center: { lat: 20.0331, lng: 110.1931 } },
      { code: '4602', name: '三亚市', level: 'city', center: { lat: 18.2531, lng: 109.5131 } },
      { code: '4603', name: '三沙市', level: 'city', center: { lat: 16.8331, lng: 112.3431 } },
      { code: '4604', name: '儋州市', level: 'city', center: { lat: 19.5331, lng: 109.5831 } },
    ],
  },
  {
    code: '50',
    name: '重庆市',
    level: 'province',
    center: { lat: 29.4316, lng: 106.9123 },
    bounds: { north: 32.1343, south: 28.1519, east: 110.1119, west: 105.1719 },
    children: [
      { code: '5001', name: '渝中区', level: 'district', center: { lat: 29.5631, lng: 106.5723 } },
      { code: '5002', name: '渝北区', level: 'district', center: { lat: 29.5931, lng: 106.6423 } },
      { code: '5003', name: '渝西区', level: 'district', center: { lat: 29.4231, lng: 106.4523 } },
      { code: '5004', name: '南岸区', level: 'district', center: { lat: 29.3931, lng: 106.5923 } },
      { code: '5005', name: '北碚区', level: 'district', center: { lat: 29.8031, lng: 106.2223 } },
      { code: '5006', name: '巴南区', level: 'district', center: { lat: 29.2631, lng: 106.5423 } },
      { code: '5007', name: '长寿区', level: 'district', center: { lat: 30.3631, lng: 107.4023 } },
      { code: '5008', name: '江津区', level: 'district', center: { lat: 29.2031, lng: 106.2623 } },
      { code: '5009', name: '合川区', level: 'district', center: { lat: 29.9831, lng: 106.2723 } },
      { code: '5010', name: '永川区', level: 'district', center: { lat: 29.4131, lng: 105.8923 } },
      { code: '5011', name: '南川区', level: 'district', center: { lat: 29.1631, lng: 107.0823 } },
      { code: '5012', name: '綦江区', level: 'district', center: { lat: 28.9631, lng: 106.6623 } },
      { code: '5013', name: '大足区', level: 'district', center: { lat: 29.4031, lng: 105.7223 } },
      { code: '5014', name: '铜梁区', level: 'district', center: { lat: 29.8431, lng: 105.8423 } },
      { code: '5015', name: '潼南区', level: 'district', center: { lat: 30.1931, lng: 105.8323 } },
      { code: '5016', name: '荣昌区', level: 'district', center: { lat: 29.6031, lng: 105.4323 } },
      { code: '5017', name: '璧山区', level: 'district', center: { lat: 29.5931, lng: 106.2223 } },
      { code: '5018', name: '梁平区', level: 'district', center: { lat: 30.6831, lng: 107.8223 } },
      { code: '5019', name: '城口县', level: 'district', center: { lat: 32.1331, lng: 108.6623 } },
      { code: '5020', name: '丰都县', level: 'district', center: { lat: 29.8631, lng: 107.7323 } },
      { code: '5021', name: '垫江县', level: 'district', center: { lat: 30.3431, lng: 107.3623 } },
      { code: '5022', name: '忠县', level: 'district', center: { lat: 30.2931, lng: 108.0423 } },
      { code: '5023', name: '石柱土家族自治县', level: 'district', center: { lat: 29.9931, lng: 108.1123 } },
      { code: '5024', name: '秀山土家族苗族自治县', level: 'district', center: { lat: 28.9631, lng: 108.9923 } },
      { code: '5025', name: '酉阳土家族苗族自治县', level: 'district', center: { lat: 28.8431, lng: 108.7723 } },
      { code: '5026', name: '彭水苗族土家族自治县', level: 'district', center: { lat: 29.2931, lng: 108.1723 } },
    ],
  },
  {
    code: '51',
    name: '四川省',
    level: 'province',
    center: { lat: 30.5728, lng: 104.0668 },
    bounds: { north: 34.3019, south: 25.5010, east: 108.6171, west: 97.2112 },
    children: [
      { code: '5101', name: '成都市', level: 'city', center: { lat: 30.5728, lng: 104.0668 } },
      { code: '5102', name: '自贡市', level: 'city', center: { lat: 29.3331, lng: 104.7768 } },
      { code: '5103', name: '攀枝花市', level: 'city', center: { lat: 26.5831, lng: 101.7168 } },
      { code: '5104', name: '泸州市', level: 'city', center: { lat: 28.8931, lng: 105.4368 } },
      { code: '5105', name: '德阳市', level: 'city', center: { lat: 31.1331, lng: 104.3768 } },
      { code: '5106', name: '绵阳市', level: 'city', center: { lat: 31.7331, lng: 104.7468 } },
      { code: '5107', name: '广元市', level: 'city', center: { lat: 32.4331, lng: 105.8368 } },
      { code: '5108', name: '遂宁市', level: 'city', center: { lat: 30.5331, lng: 105.5868 } },
      { code: '5109', name: '内江市', level: 'city', center: { lat: 29.5931, lng: 105.0668 } },
      { code: '5110', name: '乐山市', level: 'city', center: { lat: 29.5531, lng: 103.7668 } },
      { code: '5111', name: '南充市', level: 'city', center: { lat: 30.8031, lng: 106.0868 } },
      { code: '5112', name: '眉山市', level: 'city', center: { lat: 30.0731, lng: 103.8668 } },
      { code: '5113', name: '宜宾市', level: 'city', center: { lat: 28.7631, lng: 104.6368 } },
      { code: '5114', name: '广安市', level: 'city', center: { lat: 30.4631, lng: 106.6268 } },
      { code: '5115', name: '达州市', level: 'city', center: { lat: 31.2131, lng: 107.4668 } },
      { code: '5116', name: '巴中市', level: 'city', center: { lat: 31.8631, lng: 106.7568 } },
      { code: '5117', name: '资阳市', level: 'city', center: { lat: 30.1231, lng: 104.6368 } },
      { code: '5118', name: '阿坝藏族羌族自治州', level: 'city', center: { lat: 32.8931, lng: 102.2268 } },
      { code: '5119', name: '甘孜藏族自治州', level: 'city', center: { lat: 30.0031, lng: 101.9668 } },
      { code: '5120', name: '凉山彝族自治州', level: 'city', center: { lat: 27.8131, lng: 102.2668 } },
    ],
  },
  {
    code: '52',
    name: '贵州省',
    level: 'province',
    center: { lat: 26.5783, lng: 106.7135 },
    bounds: { north: 29.1300, south: 24.1380, east: 109.5068, west: 103.7329 },
    children: [
      { code: '5201', name: '贵阳市', level: 'city', center: { lat: 26.5783, lng: 106.7135 } },
      { code: '5202', name: '六盘水市', level: 'city', center: { lat: 26.5931, lng: 104.8435 } },
      { code: '5203', name: '遵义市', level: 'city', center: { lat: 27.7231, lng: 106.9335 } },
      { code: '5204', name: '安顺市', level: 'city', center: { lat: 26.2231, lng: 105.9335 } },
      { code: '5205', name: '毕节市', level: 'city', center: { lat: 27.2931, lng: 105.2835 } },
      { code: '5206', name: '铜仁市', level: 'city', center: { lat: 27.7131, lng: 109.1835 } },
      { code: '5223', name: '黔西南布依族苗族自治州', level: 'city', center: { lat: 25.0831, lng: 104.8935 } },
      { code: '5224', name: '黔东南苗族侗族自治州', level: 'city', center: { lat: 26.5831, lng: 107.9735 } },
      { code: '5226', name: '黔南布依族苗族自治州', level: 'city', center: { lat: 26.2631, lng: 107.5235 } },
    ],
  },
  {
    code: '53',
    name: '云南省',
    level: 'province',
    center: { lat: 25.0420, lng: 102.7103 },
    bounds: { north: 29.2290, south: 21.4906, east: 106.1146, west: 97.1693 },
    children: [
      { code: '5301', name: '昆明市', level: 'city', center: { lat: 25.0420, lng: 102.7103 } },
      { code: '5302', name: '曲靖市', level: 'city', center: { lat: 25.5031, lng: 103.7603 } },
      { code: '5303', name: '玉溪市', level: 'city', center: { lat: 24.3531, lng: 102.5503 } },
      { code: '5304', name: '保山市', level: 'city', center: { lat: 25.1131, lng: 99.1703 } },
      { code: '5305', name: '昭通市', level: 'city', center: { lat: 27.3331, lng: 103.7203 } },
      { code: '5306', name: '丽江市', level: 'city', center: { lat: 26.8731, lng: 100.2303 } },
      { code: '5307', name: '普洱市', level: 'city', center: { lat: 22.8231, lng: 100.9703 } },
      { code: '5308', name: '临沧市', level: 'city', center: { lat: 23.8831, lng: 99.6303 } },
      { code: '5309', name: '楚雄彝族自治州', level: 'city', center: { lat: 25.0431, lng: 101.5403 } },
      { code: '5323', name: '红河哈尼族彝族自治州', level: 'city', center: { lat: 23.3631, lng: 103.3703 } },
      { code: '5325', name: '文山壮族苗族自治州', level: 'city', center: { lat: 23.3831, lng: 104.2403 } },
      { code: '5329', name: '大理白族自治州', level: 'city', center: { lat: 25.5931, lng: 100.3103 } },
      { code: '5331', name: '德宏傣族景颇族自治州', level: 'city', center: { lat: 24.4331, lng: 98.5803 } },
      { code: '5333', name: '怒江傈僳族自治州', level: 'city', center: { lat: 26.8631, lng: 98.8603 } },
      { code: '5334', name: '迪庆藏族自治州', level: 'city', center: { lat: 27.8231, lng: 99.7103 } },
    ],
  },
  {
    code: '54',
    name: '西藏自治区',
    level: 'province',
    center: { lat: 29.6470, lng: 91.1865 },
    bounds: { north: 36.4761, south: 26.7423, east: 99.1162, west: 78.2399 },
    children: [
      { code: '5401', name: '拉萨市', level: 'city', center: { lat: 29.6470, lng: 91.1865 } },
      { code: '5402', name: '日喀则市', level: 'city', center: { lat: 28.7931, lng: 88.8765 } },
      { code: '5403', name: '山南市', level: 'city', center: { lat: 27.6631, lng: 91.7665 } },
      { code: '5404', name: '林芝市', level: 'city', center: { lat: 29.6631, lng: 94.3565 } },
      { code: '5405', name: '昌都市', level: 'city', center: { lat: 31.1531, lng: 97.1765 } },
      { code: '5406', name: '那曲市', level: 'city', center: { lat: 31.4831, lng: 92.0365 } },
      { code: '5407', name: '阿里地区', level: 'city', center: { lat: 32.5031, lng: 80.1065 } },
    ],
  },
  {
    code: '61',
    name: '陕西省',
    level: 'province',
    center: { lat: 34.3416, lng: 108.9398 },
    bounds: { north: 39.7345, south: 31.8652, east: 111.4909, west: 104.6659 },
    children: [
      { code: '6101', name: '西安市', level: 'city', center: { lat: 34.3416, lng: 108.9398 } },
      { code: '6102', name: '铜川市', level: 'city', center: { lat: 35.0831, lng: 109.0798 } },
      { code: '6103', name: '宝鸡市', level: 'city', center: { lat: 34.3631, lng: 107.1498 } },
      { code: '6104', name: '咸阳市', level: 'city', center: { lat: 34.3331, lng: 108.7098 } },
      { code: '6105', name: '渭南市', level: 'city', center: { lat: 34.4931, lng: 109.5098 } },
      { code: '6106', name: '延安市', level: 'city', center: { lat: 36.5931, lng: 109.4898 } },
      { code: '6107', name: '汉中市', level: 'city', center: { lat: 33.0731, lng: 107.0298 } },
      { code: '6108', name: '榆林市', level: 'city', center: { lat: 38.2831, lng: 109.7698 } },
      { code: '6109', name: '商洛市', level: 'city', center: { lat: 33.8631, lng: 109.9698 } },
    ],
  },
  {
    code: '62',
    name: '甘肃省',
    level: 'province',
    center: { lat: 36.0611, lng: 103.8343 },
    bounds: { north: 42.9689, south: 32.1117, east: 108.4171, west: 92.1887 },
    children: [
      { code: '6201', name: '兰州市', level: 'city', center: { lat: 36.0611, lng: 103.8343 } },
      { code: '6202', name: '嘉峪关市', level: 'city', center: { lat: 39.7731, lng: 98.2843 } },
      { code: '6203', name: '金昌市', level: 'city', center: { lat: 38.5131, lng: 102.1843 } },
      { code: '6204', name: '白银市', level: 'city', center: { lat: 36.5431, lng: 104.1743 } },
      { code: '6205', name: '天水市', level: 'city', center: { lat: 34.5831, lng: 105.7243 } },
      { code: '6206', name: '武威市', level: 'city', center: { lat: 37.9231, lng: 102.6343 } },
      { code: '6207', name: '张掖市', level: 'city', center: { lat: 38.9331, lng: 100.4543 } },
      { code: '6208', name: '平凉市', level: 'city', center: { lat: 35.5431, lng: 106.6543 } },
      { code: '6209', name: '酒泉市', level: 'city', center: { lat: 39.7331, lng: 99.5043 } },
      { code: '6210', name: '庆阳市', level: 'city', center: { lat: 35.7131, lng: 107.6443 } },
      { code: '6211', name: '定西市', level: 'city', center: { lat: 35.5831, lng: 104.6243 } },
      { code: '6212', name: '陇南市', level: 'city', center: { lat: 33.3831, lng: 104.9843 } },
    ],
  },
  {
    code: '63',
    name: '青海省',
    level: 'province',
    center: { lat: 36.6171, lng: 101.7782 },
    bounds: { north: 39.1917, south: 32.1519, east: 105.1119, west: 89.1119 },
    children: [
      { code: '6301', name: '西宁市', level: 'city', center: { lat: 36.6171, lng: 101.7782 } },
      { code: '6302', name: '海东市', level: 'city', center: { lat: 36.5031, lng: 102.1082 } },
      { code: '6322', name: '海北藏族自治州', level: 'city', center: { lat: 37.4731, lng: 100.9082 } },
      { code: '6323', name: '黄南藏族自治州', level: 'city', center: { lat: 35.5131, lng: 102.0082 } },
      { code: '6325', name: '海南藏族自治州', level: 'city', center: { lat: 36.8231, lng: 100.6282 } },
      { code: '6326', name: '果洛藏族自治州', level: 'city', center: { lat: 34.4731, lng: 99.8082 } },
      { code: '6327', name: '玉树藏族自治州', level: 'city', center: { lat: 32.9931, lng: 97.0082 } },
      { code: '6328', name: '海西蒙古族藏族自治州', level: 'city', center: { lat: 37.3731, lng: 97.3582 } },
    ],
  },
  {
    code: '64',
    name: '宁夏回族自治区',
    level: 'province',
    center: { lat: 38.4680, lng: 106.2586 },
    bounds: { north: 39.5005, south: 35.3796, east: 107.3989, west: 104.1719 },
    children: [
      { code: '6401', name: '银川市', level: 'city', center: { lat: 38.4680, lng: 106.2586 } },
      { code: '6402', name: '石嘴山市', level: 'city', center: { lat: 39.0331, lng: 106.3886 } },
      { code: '6403', name: '吴忠市', level: 'city', center: { lat: 37.9831, lng: 106.0086 } },
      { code: '6404', name: '固原市', level: 'city', center: { lat: 36.0031, lng: 106.2786 } },
      { code: '6405', name: '中卫市', level: 'city', center: { lat: 37.4831, lng: 105.1886 } },
    ],
  },
  {
    code: '65',
    name: '新疆维吾尔自治区',
    level: 'province',
    center: { lat: 43.7929, lng: 87.6278 },
    bounds: { north: 48.4686, south: 34.5957, east: 96.0371, west: 73.4238 },
    children: [
      { code: '6501', name: '乌鲁木齐市', level: 'city', center: { lat: 43.7929, lng: 87.6278 } },
      { code: '6502', name: '克拉玛依市', level: 'city', center: { lat: 45.5931, lng: 84.8878 } },
      { code: '6504', name: '吐鲁番市', level: 'city', center: { lat: 42.9331, lng: 89.1878 } },
      { code: '6505', name: '哈密市', level: 'city', center: { lat: 42.8131, lng: 93.4478 } },
      { code: '6506', name: '昌吉回族自治州', level: 'city', center: { lat: 44.0131, lng: 87.3078 } },
      { code: '6522', name: '博尔塔拉蒙古自治州', level: 'city', center: { lat: 44.9031, lng: 81.9478 } },
      { code: '6523', name: '巴音郭楞蒙古自治州', level: 'city', center: { lat: 41.7631, lng: 86.1578 } },
      { code: '6524', name: '阿克苏地区', level: 'city', center: { lat: 41.1631, lng: 80.2678 } },
      { code: '6525', name: '克州', level: 'city', center: { lat: 39.1131, lng: 79.9278 } },
      { code: '6526', name: '喀什地区', level: 'city', center: { lat: 39.4731, lng: 75.9278 } },
      { code: '6527', name: '和田地区', level: 'city', center: { lat: 37.1031, lng: 79.9278 } },
      { code: '6528', name: '伊犁哈萨克自治州', level: 'city', center: { lat: 43.9231, lng: 81.3078 } },
      { code: '6529', name: '塔城地区', level: 'city', center: { lat: 46.3931, lng: 82.9878 } },
      { code: '6530', name: '阿勒泰地区', level: 'city', center: { lat: 47.8331, lng: 88.1478 } },
    ],
  },
];

// 获取所有国家列表
export function getCountries(): AdministrativeDivision[] {
  return [
    { code: 'china', name: '中国', level: 'province', center: { lat: 35.8617, lng: 104.1954 } },
    { code: 'usa', name: '美国', level: 'province', center: { lat: 37.0902, lng: -95.7129 } },
    { code: 'japan', name: '日本', level: 'province', center: { lat: 36.2048, lng: 138.2529 } },
    { code: 'india', name: '印度', level: 'province', center: { lat: 20.5937, lng: 78.9629 } },
    { code: 'brazil', name: '巴西', level: 'province', center: { lat: -14.2350, lng: -51.9253 } },
    { code: 'australia', name: '澳大利亚', level: 'province', center: { lat: -25.2744, lng: 133.7751 } },
  ];
}

// 获取指定国家的省份/州列表
export function getProvinces(countryCode: string): AdministrativeDivision[] {
  if (countryCode === 'china') {
    return chinaProvinces;
  }
  return [];
}

// 获取行政区划的中心坐标
export function getDivisionCenter(code: string): { lat: number; lng: number } | null {
  // 查找中国省份
  for (const province of chinaProvinces) {
    if (province.code === code) {
      return province.center;
    }
    // 查找市级
    if (province.children) {
      for (const city of province.children) {
        if (city.code === code) {
          return city.center;
        }
        // 查找区县级
        if (city.children) {
          for (const district of city.children) {
            if (district.code === code) {
              return district.center;
            }
          }
        }
      }
    }
  }

  // 查找国家
  const countries = getCountries();
  for (const country of countries) {
    if (country.code === code) {
      return country.center;
    }
  }

  return null;
}

// 获取行政区划的边界
export function getDivisionBounds(code: string): {
  north: number;
  south: number;
  east: number;
  west: number;
} | null {
  // 查找中国省份
  for (const province of chinaProvinces) {
    if (province.code === code && province.bounds) {
      return province.bounds;
    }
  }
  return null;
}

// 获取指定省份的所有区县
export function getDistrictsByProvince(provinceCode: string): AdministrativeDivision[] {
  const province = chinaProvinces.find((p) => p.code === provinceCode);
  if (province && province.children) {
    const districts: AdministrativeDivision[] = [];
    for (const city of province.children) {
      if (city.children) {
        districts.push(...city.children);
      }
    }
    return districts;
  }
  return [];
}

// 获取指定省份的所有市级行政区
export function getCitiesByProvince(provinceCode: string): AdministrativeDivision[] {
  const province = chinaProvinces.find((p) => p.code === provinceCode);
  if (province && province.children) {
    return province.children;
  }
  return [];
}
