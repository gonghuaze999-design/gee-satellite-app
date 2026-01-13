/**
 * 行政区划API路由器
 * 提供全国省市县三级行政区划数据查询接口
 */

import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import {
  getProvinces,
  getCitiesByProvince,
  getDistrictsByCity,
  getRegionByAdcode,
  searchRegions,
} from '../src/data/chinaAdministration';

export const adminDivisionRouter = router({
  /**
   * 获取所有省级行政区
   * @returns 34个省级行政区列表
   */
  getProvinces: publicProcedure.query(() => {
    return getProvinces();
  }),

  /**
   * 根据省份代码获取所有地级市
   * @param provinceCode - 省份行政区代码（如：210000）
   * @returns 该省份下的所有地级市列表
   */
  getCitiesByProvince: publicProcedure
    .input(z.object({ provinceCode: z.string() }))
    .query((opts: any) => {
      return getCitiesByProvince(opts.input.provinceCode);
    }),

  /**
   * 根据地级市代码获取所有县级行政区
   * @param cityCode - 地级市行政区代码（如：210100）
   * @returns 该地级市下的所有县级行政区列表
   */
  getDistrictsByCity: publicProcedure
    .input(z.object({ cityCode: z.string() }))
    .query((opts: any) => {
      return getDistrictsByCity(opts.input.cityCode);
    }),

  /**
   * 根据行政区代码获取行政区详细信息
   * @param adcode - 行政区代码
   * @returns 行政区详细信息
   */
  getRegionByAdcode: publicProcedure
    .input(z.object({ adcode: z.string() }))
    .query((opts: any) => {
      const region = getRegionByAdcode(opts.input.adcode);
      if (!region) {
        throw new Error(`未找到行政区代码为 ${opts.input.adcode} 的行政区`);
      }
      return region;
    }),

  /**
   * 搜索行政区（支持模糊匹配名称）
   * @param keyword - 搜索关键词
   * @returns 匹配的行政区列表
   */
  searchRegions: publicProcedure
    .input(z.object({ keyword: z.string() }))
    .query((opts: any) => {
      return searchRegions(opts.input.keyword);
    }),

  /**
   * 获取数据库统计信息
   * @returns 数据库统计信息
   */
  getStatistics: publicProcedure.query(() => {
    const provinces = getProvinces();
    const allRegions = provinces.flatMap(province => [
      ...getCitiesByProvince(province.adcode),
      ...getCitiesByProvince(province.adcode).flatMap(city =>
        getDistrictsByCity(city.adcode)
      ),
    ]);

    return {
      totalProvinces: provinces.length,
      totalCities: allRegions.filter(r => r.level === 'city').length,
      totalDistricts: allRegions.filter(r => r.level === 'district').length,
      totalRegions: provinces.length + allRegions.length,
      dataSource: '全国34个省级单元Word文档',
      lastUpdated: '2026-01-12',
    };
  }),
});
