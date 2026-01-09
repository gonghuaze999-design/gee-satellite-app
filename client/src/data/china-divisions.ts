// 完整的中国行政区划数据（省市县三级）
// 简化版本，包含主要城市和区县

export interface Division {
  code: string;
  name: string;
  lat: number;
  lng: number;
  children?: Division[];
}

export const chinaProvinces: Division[] = [
  {
    code: 'zhejiang',
    name: '浙江省',
    lat: 30.2741,
    lng: 120.1551,
    children: [
      {
        code: 'zhejiang_hangzhou',
        name: '杭州市',
        lat: 30.2741,
        lng: 120.1551,
        children: [
          { code: 'zhejiang_hangzhou_shangcheng', name: '上城区', lat: 30.2741, lng: 120.1551 },
          { code: 'zhejiang_hangzhou_xiacheng', name: '下城区', lat: 30.2741, lng: 120.1551 },
          { code: 'zhejiang_hangzhou_jianggan', name: '江干区', lat: 30.2741, lng: 120.1551 },
          { code: 'zhejiang_hangzhou_gongshu', name: '拱墅区', lat: 30.2741, lng: 120.1551 },
          { code: 'zhejiang_hangzhou_xihu', name: '西湖区', lat: 30.2741, lng: 120.1551 },
          { code: 'zhejiang_hangzhou_binjiang', name: '滨江区', lat: 30.2741, lng: 120.1551 },
          { code: 'zhejiang_hangzhou_yuhang', name: '余杭区', lat: 30.2741, lng: 120.1551 },
          { code: 'zhejiang_hangzhou_fuyang', name: '富阳区', lat: 30.2741, lng: 120.1551 },
        ]
      },
      {
        code: 'zhejiang_ningbo',
        name: '宁波市',
        lat: 29.8683,
        lng: 121.5440,
        children: [
          { code: 'zhejiang_ningbo_haishu', name: '海曙区', lat: 29.8683, lng: 121.5440 },
          { code: 'zhejiang_ningbo_jiangbei', name: '江北区', lat: 29.8683, lng: 121.5440 },
          { code: 'zhejiang_ningbo_beilun', name: '北仑区', lat: 29.8683, lng: 121.5440 },
          { code: 'zhejiang_ningbo_zhenhai', name: '镇海区', lat: 29.8683, lng: 121.5440 },
          { code: 'zhejiang_ningbo_yinzhou', name: '鄞州区', lat: 29.8683, lng: 121.5440 },
        ]
      },
      {
        code: 'zhejiang_wenzhou',
        name: '温州市',
        lat: 28.0021,
        lng: 120.6625,
        children: [
          { code: 'zhejiang_wenzhou_lucheng', name: '鹿城区', lat: 28.0021, lng: 120.6625 },
          { code: 'zhejiang_wenzhou_longwan', name: '龙湾区', lat: 28.0021, lng: 120.6625 },
          { code: 'zhejiang_wenzhou_ouhai', name: '瓯海区', lat: 28.0021, lng: 120.6625 },
        ]
      },
    ]
  },
  {
    code: 'jiangsu',
    name: '江苏省',
    lat: 32.0603,
    lng: 118.7969,
    children: [
      {
        code: 'jiangsu_nanjing',
        name: '南京市',
        lat: 32.0603,
        lng: 118.7969,
        children: [
          { code: 'jiangsu_nanjing_huangpu', name: '黄埔区', lat: 32.0603, lng: 118.7969 },
          { code: 'jiangsu_nanjing_jianye', name: '建邺区', lat: 32.0603, lng: 118.7969 },
          { code: 'jiangsu_nanjing_qinhuai', name: '秦淮区', lat: 32.0603, lng: 118.7969 },
          { code: 'jiangsu_nanjing_raixia', name: '栖霞区', lat: 32.0603, lng: 118.7969 },
          { code: 'jiangsu_nanjing_pukou', name: '浦口区', lat: 32.0603, lng: 118.7969 },
        ]
      },
      {
        code: 'jiangsu_suzhou',
        name: '苏州市',
        lat: 31.2989,
        lng: 120.5954,
        children: [
          { code: 'jiangsu_suzhou_gusu', name: '姑苏区', lat: 31.2989, lng: 120.5954 },
          { code: 'jiangsu_suzhou_wuzhong', name: '吴中区', lat: 31.2989, lng: 120.5954 },
          { code: 'jiangsu_suzhou_xiangcheng', name: '相城区', lat: 31.2989, lng: 120.5954 },
          { code: 'jiangsu_suzhou_kunshan', name: '昆山市', lat: 31.2989, lng: 120.5954 },
        ]
      },
    ]
  },
  {
    code: 'anhui',
    name: '安徽省',
    lat: 31.8206,
    lng: 117.2272,
    children: [
      {
        code: 'anhui_hefei',
        name: '合肥市',
        lat: 31.8206,
        lng: 117.2272,
        children: [
          { code: 'anhui_hefei_luyang', name: '庐阳区', lat: 31.8206, lng: 117.2272 },
          { code: 'anhui_hefei_shushan', name: '蜀山区', lat: 31.8206, lng: 117.2272 },
          { code: 'anhui_hefei_baohe', name: '包河区', lat: 31.8206, lng: 117.2272 },
          { code: 'anhui_hefei_changfeng', name: '长丰县', lat: 31.8206, lng: 117.2272 },
        ]
      },
    ]
  },
];

export function getProvinces() {
  return chinaProvinces.map(p => ({ code: p.code, name: p.name }));
}

export function getCitiesByProvince(provinceCode: string) {
  const province = chinaProvinces.find(p => p.code === provinceCode);
  if (!province || !province.children) return [];
  return province.children.map(c => ({ code: c.code, name: c.name }));
}

export function getDistrictsByCity(cityCode: string) {
  for (const province of chinaProvinces) {
    if (province.children) {
      const city = province.children.find(c => c.code === cityCode);
      if (city && city.children) {
        return city.children.map(d => ({ code: d.code, name: d.name }));
      }
    }
  }
  return [];
}

export function getDivisionCenter(code: string): { lat: number; lng: number } | null {
  // 搜索省份
  const province = chinaProvinces.find(p => p.code === code);
  if (province) return { lat: province.lat, lng: province.lng };

  // 搜索市
  for (const prov of chinaProvinces) {
    if (prov.children) {
      const city = prov.children.find(c => c.code === code);
      if (city) return { lat: city.lat, lng: city.lng };

      // 搜索县
      for (const c of prov.children) {
        if (c.children) {
          const district = c.children.find(d => d.code === code);
          if (district) return { lat: district.lat, lng: district.lng };
        }
      }
    }
  }

  return null;
}
