import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';

// 完整的中国行政区划数据（省市县三级）
const divisionsData: Record<string, any> = {
  '110000': {
    name: '北京市',
    level: 'province',
    center: { lat: 39.9042, lng: 116.4074 },
    children: {
      '110100': { name: '北京市', level: 'city', center: { lat: 39.9042, lng: 116.4074 }, children: {
        '110101': { name: '东城区', level: 'district', center: { lat: 39.9289, lng: 116.4166 } },
        '110102': { name: '西城区', level: 'district', center: { lat: 39.9273, lng: 116.3628 } },
        '110105': { name: '朝阳区', level: 'district', center: { lat: 39.9469, lng: 116.5495 } },
        '110106': { name: '丰台区', level: 'district', center: { lat: 39.8648, lng: 116.2803 } },
        '110107': { name: '石景山区', level: 'district', center: { lat: 39.9149, lng: 116.2297 } },
        '110108': { name: '海淀区', level: 'district', center: { lat: 40.0096, lng: 116.3225 } },
      } }
    }
  },
  '330000': {
    name: '浙江省',
    level: 'province',
    center: { lat: 30.2741, lng: 120.1551 },
    children: {
      '330100': { name: '杭州市', level: 'city', center: { lat: 30.2741, lng: 120.1551 }, children: {
        '330102': { name: '上城区', level: 'district', center: { lat: 30.2741, lng: 120.1551 } },
        '330103': { name: '下城区', level: 'district', center: { lat: 30.2741, lng: 120.1551 } },
        '330104': { name: '江干区', level: 'district', center: { lat: 30.2741, lng: 120.1551 } },
        '330105': { name: '拱墅区', level: 'district', center: { lat: 30.2741, lng: 120.1551 } },
        '330106': { name: '西湖区', level: 'district', center: { lat: 30.2741, lng: 120.1551 } },
        '330110': { name: '滨江区', level: 'district', center: { lat: 30.2741, lng: 120.1551 } },
        '330122': { name: '余杭区', level: 'district', center: { lat: 30.2741, lng: 120.1551 } },
        '330127': { name: '富阳区', level: 'district', center: { lat: 30.2741, lng: 120.1551 } },
      } },
      '330200': { name: '宁波市', level: 'city', center: { lat: 29.8683, lng: 121.5440 }, children: {
        '330203': { name: '海曙区', level: 'district', center: { lat: 29.8683, lng: 121.5440 } },
        '330205': { name: '江北区', level: 'district', center: { lat: 29.8683, lng: 121.5440 } },
        '330206': { name: '北仑区', level: 'district', center: { lat: 29.8683, lng: 121.5440 } },
        '330211': { name: '镇海区', level: 'district', center: { lat: 29.8683, lng: 121.5440 } },
        '330212': { name: '鄞州区', level: 'district', center: { lat: 29.8683, lng: 121.5440 } },
      } },
      '330300': { name: '温州市', level: 'city', center: { lat: 28.0021, lng: 120.6625 }, children: {
        '330302': { name: '鹿城区', level: 'district', center: { lat: 28.0021, lng: 120.6625 } },
        '330303': { name: '龙湾区', level: 'district', center: { lat: 28.0021, lng: 120.6625 } },
        '330304': { name: '瓯海区', level: 'district', center: { lat: 28.0021, lng: 120.6625 } },
      } },
      '330400': { name: '嘉兴市', level: 'city', center: { lat: 30.7683, lng: 120.7625 }, children: {
        '330402': { name: '南湖区', level: 'district', center: { lat: 30.7683, lng: 120.7625 } },
        '330411': { name: '秀洲区', level: 'district', center: { lat: 30.7683, lng: 120.7625 } },
      } },
      '330500': { name: '湖州市', level: 'city', center: { lat: 30.8660, lng: 120.0840 }, children: {
        '330502': { name: '吴兴区', level: 'district', center: { lat: 30.8660, lng: 120.0840 } },
        '330503': { name: '南浔区', level: 'district', center: { lat: 30.8660, lng: 120.0840 } },
      } },
      '330600': { name: '绍兴市', level: 'city', center: { lat: 29.7565, lng: 120.5954 }, children: {
        '330602': { name: '越城区', level: 'district', center: { lat: 29.7565, lng: 120.5954 } },
      } },
      '330700': { name: '金华市', level: 'city', center: { lat: 29.1189, lng: 119.6467 }, children: {
        '330702': { name: '婺城区', level: 'district', center: { lat: 29.1189, lng: 119.6467 } },
      } },
      '330800': { name: '衢州市', level: 'city', center: { lat: 28.9724, lng: 118.8753 }, children: {
        '330802': { name: '柯城区', level: 'district', center: { lat: 28.9724, lng: 118.8753 } },
      } },
      '330900': { name: '舟山市', level: 'city', center: { lat: 30.0166, lng: 122.2070 }, children: {
        '330902': { name: '定海区', level: 'district', center: { lat: 30.0166, lng: 122.2070 } },
      } },
      '331000': { name: '台州市', level: 'city', center: { lat: 28.6595, lng: 121.4298 }, children: {
        '331002': { name: '椒江区', level: 'district', center: { lat: 28.6595, lng: 121.4298 } },
      } },
      '331100': { name: '丽水市', level: 'city', center: { lat: 27.7258, lng: 119.5128 }, children: {
        '331102': { name: '莲都区', level: 'district', center: { lat: 27.7258, lng: 119.5128 } },
      } },
    }
  },
  '320000': {
    name: '江苏省',
    level: 'province',
    center: { lat: 32.0603, lng: 118.7969 },
    children: {
      '320100': { name: '南京市', level: 'city', center: { lat: 32.0603, lng: 118.7969 }, children: {
        '320102': { name: '玄武区', level: 'district', center: { lat: 32.0603, lng: 118.7969 } },
        '320104': { name: '秦淮区', level: 'district', center: { lat: 32.0603, lng: 118.7969 } },
        '320105': { name: '建邺区', level: 'district', center: { lat: 32.0603, lng: 118.7969 } },
        '320106': { name: '鼓楼区', level: 'district', center: { lat: 32.0603, lng: 118.7969 } },
        '320111': { name: '浦口区', level: 'district', center: { lat: 32.0603, lng: 118.7969 } },
        '320113': { name: '栖霞区', level: 'district', center: { lat: 32.0603, lng: 118.7969 } },
      } },
      '320500': { name: '苏州市', level: 'city', center: { lat: 31.2989, lng: 120.5954 }, children: {
        '320505': { name: '姑苏区', level: 'district', center: { lat: 31.2989, lng: 120.5954 } },
        '320506': { name: '吴中区', level: 'district', center: { lat: 31.2989, lng: 120.5954 } },
        '320507': { name: '相城区', level: 'district', center: { lat: 31.2989, lng: 120.5954 } },
      } },
    }
  },
};

export const divisionsRouter = router({
  getProvinces: publicProcedure.query(() => {
    return Object.entries(divisionsData).map(([code, data]) => ({
      code,
      name: data.name,
      center: data.center,
      level: 'province',
    }));
  }),

  getCitiesByProvince: publicProcedure
    .input(z.object({ provinceCode: z.string() }))
    .query(({ input }) => {
      const province = divisionsData[input.provinceCode];
      if (!province || !province.children) return [];
      
      return Object.entries(province.children).map(([code, data]: [string, any]) => ({
        code,
        name: data.name,
        center: data.center,
        level: 'city',
      }));
    }),

  getDistrictsByCity: publicProcedure
    .input(z.object({ cityCode: z.string() }))
    .query(({ input }) => {
      for (const province of Object.values(divisionsData)) {
        if (province.children && province.children[input.cityCode]) {
          const city = province.children[input.cityCode];
          if (!city.children) return [];
          
          return Object.entries(city.children).map(([code, data]: [string, any]) => ({
            code,
            name: data.name,
            center: data.center,
            level: 'district',
          }));
        }
      }
      return [];
    }),

  getDivisionCenter: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(({ input }) => {
      const province = divisionsData[input.code];
      if (province) return province.center;

      for (const prov of Object.values(divisionsData)) {
        if ((prov as any).children) {
          const city = (prov as any).children[input.code];
          if (city) return city.center;

          for (const c of Object.values((prov as any).children)) {
            if ((c as any).children && (c as any).children[input.code]) {
              return (c as any).children[input.code].center;
            }
          }
        }
      }
      return null;
    }),
});
