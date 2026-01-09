import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createExportTask,
  getExportTask,
  updateExportTaskStatus,
  getUserExportTasks,
  createDrawnArea,
  getUserDrawnAreas,
  updateDrawnArea,
  deleteDrawnArea,
  createSearchFilter,
  getUserSearchFilters,
  updateSearchFilter,
  deleteSearchFilter,
  createTimeSeriesAnalysis,
  getUserTimeSeriesAnalysis,
  updateTimeSeriesAnalysis,
  deleteTimeSeriesAnalysis,
} from "../db";

export const exportRouter = router({
  // ============ 导出任务管理 ============
  
  /**
   * 创建导出任务
   */
  createExportTask: protectedProcedure
    .input(
      z.object({
        imageId: z.string(),
        taskName: z.string(),
        format: z.enum(["GeoTIFF", "COG", "JPEG", "PNG"]).default("GeoTIFF"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const task = await createExportTask({
        userId: ctx.user.id,
        taskId,
        imageId: input.imageId,
        taskName: input.taskName,
        format: input.format,
        status: "pending",
      });

      return task;
    }),

  /**
   * 获取用户的所有导出任务
   */
  getExportTasks: protectedProcedure.query(async ({ ctx }) => {
    return await getUserExportTasks(ctx.user.id);
  }),

  /**
   * 获取单个导出任务详情
   */
  getExportTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ input }) => {
      return await getExportTask(input.taskId);
    }),

  /**
   * 更新导出任务状态
   */
  updateExportTaskStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        status: z.enum(["pending", "running", "completed", "failed"]),
        progress: z.number().min(0).max(100).optional(),
        downloadUrl: z.string().optional(),
        errorMessage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await updateExportTaskStatus(
        input.taskId,
        input.status,
        input.progress,
        input.downloadUrl,
        input.errorMessage
      );
      return { success: true };
    }),

  // ============ 绘制区域管理 ============

  /**
   * 保存绘制的区域
   */
  saveDrawnArea: protectedProcedure
    .input(
      z.object({
        areaName: z.string(),
        areaType: z.enum(["polygon", "rectangle", "circle"]),
        geometry: z.any(),
        bounds: z.any().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const area = await createDrawnArea({
        userId: ctx.user.id,
        areaName: input.areaName,
        areaType: input.areaType,
        geometry: input.geometry,
        bounds: input.bounds,
        description: input.description,
      });

      return area;
    }),

  /**
   * 获取用户保存的所有区域
   */
  getDrawnAreas: protectedProcedure.query(async ({ ctx }) => {
    return await getUserDrawnAreas(ctx.user.id);
  }),

  /**
   * 更新绘制区域
   */
  updateDrawnArea: protectedProcedure
    .input(
      z.object({
        areaId: z.number(),
        areaName: z.string().optional(),
        description: z.string().optional(),
        isFavorite: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await updateDrawnArea(input.areaId, {
        areaName: input.areaName,
        description: input.description,
        isFavorite: input.isFavorite,
      });
      return { success: true };
    }),

  /**
   * 删除绘制区域
   */
  deleteDrawnArea: protectedProcedure
    .input(z.object({ areaId: z.number() }))
    .mutation(async ({ input }) => {
      await deleteDrawnArea(input.areaId);
      return { success: true };
    }),

  // ============ 搜索过滤管理 ============

  /**
   * 保存搜索过滤条件
   */
  saveSearchFilter: protectedProcedure
    .input(
      z.object({
        filterName: z.string(),
        cloudCoverMax: z.string().default("30"),
        sensorType: z.string().optional(),
        qualityMin: z.number().default(0),
        ndviMin: z.string().optional(),
        ndviMax: z.string().optional(),
        description: z.string().optional(),
        isDefault: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const filter = await createSearchFilter({
        userId: ctx.user.id,
        filterName: input.filterName,
        cloudCoverMax: input.cloudCoverMax,
        sensorType: input.sensorType,
        qualityMin: input.qualityMin,
        ndviMin: input.ndviMin,
        ndviMax: input.ndviMax,
        description: input.description,
        isDefault: input.isDefault,
      });

      return filter;
    }),

  /**
   * 获取用户的所有搜索过滤条件
   */
  getSearchFilters: protectedProcedure.query(async ({ ctx }) => {
    return await getUserSearchFilters(ctx.user.id);
  }),

  /**
   * 更新搜索过滤条件
   */
  updateSearchFilter: protectedProcedure
    .input(
      z.object({
        filterId: z.number(),
        filterName: z.string().optional(),
        cloudCoverMax: z.string().optional(),
        sensorType: z.string().optional(),
        qualityMin: z.number().optional(),
        ndviMin: z.string().optional(),
        ndviMax: z.string().optional(),
        description: z.string().optional(),
        isDefault: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await updateSearchFilter(input.filterId, {
        filterName: input.filterName,
        cloudCoverMax: input.cloudCoverMax,
        sensorType: input.sensorType,
        qualityMin: input.qualityMin,
        ndviMin: input.ndviMin,
        ndviMax: input.ndviMax,
        description: input.description,
        isDefault: input.isDefault,
      });
      return { success: true };
    }),

  /**
   * 删除搜索过滤条件
   */
  deleteSearchFilter: protectedProcedure
    .input(z.object({ filterId: z.number() }))
    .mutation(async ({ input }) => {
      await deleteSearchFilter(input.filterId);
      return { success: true };
    }),

  // ============ 时间序列分析管理 ============

  /**
   * 创建时间序列分析任务
   */
  createTimeSeriesAnalysis: protectedProcedure
    .input(
      z.object({
        analysisName: z.string(),
        areaId: z.number().optional(),
        geometry: z.any(),
        startDate: z.date(),
        endDate: z.date(),
        timeStep: z.enum(["daily", "weekly", "monthly", "seasonal"]).default("monthly"),
        analysisType: z.enum(["ndvi", "ndwi", "nbr", "custom"]).default("ndvi"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const analysis = await createTimeSeriesAnalysis({
        userId: ctx.user.id,
        analysisName: input.analysisName,
        areaId: input.areaId,
        geometry: input.geometry,
        startDate: input.startDate,
        endDate: input.endDate,
        timeStep: input.timeStep,
        analysisType: input.analysisType,
        status: "pending",
      });

      return analysis;
    }),

  /**
   * 获取用户的所有时间序列分析
   */
  getTimeSeriesAnalysis: protectedProcedure.query(async ({ ctx }) => {
    return await getUserTimeSeriesAnalysis(ctx.user.id);
  }),

  /**
   * 更新时间序列分析状态
   */
  updateTimeSeriesAnalysis: protectedProcedure
    .input(
      z.object({
        analysisId: z.number(),
        status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
        imageCount: z.number().optional(),
        resultUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await updateTimeSeriesAnalysis(input.analysisId, {
        status: input.status,
        imageCount: input.imageCount,
        resultUrl: input.resultUrl,
        completedAt: input.status === "completed" ? new Date() : undefined,
      });
      return { success: true };
    }),

  /**
   * 删除时间序列分析
   */
  deleteTimeSeriesAnalysis: protectedProcedure
    .input(z.object({ analysisId: z.number() }))
    .mutation(async ({ input }) => {
      await deleteTimeSeriesAnalysis(input.analysisId);
      return { success: true };
    }),
});
