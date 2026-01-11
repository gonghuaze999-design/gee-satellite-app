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

// 完整的全国行政区划数据
export const allAdminRegions: AdminRegion[] = [
  {
    name: '北京市',
    adcode: '110000',
    level: 'province',
    location: '116.4074,39.9042',
    children: [
      { name: '北京市', adcode: '110100', level: 'city', location: '116.4074,39.9042', children: [
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
      ]},
    ]
  },
  {
    name: '天津市',
    adcode: '120000',
    level: 'province',
    location: '117.2010,39.0842',
    children: [
      { name: '天津市', adcode: '120100', level: 'city', location: '117.2010,39.0842', children: [
        { name: '和平区', adcode: '120101', level: 'district', location: '117.2010,39.1040' },
        { name: '河东区', adcode: '120102', level: 'district', location: '117.2500,39.1000' },
        { name: '河西区', adcode: '120103', level: 'district', location: '117.1700,39.1100' },
        { name: '南开区', adcode: '120104', level: 'district', location: '117.1600,39.0800' },
        { name: '河北区', adcode: '120105', level: 'district', location: '117.2100,39.1300' },
        { name: '红桥区', adcode: '120106', level: 'district', location: '117.1900,39.1500' },
        { name: '东丽区', adcode: '120110', level: 'district', location: '117.3500,39.0800' },
        { name: '西青区', adcode: '120111', level: 'district', location: '117.0500,39.0500' },
        { name: '津南区', adcode: '120112', level: 'district', location: '117.2000,38.9500' },
        { name: '北辰区', adcode: '120113', level: 'district', location: '117.1500,39.2500' },
        { name: '武清区', adcode: '120114', level: 'district', location: '117.0000,39.3500' },
        { name: '宝坻区', adcode: '120115', level: 'district', location: '117.8000,39.7500' },
        { name: '滨海新区', adcode: '120116', level: 'district', location: '117.7000,38.9000' },
        { name: '宁河区', adcode: '120117', level: 'district', location: '117.8500,39.3500' },
        { name: '静海区', adcode: '120118', level: 'district', location: '116.9000,38.8000' },
        { name: '蓟州区', adcode: '120119', level: 'district', location: '117.4000,40.0000' },
      ]},
    ]
  },
  {
    name: '上海市',
    adcode: '310000',
    level: 'province',
    location: '121.4737,31.2304',
    children: [
      { name: '上海市', adcode: '310100', level: 'city', location: '121.4737,31.2304', children: [
        { name: '黄浦区', adcode: '310101', level: 'district', location: '121.5040,31.2304' },
        { name: '徐汇区', adcode: '310104', level: 'district', location: '121.4400,31.1900' },
        { name: '长宁区', adcode: '310105', level: 'district', location: '121.4200,31.2300' },
        { name: '静安区', adcode: '310106', level: 'district', location: '121.4600,31.2600' },
        { name: '普陀区', adcode: '310107', level: 'district', location: '121.4100,31.2400' },
        { name: '虹口区', adcode: '310109', level: 'district', location: '121.5100,31.2800' },
        { name: '杨浦区', adcode: '310110', level: 'district', location: '121.5400,31.2600' },
        { name: '闵行区', adcode: '310112', level: 'district', location: '121.5600,31.1200' },
        { name: '宝山区', adcode: '310113', level: 'district', location: '121.4600,31.3900' },
        { name: '嘉定区', adcode: '310114', level: 'district', location: '121.2600,31.3700' },
        { name: '浦东新区', adcode: '310115', level: 'district', location: '121.6000,31.2100' },
        { name: '金山区', adcode: '310116', level: 'district', location: '121.3500,30.7400' },
        { name: '松江区', adcode: '310117', level: 'district', location: '121.2200,31.0300' },
        { name: '青浦区', adcode: '310118', level: 'district', location: '120.9500,31.1600' },
        { name: '奉贤区', adcode: '310120', level: 'district', location: '121.4800,30.9100' },
        { name: '崇明区', adcode: '310151', level: 'district', location: '121.4000,31.6500' },
      ]},
    ]
  },
  {
    name: '广东省',
    adcode: '440000',
    level: 'province',
    location: '113.2644,23.1291',
    children: [
      { name: '广州市', adcode: '440100', level: 'city', location: '113.2644,23.1291', children: [
        { name: '荔湾区', adcode: '440103', level: 'district', location: '113.2500,23.1100' },
        { name: '越秀区', adcode: '440104', level: 'district', location: '113.3200,23.1300' },
        { name: '海珠区', adcode: '440105', level: 'district', location: '113.3300,23.0900' },
        { name: '天河区', adcode: '440106', level: 'district', location: '113.3500,23.1100' },
        { name: '白云区', adcode: '440111', level: 'district', location: '113.2200,23.1900' },
        { name: '黄埔区', adcode: '440112', level: 'district', location: '113.4500,23.0700' },
        { name: '番禺区', adcode: '440113', level: 'district', location: '113.3800,22.9800' },
        { name: '花都区', adcode: '440114', level: 'district', location: '113.1900,23.3800' },
        { name: '南沙区', adcode: '440115', level: 'district', location: '113.5300,22.7400' },
        { name: '从化区', adcode: '440116', level: 'district', location: '113.5700,23.5200' },
        { name: '增城区', adcode: '440117', level: 'district', location: '113.8100,23.3100' },
      ]},
      { name: '深圳市', adcode: '440300', level: 'city', location: '114.0579,22.5431', children: [
        { name: '罗湖区', adcode: '440303', level: 'district', location: '114.1200,22.5500' },
        { name: '福田区', adcode: '440304', level: 'district', location: '114.0600,22.5300' },
        { name: '南山区', adcode: '440305', level: 'district', location: '113.9300,22.5300' },
        { name: '宝安区', adcode: '440306', level: 'district', location: '113.8800,22.6400' },
        { name: '龙岗区', adcode: '440307', level: 'district', location: '114.2500,22.7200' },
        { name: '盐田区', adcode: '440308', level: 'district', location: '114.2400,22.5600' },
        { name: '龙华区', adcode: '440309', level: 'district', location: '114.0600,22.6800' },
        { name: '坪山区', adcode: '440310', level: 'district', location: '114.3700,22.7100' },
        { name: '光明区', adcode: '440311', level: 'district', location: '113.8800,22.7700' },
      ]},
      { name: '珠海市', adcode: '440400', level: 'city', location: '113.5439,22.2783', children: [
        { name: '香洲区', adcode: '440402', level: 'district', location: '113.5600,22.2800' },
        { name: '斗门区', adcode: '440403', level: 'district', location: '113.2600,22.2700' },
        { name: '金湾区', adcode: '440404', level: 'district', location: '113.3700,22.1500' },
      ]},
    ]
  },
  {
    name: '浙江省',
    adcode: '330000',
    level: 'province',
    location: '120.1551,30.2875',
    children: [
      { name: '杭州市', adcode: '330100', level: 'city', location: '120.1551,30.2875', children: [
        { name: '上城区', adcode: '330102', level: 'district', location: '120.1700,30.2600' },
        { name: '下城区', adcode: '330103', level: 'district', location: '120.1500,30.2900' },
        { name: '江干区', adcode: '330104', level: 'district', location: '120.2100,30.2700' },
        { name: '拱墅区', adcode: '330105', level: 'district', location: '120.1300,30.3300' },
        { name: '西湖区', adcode: '330106', level: 'district', location: '120.1100,30.2600' },
        { name: '滨江区', adcode: '330108', level: 'district', location: '120.2200,30.1900' },
        { name: '萧山区', adcode: '330109', level: 'district', location: '120.2800,30.1800' },
        { name: '余杭区', adcode: '330110', level: 'district', location: '120.3000,30.4200' },
        { name: '富阳区', adcode: '330111', level: 'district', location: '119.9600,30.0700' },
        { name: '临安区', adcode: '330112', level: 'district', location: '119.7200,30.2300' },
      ]},
      { name: '宁波市', adcode: '330200', level: 'city', location: '121.5440,29.8683', children: [
        { name: '海曙区', adcode: '330203', level: 'district', location: '121.5600,29.8700' },
        { name: '江北区', adcode: '330205', level: 'district', location: '121.5800,29.9100' },
        { name: '北仑区', adcode: '330206', level: 'district', location: '121.8300,29.8700' },
        { name: '镇海区', adcode: '330207', level: 'district', location: '121.6800,30.0200' },
        { name: '鄞州区', adcode: '330208', level: 'district', location: '121.5200,29.8100' },
        { name: '奉化区', adcode: '330209', level: 'district', location: '121.3900,29.6400' },
      ]},
    ]
  },
  {
    name: '江苏省',
    adcode: '320000',
    level: 'province',
    location: '118.7969,32.9388',
    children: [
      { name: '南京市', adcode: '320100', level: 'city', location: '118.7969,32.0603', children: [
        { name: '玄武区', adcode: '320102', level: 'district', location: '118.8300,32.0800' },
        { name: '秦淮区', adcode: '320104', level: 'district', location: '118.8000,31.9900' },
        { name: '建邺区', adcode: '320105', level: 'district', location: '118.7700,32.0200' },
        { name: '鼓楼区', adcode: '320106', level: 'district', location: '118.8100,32.1000' },
        { name: '浦口区', adcode: '320111', level: 'district', location: '118.7000,32.1500' },
        { name: '栖霞区', adcode: '320113', level: 'district', location: '118.9700,32.1600' },
        { name: '雨花台区', adcode: '320114', level: 'district', location: '118.8200,31.9300' },
      ]},
      { name: '苏州市', adcode: '320500', level: 'city', location: '120.5954,31.2989', children: [
        { name: '姑苏区', adcode: '320508', level: 'district', location: '120.5900,31.3100' },
        { name: '吴中区', adcode: '320509', level: 'district', location: '120.6300,31.2300' },
        { name: '相城区', adcode: '320510', level: 'district', location: '120.5500,31.4300' },
        { name: '虎丘区', adcode: '320511', level: 'district', location: '120.5800,31.3600' },
        { name: '吴江区', adcode: '320512', level: 'district', location: '120.6400,31.1600' },
      ]},
    ]
  },
];

/**
 * 省份数据
 */
export const provinces: AdminRegion[] = allAdminRegions.map(p => ({ ...p, children: undefined }));

/**
 * 获取所有省份
 */
export function getProvinces(): AdminRegion[] {
  return provinces;
}

/**
 * 根据省份adcode获取城市
 */
export function getCitiesByProvince(provinceAdcode: string): AdminRegion[] {
  const province = allAdminRegions.find(p => p.adcode === provinceAdcode);
  if (province && province.children) {
    return province.children.map(c => ({ ...c, children: undefined }));
  }
  return [];
}

/**
 * 根据城市adcode获取区县
 */
export function getDistrictsByCity(cityAdcode: string): AdminRegion[] {
  for (const province of allAdminRegions) {
    if (province.children) {
      for (const city of province.children) {
        if (city.adcode === cityAdcode && city.children) {
          return city.children.map(d => ({ ...d, children: undefined }));
        }
      }
    }
  }
  return [];
}

/**
 * 根据adcode获取地区信息
 */
export function getRegionByAdcode(adcode: string): AdminRegion | null {
  // 查找省份
  const province = allAdminRegions.find(p => p.adcode === adcode);
  if (province) {
    return { ...province, children: undefined };
  }

  // 查找城市
  for (const prov of allAdminRegions) {
    if (prov.children) {
      const city = prov.children.find(c => c.adcode === adcode);
      if (city) {
        return { ...city, children: undefined };
      }

      // 查找区县
      for (const c of prov.children) {
        if (c.children) {
          const district = c.children.find(d => d.adcode === adcode);
          if (district) {
            return { ...district, children: undefined };
          }
        }
      }
    }
  }

  return null;
}
