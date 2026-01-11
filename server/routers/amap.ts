import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import {
  getProvinces,
  getCitiesByProvince,
  getDistrictsByCity,
  getRegionByAdcode,
} from '../services/amapService';

export const amapRouter = router({
  /**
   * 获取所有省份
   */
  getProvinces: publicProcedure.query(async () => {
    try {
      const provinces = await getProvinces();
      return {
        success: true,
        data: provinces,
      };
    } catch (error) {
      console.error('[tRPC] getProvinces error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }),

  /**
   * 获取指定省份的城市
   */
  getCitiesByProvince: publicProcedure
    .input(z.object({ provinceAdcode: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const cities = await getCitiesByProvince(input.provinceAdcode);
        return {
          success: true,
          data: cities,
        };
      } catch (error) {
        console.error('[tRPC] getCitiesByProvince error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * 获取指定城市的区县
   */
  getDistrictsByCity: publicProcedure
    .input(z.object({ cityAdcode: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const districts = await getDistrictsByCity(input.cityAdcode);
        return {
          success: true,
          data: districts,
        };
      } catch (error) {
        console.error('[tRPC] getDistrictsByCity error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  /**
   * 根据adcode获取地区信息
   */
  getRegionByAdcode: publicProcedure
    .input(z.object({ adcode: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const region = await getRegionByAdcode(input.adcode);
        return {
          success: true,
          data: region,
        };
      } catch (error) {
        console.error('[tRPC] getRegionByAdcode error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),
});
