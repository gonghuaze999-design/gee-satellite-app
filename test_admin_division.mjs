/**
 * 行政区划数据库测试脚本
 */

import {
  getProvinces,
  getCitiesByProvince,
  getDistrictsByCity,
  getRegionByAdcode,
  searchRegions,
} from './server/src/data/chinaAdministration.ts';

console.log('========================================');
console.log('行政区划数据库测试');
console.log('========================================\n');

// 测试1: 获取所有省份
console.log('【测试1】获取所有省份');
const provinces = getProvinces();
console.log(`✅ 成功获取 ${provinces.length} 个省级行政区`);
console.log(`前5个省份: ${provinces.slice(0, 5).map(p => p.name).join(', ')}\n`);

// 测试2: 获取辽宁省的城市
console.log('【测试2】获取辽宁省的城市');
const liaoningCities = getCitiesByProvince('210000');
console.log(`✅ 辽宁省有 ${liaoningCities.length} 个地级市`);
console.log(`城市列表: ${liaoningCities.map(c => c.name).join(', ')}\n`);

// 测试3: 获取沈阳市的区县
console.log('【测试3】获取沈阳市的区县');
const shenyangDistricts = getDistrictsByCity('210100');
console.log(`✅ 沈阳市有 ${shenyangDistricts.length} 个县级行政区`);
console.log(`区县列表: ${shenyangDistricts.map(d => d.name).join(', ')}\n`);

// 测试4: 根据adcode获取行政区信息
console.log('【测试4】根据adcode获取行政区信息');
const region = getRegionByAdcode('210102');
if (region) {
  console.log(`✅ 成功获取行政区信息:`);
  console.log(`   名称: ${region.name}`);
  console.log(`   代码: ${region.adcode}`);
  console.log(`   级别: ${region.level}`);
  console.log(`   坐标: (${region.lng}, ${region.lat})`);
  console.log(`   所属: ${region.provinceName} - ${region.cityName}\n`);
} else {
  console.log(`❌ 未找到行政区\n`);
}

// 测试5: 搜索行政区
console.log('【测试5】搜索"朝阳"');
const searchResults = searchRegions('朝阳');
console.log(`✅ 找到 ${searchResults.length} 个匹配结果`);
searchResults.slice(0, 5).forEach(r => {
  console.log(`   - ${r.name} (${r.adcode}) [${r.level}] ${r.provinceName || ''} ${r.cityName || ''}`);
});
console.log();

// 测试6: 验证数据完整性
console.log('【测试6】验证数据完整性');
const allCities = provinces.flatMap(p => getCitiesByProvince(p.adcode));
const allDistricts = allCities.flatMap(c => getDistrictsByCity(c.adcode));
console.log(`✅ 数据统计:`);
console.log(`   省级: ${provinces.length} 个`);
console.log(`   地级市: ${allCities.length} 个`);
console.log(`   县级: ${allDistricts.length} 个`);
console.log(`   总计: ${provinces.length + allCities.length + allDistricts.length} 条记录\n`);

// 测试7: 验证坐标数据
console.log('【测试7】验证坐标数据');
const provinceWithoutCoords = provinces.filter(p => !p.lng || !p.lat);
const cityWithoutCoords = allCities.filter(c => !c.lng || !c.lat);
const districtWithoutCoords = allDistricts.filter(d => !d.lng || !d.lat);
console.log(`✅ 坐标完整性检查:`);
console.log(`   省级缺失坐标: ${provinceWithoutCoords.length} 个`);
console.log(`   地级市缺失坐标: ${cityWithoutCoords.length} 个`);
console.log(`   县级缺失坐标: ${districtWithoutCoords.length} 个\n`);

console.log('========================================');
console.log('测试完成！');
console.log('========================================');
