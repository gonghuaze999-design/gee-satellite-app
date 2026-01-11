import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { queryQueue } from '../services/queryQueue';
import { chinaAdministration } from '../data/chinaAdministration';

function getGeeServiceAccountKey(): string {
  const geeKeyPath = '/tmp/gee_service_account_key.json';
  const globalKey = (global as any).GEE_SERVICE_ACCOUNT_KEY;
  const envKey = process.env.GEE_SERVICE_ACCOUNT_KEY;
  
  if (globalKey) return globalKey;
  if (envKey) return envKey;
  
  try {
    if (fs.existsSync(geeKeyPath)) {
      return fs.readFileSync(geeKeyPath, 'utf-8');
    }
  } catch (e) {
    console.error('[GEE] Failed to read GEE key from file:', e);
  }
  
  return '';
}

function executePythonScript(scriptName: string, args: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'server', 'scripts', scriptName);
    const env = {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      GEE_SERVICE_ACCOUNT_KEY: getGeeServiceAccountKey(),
    };
    const python = spawn('/usr/bin/python3.11', [scriptPath, JSON.stringify(args)], { env, stdio: ['pipe', 'pipe', 'pipe'] });
    
    let stdout = '';
    let stderr = '';
    let resolved = false;
    
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        python.kill();
        reject(new Error('Python script execution timeout'));
      }
    }, 5 * 60 * 1000);
    
    python.stdout.on('data', (data) => { stdout += data.toString(); });
    python.stderr.on('data', (data) => { stderr += data.toString(); });
    
    python.on('close', (code: number | null) => {
      clearTimeout(timeout);
      if (resolved) return;
      resolved = true;
      
      if (code !== 0) {
        reject(new Error(`Python script execution failed: ${stderr}`));
      } else {
        try {
          const lines = stdout.trim().split('\n');
          // 支持数组格式 [...] 和对象格式 {...}
          const jsonLine = lines.find(line => line.startsWith('[') || line.startsWith('{'));
          if (!jsonLine) {
            reject(new Error(`No JSON output found. stdout: ${stdout}, stderr: ${stderr}`));
            return;
          }
          const result = JSON.parse(jsonLine);
          resolve(result);
        } catch (e: any) {
          reject(new Error(`Failed to parse Python output: ${e?.message || e}. stdout: ${stdout}`));
        }
      }
    });
    
    python.on('error', (err) => {
      clearTimeout(timeout);
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });
  });
}

function getGeometryFromAdminDivision(province?: string, city?: string, district?: string): any {
  let targetLat = 39.9042;
  let targetLng = 116.4074;
  
  // 优先使用区县，其次使用城市，最后使用省份
  if (district) {
    const districtData = chinaAdministration.districts.find((d: any) => d.name === district);
    if (districtData && districtData.lat && districtData.lng) {
      targetLat = districtData.lat;
      targetLng = districtData.lng;
    }
  } else if (city) {
    const cityData = chinaAdministration.cities.find((c: any) => c.name === city);
    if (cityData && cityData.lat && cityData.lng) {
      targetLat = cityData.lat;
      targetLng = cityData.lng;
    }
  } else if (province) {
    const provinceData = chinaAdministration.provinces.find((p: any) => p.name === province);
    if (provinceData && provinceData.lat && provinceData.lng) {
      targetLat = provinceData.lat;
      targetLng = provinceData.lng;
    }
  }
  
  // 根据地区级别设置查询范围（单位：度）
  let rangeOffset = 0.15; // 默认范围（约16km）
  if (district) {
    rangeOffset = 0.05; // 区县范围较小
  } else if (city) {
    rangeOffset = 0.1; // 城市范围中等
  } else if (province) {
    rangeOffset = 0.3; // 省份范围较大
  }
  
  return {
    type: 'Rectangle',
    coordinates: [
      [targetLng - rangeOffset, targetLat - rangeOffset],
      [targetLng + rangeOffset, targetLat + rangeOffset]
    ],
  };
}

export const geeRouter = router({
  searchSentinel2: publicProcedure
    .input(z.object({
      geometry: z.any().optional(),
      startDate: z.string(),
      endDate: z.string(),
      maxCloudCover: z.number().default(30),
      province: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const geeKeyJson = getGeeServiceAccountKey();
        console.log('[GEE-QUERY] GEE_SERVICE_ACCOUNT_KEY length:', (geeKeyJson || '').length);
        
        if (!geeKeyJson) {
          throw new Error('GEE service account not configured');
        }

        console.log('[GEE-QUERY] Starting Sentinel-2 query');
        console.log('[GEE-QUERY] Parameters:', { 
          startDate: input.startDate, 
          endDate: input.endDate, 
          maxCloudCover: input.maxCloudCover 
        });

        let geometry = input.geometry || getGeometryFromAdminDivision(input.province, input.city, input.district);

        console.log('[GEE-QUERY] Calling Python script');
        const result = await executePythonScript('query_sentinel2.py', {
          geometry,
          startDate: input.startDate,
          endDate: input.endDate,
          maxCloudCover: input.maxCloudCover,
        });
        
        console.log('[GEE-QUERY] Query completed:', result.length, 'images');
        
        const images = result.map((img: any) => ({
          id: img.id,
          date: img.date,
          utcTime: img.utcTime || img.date,
          cloudCover: img.cloudCover,
          quality: img.quality,
          sensor: img.sensor,
          resolution: img.resolution,
          thumbnail: img.thumbnail,
          ndvi: img.ndvi,
        }));

        return {
          success: true,
          total: images.length,
          images,
          message: `Found ${images.length} Sentinel-2 images`,
        };
      } catch (error: any) {
        console.error('[GEE-QUERY] Query failed:', error.message);
        return {
          success: false,
          total: 0,
          images: [],
          error: error.message || 'Query failed',
        };
      }
    }),

  calculateNDVI: publicProcedure
    .input(z.object({ imageId: z.string(), geometry: z.any().optional() }))
    .query(async ({ input }) => {
      try {
        if (!getGeeServiceAccountKey()) throw new Error('GEE service account not configured');
        const result = await executePythonScript('calculate_ndvi.py', { imageId: input.imageId, geometry: input.geometry });
        return result;
      } catch (error: any) {
        throw error;
      }
    }),

  batchCalculateNDVI: publicProcedure
    .input(z.object({ imageIds: z.array(z.string()), geometry: z.any().optional() }))
    .query(async ({ input }) => {
      try {
        if (!getGeeServiceAccountKey()) throw new Error('GEE service account not configured');
        const result = await executePythonScript('batch_calculate_ndvi.py', { imageIds: input.imageIds, geometry: input.geometry });
        return result;
      } catch (error: any) {
        throw error;
      }
    }),

  exportGeoTIFF: publicProcedure
    .input(z.object({ imageId: z.string(), geometry: z.any(), fileName: z.string(), scale: z.number().default(10) }))
    .mutation(async ({ input }) => {
      try {
        if (!getGeeServiceAccountKey()) throw new Error('GEE service account not configured');
        const result = await executePythonScript('export_geotiff.py', { imageId: input.imageId, geometry: input.geometry, fileName: input.fileName, scale: input.scale });
        return result;
      } catch (error: any) {
        throw error;
      }
    }),

  checkAuth: publicProcedure.query(() => {
    const geeKeyJson = getGeeServiceAccountKey();
    const isConfigured = !!geeKeyJson;
    console.log('[GEE-CHECK-AUTH] GEE_SERVICE_ACCOUNT_KEY length:', (geeKeyJson || '').length);
    return {
      configured: isConfigured,
      mode: isConfigured ? 'REAL_GEE' : 'DEMO_MODE',
      message: isConfigured ? 'GEE service account configured' : 'GEE service account not configured',
    };
  }),

  searchSentinel2Async: publicProcedure
    .input(z.object({
      geometry: z.any().optional(),
      startDate: z.string(),
      endDate: z.string(),
      maxCloudCover: z.number().default(30),
      province: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const taskId = queryQueue.createTask({
        startDate: input.startDate,
        endDate: input.endDate,
        maxCloudCover: input.maxCloudCover,
        geometry: input.geometry,
        province: input.province,
        city: input.city,
        district: input.district,
      });

      setImmediate(async () => {
        try {
          queryQueue.setProcessing(taskId);
          queryQueue.addLog(taskId, 'Starting Sentinel-2 query');

          const geeKeyJson = getGeeServiceAccountKey();
          if (!geeKeyJson) {
            throw new Error('GEE service account not configured');
          }

          let geometry = input.geometry || getGeometryFromAdminDivision(input.province, input.city, input.district);

          queryQueue.addLog(taskId, 'Calling Python script');
          const result = await executePythonScript('query_sentinel2.py', {
            geometry,
            startDate: input.startDate,
            endDate: input.endDate,
            maxCloudCover: input.maxCloudCover,
          });

          queryQueue.addLog(taskId, `Query completed: ${result.length} images found`);
          queryQueue.setProgress(taskId, result.length, result.length, 'Query completed');

          const images = result.map((img: any) => ({
            id: img.id,
            date: img.date,
            utcTime: img.utcTime || img.date,
            cloudCover: img.cloudCover,
            quality: img.quality,
            sensor: img.sensor,
            resolution: img.resolution,
            thumbnail: img.thumbnail,
            ndvi: img.ndvi,
          }));

          queryQueue.setCompleted(taskId, {
            success: true,
            total: images.length,
            images,
            message: `Found ${images.length} Sentinel-2 images`,
          });
        } catch (error: any) {
          queryQueue.addLog(taskId, `Error: ${error.message}`);
          queryQueue.setFailed(taskId, error.message || 'Query failed');
        }
      });

      return {
        taskId,
        message: 'Query task created, processing in background',
      };
    }),

  getQueryStatus: publicProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(({ input }) => {
      const task = queryQueue.getTask(input.taskId);
      if (!task) {
        return {
          status: 'not_found',
          message: 'Task not found',
        };
      }

      return {
        status: task.status,
        progress: task.progress,
        result: task.result,
        error: task.error,
        logs: task.logs,
        estimatedRemainingTime: queryQueue.getEstimatedRemainingTime(input.taskId),
        elapsedTime: Date.now() - task.startTime,
      };
    }),
});
