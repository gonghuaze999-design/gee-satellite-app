import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, exportTasks, ExportTask, InsertExportTask, drawnAreas, InsertDrawnArea, searchFilters, InsertSearchFilter, timeSeriesAnalysis, InsertTimeSeriesAnalysis } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ 导出任务相关函数 ============

export async function createExportTask(task: InsertExportTask): Promise<ExportTask | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create export task: database not available");
    return null;
  }

  try {
    await db.insert(exportTasks).values(task);
    const result = await db.select().from(exportTasks).where(eq(exportTasks.taskId, task.taskId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create export task:", error);
    throw error;
  }
}

export async function getExportTask(taskId: string): Promise<ExportTask | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(exportTasks).where(eq(exportTasks.taskId, taskId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateExportTaskStatus(taskId: string, status: string, progress: number = 0, downloadUrl?: string, errorMessage?: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const updateData: any = { status, progress, updatedAt: new Date() };
  if (downloadUrl) updateData.downloadUrl = downloadUrl;
  if (errorMessage) updateData.errorMessage = errorMessage;
  if (status === 'completed') updateData.completedAt = new Date();

  await db.update(exportTasks).set(updateData).where(eq(exportTasks.taskId, taskId));
}

export async function getUserExportTasks(userId: number): Promise<ExportTask[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(exportTasks).where(eq(exportTasks.userId, userId));
}

// ============ 绘制区域相关函数 ============

export async function createDrawnArea(area: InsertDrawnArea): Promise<any> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(drawnAreas).values(area);
    const result = await db.select().from(drawnAreas).orderBy(drawnAreas.id).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create drawn area:", error);
    throw error;
  }
}

export async function getUserDrawnAreas(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(drawnAreas).where(eq(drawnAreas.userId, userId));
}

export async function updateDrawnArea(areaId: number, updates: any): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(drawnAreas).set({ ...updates, updatedAt: new Date() }).where(eq(drawnAreas.id, areaId));
}

export async function deleteDrawnArea(areaId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(drawnAreas).where(eq(drawnAreas.id, areaId));
}

// ============ 搜索过滤相关函数 ============

export async function createSearchFilter(filter: InsertSearchFilter): Promise<any> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(searchFilters).values(filter);
    const result = await db.select().from(searchFilters).orderBy(searchFilters.id).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create search filter:", error);
    throw error;
  }
}

export async function getUserSearchFilters(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(searchFilters).where(eq(searchFilters.userId, userId));
}

export async function updateSearchFilter(filterId: number, updates: any): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(searchFilters).set({ ...updates, updatedAt: new Date() }).where(eq(searchFilters.id, filterId));
}

export async function deleteSearchFilter(filterId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(searchFilters).where(eq(searchFilters.id, filterId));
}

// ============ 时间序列分析相关函数 ============

export async function createTimeSeriesAnalysis(analysis: InsertTimeSeriesAnalysis): Promise<any> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(timeSeriesAnalysis).values(analysis);
    const result = await db.select().from(timeSeriesAnalysis).orderBy(timeSeriesAnalysis.id).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create time series analysis:", error);
    throw error;
  }
}

export async function getUserTimeSeriesAnalysis(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(timeSeriesAnalysis).where(eq(timeSeriesAnalysis.userId, userId));
}

export async function updateTimeSeriesAnalysis(analysisId: number, updates: any): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(timeSeriesAnalysis).set({ ...updates, updatedAt: new Date() }).where(eq(timeSeriesAnalysis.id, analysisId));
}

export async function deleteTimeSeriesAnalysis(analysisId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(timeSeriesAnalysis).where(eq(timeSeriesAnalysis.id, analysisId));
}
