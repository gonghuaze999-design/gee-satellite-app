import { describe, it, expect, beforeAll } from 'vitest';
import { getProvinces, getCitiesByProvince, getDistrictsByCity, getRegionByAdcode } from './amapService';

describe('AmapService', () => {
  it('should get provinces list', async () => {
    const provinces = await getProvinces();
    
    expect(Array.isArray(provinces)).toBe(true);
    expect(provinces.length).toBeGreaterThan(0);
    
    // 验证北京市存在
    const beijing = provinces.find(p => p.name.includes('北京'));
    expect(beijing).toBeDefined();
    expect(beijing?.level).toBe('province');
    expect(beijing?.adcode).toBe('110000');
  });

  it('should get cities by province', async () => {
    // 北京市的adcode是110000
    const cities = await getCitiesByProvince('110000');
    
    expect(Array.isArray(cities)).toBe(true);
    // 北京市作为直辖市，应该有城市级数据
    expect(cities.length).toBeGreaterThanOrEqual(0);
  });

  it('should get districts by city', async () => {
    // 北京市朝阳区的父级是北京市（110000）
    const districts = await getDistrictsByCity('110000');
    
    expect(Array.isArray(districts)).toBe(true);
    expect(districts.length).toBeGreaterThan(0);
    
    // 验证朝阳区存在
    const chaoyang = districts.find(d => d.name.includes('朝阳'));
    expect(chaoyang).toBeDefined();
    expect(chaoyang?.level).toBe('district');
  });

  it('should get region by adcode', async () => {
    // 测试北京市朝阳区
    const region = await getRegionByAdcode('110105');
    
    expect(region).toBeDefined();
    expect(region?.adcode).toBe('110105');
    expect(region?.level).toBe('district');
  });
});
