import { describe, it, expect } from 'vitest';
import { getCitiesByProvince, getDistrictsByCity, getProvinces } from './amapService';

describe('AMAP Service', () => {
  it('should get all provinces', async () => {
    const provinces = await getProvinces();
    expect(Array.isArray(provinces)).toBe(true);
    expect(provinces.length).toBeGreaterThan(0);
    expect(provinces[0]).toHaveProperty('name');
    expect(provinces[0]).toHaveProperty('adcode');
  });

  it('should get cities by province adcode (浙江省)', async () => {
    const cities = await getCitiesByProvince('330000');
    expect(Array.isArray(cities)).toBe(true);
    expect(cities.length).toBeGreaterThan(0);
    expect(cities[0]).toHaveProperty('name');
    expect(cities[0]).toHaveProperty('adcode');
    // 浙江省应该有多个城市
    expect(cities.length).toBeGreaterThanOrEqual(5);
  });

  it('should get districts by city adcode (杭州市)', async () => {
    const districts = await getDistrictsByCity('330100');
    expect(Array.isArray(districts)).toBe(true);
    expect(districts.length).toBeGreaterThan(0);
    expect(districts[0]).toHaveProperty('name');
    expect(districts[0]).toHaveProperty('adcode');
  });

  it('should return empty array for invalid adcode', async () => {
    const cities = await getCitiesByProvince('999999');
    expect(Array.isArray(cities)).toBe(true);
    expect(cities.length).toBe(0);
  });
});
