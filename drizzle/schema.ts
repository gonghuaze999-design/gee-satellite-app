import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 导出任务表
 * 存储用户的卫星影像导出任务信息
 */
export const exportTasks = mysqlTable("export_tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  taskId: varchar("taskId", { length: 128 }).notNull().unique(), // GEE任务ID
  imageId: varchar("imageId", { length: 256 }).notNull(), // Sentinel-2影像ID
  taskName: varchar("taskName", { length: 256 }).notNull(),
  status: mysqlEnum("status", ["pending", "running", "completed", "failed"]).default("pending").notNull(),
  format: mysqlEnum("format", ["GeoTIFF", "COG", "JPEG", "PNG"]).default("GeoTIFF").notNull(),
  progress: int("progress").default(0), // 0-100
  downloadUrl: text("downloadUrl"), // 下载链接
  errorMessage: text("errorMessage"), // 错误信息
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type ExportTask = typeof exportTasks.$inferSelect;
export type InsertExportTask = typeof exportTasks.$inferInsert;

/**
 * 绘制区域表
 * 存储用户绘制的地理区域
 */
export const drawnAreas = mysqlTable("drawn_areas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  areaName: varchar("areaName", { length: 256 }).notNull(),
  areaType: mysqlEnum("areaType", ["polygon", "rectangle", "circle"]).notNull(),
  geometry: json("geometry").notNull(), // GeoJSON格式的几何数据
  bounds: json("bounds"), // 边界框
  description: text("description"),
  isFavorite: int("isFavorite").default(0), // 0: 否, 1: 是
  usageCount: int("usageCount").default(0), // 使用次数
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DrawnArea = typeof drawnAreas.$inferSelect;
export type InsertDrawnArea = typeof drawnAreas.$inferInsert;

/**
 * 搜索过滤条件表
 * 存储用户保存的搜索过滤方案
 */
export const searchFilters = mysqlTable("search_filters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  filterName: varchar("filterName", { length: 256 }).notNull(),
  cloudCoverMax: decimal("cloudCoverMax", { precision: 5, scale: 2 }).default("30"), // 最大云量百分比
  sensorType: varchar("sensorType", { length: 64 }), // 传感器类型
  qualityMin: int("qualityMin").default(0), // 最低质量评分
  ndviMin: decimal("ndviMin", { precision: 4, scale: 3 }), // 最低NDVI值
  ndviMax: decimal("ndviMax", { precision: 4, scale: 3 }), // 最高NDVI值
  description: text("description"),
  isDefault: int("isDefault").default(0), // 0: 否, 1: 是
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SearchFilter = typeof searchFilters.$inferSelect;
export type InsertSearchFilter = typeof searchFilters.$inferInsert;

/**
 * 时间序列分析表
 * 存储用户的时间序列分析任务
 */
export const timeSeriesAnalysis = mysqlTable("time_series_analysis", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  analysisName: varchar("analysisName", { length: 256 }).notNull(),
  areaId: int("areaId"), // 关联的绘制区域
  geometry: json("geometry").notNull(), // 分析区域的几何数据
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  timeStep: mysqlEnum("timeStep", ["daily", "weekly", "monthly", "seasonal"]).default("monthly").notNull(),
  analysisType: mysqlEnum("analysisType", ["ndvi", "ndwi", "nbr", "custom"]).default("ndvi").notNull(),
  imageCount: int("imageCount").default(0), // 包含的影像数量
  resultUrl: text("resultUrl"), // 分析结果URL
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type TimeSeriesAnalysis = typeof timeSeriesAnalysis.$inferSelect;
export type InsertTimeSeriesAnalysis = typeof timeSeriesAnalysis.$inferInsert;
