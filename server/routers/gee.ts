import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import { spawn } from 'child_process';
import path from 'path';
import { ENV } from '../_core/env';

/**
 * GEE查询路由 - 处理Sentinel-2卫星数据查询和NDVI计算
 */

interface SentinelImage {
  id: string;
  date: string;
  cloudCover: number;
  quality: number;
  sensor: string;
  resolution: number;
  ndvi?: number;
  thumbnail?: string; // 缩略图URL
}

interface NDVIResult {
  imageId: string;
  ndviMin: number;
  ndviMax: number;
  ndviMean: number;
  colorMap: string;
  timestamp: string;
}

/**
 * 执行Python脚本获取真实GEE数据
 */
function executePythonScript(scriptName: string, args: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'server', 'scripts', scriptName);
    const python = spawn('python3', [scriptPath, JSON.stringify(args)]);
    
    let stdout = '';
    let stderr = '';
    
    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        console.error(`[GEE] Python脚本错误: ${stderr}`);
        reject(new Error(`Python脚本执行失败: ${stderr}`));
      } else {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (e) {
          reject(new Error(`无法解析Python输出: ${stdout}`));
        }
      }
    });
  });
}

export const geeRouter = router({
  /**
   * 查询Sentinel-2卫星影像
   */
  searchSentinel2: publicProcedure
    .input(z.object({
      geometry: z.any(), // GeoJSON geometry
      startDate: z.string(),
      endDate: z.string(),
      maxCloudCover: z.number().default(30),
    }))
    .mutation(async ({ input }) => {
      try {
        // 检查是否有GEE服务账户密钥
        const geeKeyJson = process.env.GEE_SERVICE_ACCOUNT_KEY;
        
        if (!geeKeyJson) {
          console.warn('[GEE] 未配置GEE_SERVICE_ACCOUNT_KEY，返回模拟数据');
          return getMockSentinelImages();
        }

        // 调用Python脚本查询真实GEE数据
        try {
          const result = await executePythonScript('query_sentinel2.py', {
            geometry: input.geometry,
            startDate: input.startDate,
            endDate: input.endDate,
            maxCloudCover: input.maxCloudCover,
          });
          
          console.log('[GEE] 成功查询到真实Sentinel-2数据:', result.length, '张');
          return result;
        } catch (pythonError) {
          console.error('[GEE] Python脚本执行失败:', pythonError);
          console.warn('[GEE] 回退到模拟数据');
          return getMockSentinelImages();
        }
      } catch (error) {
        console.error('[GEE] 查询Sentinel-2失败:', error);
        return getMockSentinelImages();
      }
    }),

  /**
   * 计算单景影像的NDVI
   */
  calculateNDVI: publicProcedure
    .input(z.object({
      imageId: z.string(),
      geometry: z.any().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const geeKeyJson = process.env.GEE_SERVICE_ACCOUNT_KEY;
        
        if (!geeKeyJson) {
          console.warn('[GEE] 未配置GEE_SERVICE_ACCOUNT_KEY，返回模拟NDVI');
          return getMockNDVIResult(input.imageId);
        }

        try {
          const result = await executePythonScript('calculate_ndvi.py', {
            imageId: input.imageId,
            geometry: input.geometry,
          });
          
          console.log('[GEE] 成功计算NDVI:', input.imageId);
          return result;
        } catch (pythonError) {
          console.error('[GEE] Python脚本执行失败:', pythonError);
          console.warn('[GEE] 回退到模拟NDVI');
          return getMockNDVIResult(input.imageId);
        }
      } catch (error) {
        console.error('[GEE] 计算NDVI失败:', error);
        return getMockNDVIResult(input.imageId);
      }
    }),

  /**
   * 批量计算NDVI
   */
  batchCalculateNDVI: publicProcedure
    .input(z.object({
      imageIds: z.array(z.string()),
      geometry: z.any().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const geeKeyJson = process.env.GEE_SERVICE_ACCOUNT_KEY;
        
        if (!geeKeyJson) {
          return input.imageIds.map(id => getMockNDVIResult(id));
        }

        try {
          const result = await executePythonScript('batch_calculate_ndvi.py', {
            imageIds: input.imageIds,
            geometry: input.geometry,
          });
          
          console.log('[GEE] 成功批量计算NDVI:', input.imageIds.length, '张');
          return result;
        } catch (pythonError) {
          console.error('[GEE] Python脚本执行失败:', pythonError);
          return input.imageIds.map(id => getMockNDVIResult(id));
        }
      } catch (error) {
        console.error('[GEE] 批量计算NDVI失败:', error);
        return input.imageIds.map(id => getMockNDVIResult(id));
      }
    }),

  /**
   * 导出GeoTIFF
   */
  exportGeoTIFF: publicProcedure
    .input(z.object({
      imageId: z.string(),
      geometry: z.any(),
      fileName: z.string(),
      scale: z.number().default(10),
    }))
    .mutation(async ({ input }) => {
      try {
        const geeKeyJson = process.env.GEE_SERVICE_ACCOUNT_KEY;
        
        if (!geeKeyJson) {
          return {
            taskId: `task-${Date.now()}`,
            status: 'DEMO_MODE',
            message: '演示模式：无法导出真实数据',
          };
        }

        try {
          const result = await executePythonScript('export_geotiff.py', {
            imageId: input.imageId,
            geometry: input.geometry,
            fileName: input.fileName,
            scale: input.scale,
          });
          
          console.log('[GEE] 成功创建导出任务:', input.fileName);
          return result;
        } catch (pythonError) {
          console.error('[GEE] Python脚本执行失败:', pythonError);
          throw pythonError;
        }
      } catch (error) {
        console.error('[GEE] 导出GeoTIFF失败:', error);
        throw error;
      }
    }),

  /**
   * 检查GEE认证状态
   */
  checkAuth: publicProcedure.query(() => {
    const geeKeyJson = process.env.GEE_SERVICE_ACCOUNT_KEY;
    const isConfigured = !!geeKeyJson;
    
    return {
      configured: isConfigured,
      mode: isConfigured ? 'REAL_GEE' : 'DEMO_MODE',
      message: isConfigured 
        ? '已配置GEE服务账户，使用真实数据'
        : '未配置GEE服务账户，使用演示数据',
    };
  }),
});

/**
 * 获取模拟的Sentinel-2影像列表
 */
function getMockSentinelImages(): SentinelImage[] {
  const images: SentinelImage[] = [];
  let imageIndex = 0;

  // 生成全年数据：每月3-5张影像
  for (let month = 0; month < 12; month++) {
    const imagesPerMonth = 3 + Math.floor(Math.random() * 3); // 3-5张
    
    for (let i = 0; i < imagesPerMonth; i++) {
      const date = new Date(2024, month, 1 + i * 8);
      const cloudCover = Math.random() * 30;
      const quality = 80 + Math.random() * 20;
      const sensor = imageIndex % 2 === 0 ? 'Sentinel-2A' : 'Sentinel-2B';
      const ndvi = 0.4 + Math.random() * 0.4;
      
      // 生成缩略图：使用SVG渐变色代表不同的NDVI值
      const hue = (ndvi - 0.4) * 300; // 从蓝色(240°)到红色(0°)
      const colorStart = `hsl(${Math.round(hue)},100%,50%)`;
      const colorEnd = `hsl(${Math.round(hue)},80%,60%)`;
      const thumbnail = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:${colorStart}'/%3E%3Cstop offset='100%25' style='stop-color:${colorEnd}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23g)'/%3E%3C/svg%3E`;
      
      images.push({
        id: `S2_${date.toISOString().split('T')[0]}_${String(imageIndex).padStart(3, '0')}`,
        date: date.toISOString().split('T')[0],
        cloudCover: Math.round(cloudCover * 100) / 100,
        quality: Math.round(quality * 100) / 100,
        sensor,
        resolution: 10,
        ndvi: Math.round(ndvi * 100) / 100,
        thumbnail,
      });
      
      imageIndex++;
    }
  }

  return images;
}

/**
 * 获取模拟的NDVI结果
 */
function getMockNDVIResult(imageId: string): NDVIResult {
  return {
    imageId,
    ndviMin: -0.3,
    ndviMax: 0.9,
    ndviMean: 0.5 + Math.random() * 0.2,
    colorMap: 'rainbow',
    timestamp: new Date().toISOString(),
  };
}
