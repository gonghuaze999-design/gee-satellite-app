#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.AMAP_API_KEY;
if (!API_KEY) {
  console.error('AMAP_API_KEY environment variable not set');
  process.exit(1);
}

const BASE_URL = 'https://restapi.amap.com/v3/config/district';

// 存储所有数据
const allData = [];

// 延迟函数，避免API速率限制
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 获取行政区划数据
async function fetchDistrict(adcode, name, level) {
  try {
    const url = `${BASE_URL}?key=${API_KEY}&keywords=${encodeURIComponent(name)}&subdistrict=1&extensions=base`;
    
    console.log(`正在获取: ${name} (${adcode})`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== '1') {
      console.error(`API错误: ${data.info}`);
      return;
    }
    
    if (!data.districts || data.districts.length === 0) {
      return;
    }
    
    const district = data.districts[0];
    
    // 保存当前地区
    const record = {
      name: district.name,
      adcode: district.adcode,
      level: level,
      center: district.center,
      lat: parseFloat(district.center.split(',')[1]),
      lng: parseFloat(district.center.split(',')[0]),
    };
    
    allData.push(record);
    console.log(`  ✓ ${district.name} - ${district.adcode} - ${district.center}`);
    
    // 如果有下级地区，递归获取
    if (district.districts && district.districts.length > 0) {
      for (const subDistrict of district.districts) {
        await delay(200); // 延迟200ms避免速率限制
        await fetchDistrict(subDistrict.adcode, subDistrict.name, getNextLevel(level));
      }
    }
  } catch (error) {
    console.error(`获取 ${name} 时出错:`, error.message);
  }
}

// 获取下一级别
function getNextLevel(currentLevel) {
  const levels = ['province', 'city', 'district', 'street'];
  const index = levels.indexOf(currentLevel);
  return index >= 0 && index < levels.length - 1 ? levels[index + 1] : 'unknown';
}

// 主函数
async function main() {
  console.log('开始从高德API获取辽宁省完整数据...\n');
  
  const startTime = Date.now();
  
  // 获取辽宁省数据
  await fetchDistrict('210000', '辽宁省', 'province');
  
  const endTime = Date.now();
  
  console.log(`\n数据获取完成！耗时: ${((endTime - startTime) / 1000).toFixed(2)}秒`);
  console.log(`总记录数: ${allData.length}`);
  
  // 统计数据
  const levelCounts = {};
  for (const record of allData) {
    levelCounts[record.level] = (levelCounts[record.level] || 0) + 1;
  }
  
  console.log('\n按级别统计:');
  for (const [level, count] of Object.entries(levelCounts)) {
    console.log(`  ${level}: ${count}`);
  }
  
  // 保存为JSON
  const jsonPath = path.join(__dirname, '../data/liaoning_admin_data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allData, null, 2), 'utf-8');
  console.log(`\n✅ JSON文件已保存: ${jsonPath}`);
  
  // 生成Markdown文档
  let markdown = `# 辽宁省行政区划数据\n\n`;
  markdown += `**数据来源：** 高德地图API\n`;
  markdown += `**获取时间：** ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n`;
  markdown += `**总记录数：** ${allData.length}\n\n`;
  
  markdown += `## 数据统计\n\n`;
  for (const [level, count] of Object.entries(levelCounts)) {
    markdown += `- **${level}**: ${count} 个\n`;
  }
  
  markdown += `\n## 详细数据\n\n`;
  
  // 按级别分组
  const province = allData.filter(item => item.level === 'province');
  const cities = allData.filter(item => item.level === 'city');
  const districts = allData.filter(item => item.level === 'district');
  
  if (province.length > 0) {
    markdown += `### 省级\n\n`;
    markdown += `| 名称 | 行政区代码 | 经度 | 纬度 |\n`;
    markdown += `|------|-----------|------|------|\n`;
    for (const item of province) {
      markdown += `| ${item.name} | ${item.adcode} | ${item.lng.toFixed(6)} | ${item.lat.toFixed(6)} |\n`;
    }
    markdown += `\n`;
  }
  
  if (cities.length > 0) {
    markdown += `### 城市（地级市）\n\n`;
    markdown += `| 名称 | 行政区代码 | 经度 | 纬度 |\n`;
    markdown += `|------|-----------|------|------|\n`;
    for (const item of cities) {
      markdown += `| ${item.name} | ${item.adcode} | ${item.lng.toFixed(6)} | ${item.lat.toFixed(6)} |\n`;
    }
    markdown += `\n`;
  }
  
  if (districts.length > 0) {
    markdown += `### 县级行政区\n\n`;
    markdown += `| 名称 | 行政区代码 | 经度 | 纬度 |\n`;
    markdown += `|------|-----------|------|------|\n`;
    for (const item of districts) {
      markdown += `| ${item.name} | ${item.adcode} | ${item.lng.toFixed(6)} | ${item.lat.toFixed(6)} |\n`;
    }
    markdown += `\n`;
  }
  
  const mdPath = path.join(__dirname, '../data/liaoning_admin_data.md');
  fs.writeFileSync(mdPath, markdown, 'utf-8');
  console.log(`✅ Markdown文档已保存: ${mdPath}`);
}

main().catch(console.error);
