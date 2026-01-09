#!/usr/bin/env python3
"""
查询Sentinel-2卫星影像
从Google Earth Engine查询指定区域和时间范围内的Sentinel-2影像
"""

import sys
import json
import os
from datetime import datetime

def query_sentinel2(geometry, start_date, end_date, max_cloud_cover):
    """
    查询Sentinel-2卫星影像
    
    Args:
        geometry: GeoJSON geometry对象
        start_date: 开始日期 (YYYY-MM-DD)
        end_date: 结束日期 (YYYY-MM-DD)
        max_cloud_cover: 最大云遮盖百分比
    
    Returns:
        Sentinel-2影像列表
    """
    try:
        import ee
        
        # 初始化GEE
        try:
            ee.Initialize()
        except:
            # 如果已初始化，忽略错误
            pass
        
        # 创建几何体
        if geometry.get('type') == 'Polygon':
            coords = geometry['coordinates'][0]
            geom = ee.Geometry.Polygon(coords)
        elif geometry.get('type') == 'Point':
            coords = geometry['coordinates']
            geom = ee.Geometry.Point(coords)
        else:
            # 默认使用矩形
            geom = ee.Geometry.Rectangle(geometry.get('coordinates', [100, 25, 120, 35]))
        
        # 查询Sentinel-2数据
        sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
            .filterBounds(geom) \
            .filterDate(start_date, end_date) \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', max_cloud_cover)) \
            .sort('system:time_start')
        
        # 获取影像列表
        image_list = sentinel2.toList(sentinel2.size()).getInfo()
        
        # 处理结果
        results = []
        for i, image_info in enumerate(image_list[:20]):  # 最多返回20张
            try:
                properties = image_info.get('properties', {})
                
                # 提取关键信息
                timestamp = properties.get('system:time_start', 0)
                date_str = datetime.fromtimestamp(timestamp / 1000).strftime('%Y-%m-%d')
                
                cloud_cover = properties.get('CLOUDY_PIXEL_PERCENTAGE', 0)
                
                # 确定传感器
                product_id = properties.get('PRODUCT_ID', '')
                sensor = 'Sentinel-2A' if 'S2A' in product_id else 'Sentinel-2B'
                
                results.append({
                    'id': image_info.get('id', f'S2_{date_str}_{i:03d}'),
                    'date': date_str,
                    'cloudCover': round(cloud_cover, 2),
                    'quality': round(100 - cloud_cover, 2),
                    'sensor': sensor,
                    'resolution': 10,
                    'ndvi': None,
                })
            except Exception as e:
                print(f"Error processing image {i}: {e}", file=sys.stderr)
                continue
        
        return results
    
    except ImportError:
        print("Error: earthengine-api not installed", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Error querying Sentinel-2: {e}", file=sys.stderr)
        return []

if __name__ == '__main__':
    try:
        # 从命令行参数读取输入
        args = json.loads(sys.argv[1])
        
        geometry = args.get('geometry', {})
        start_date = args.get('startDate', '2024-01-01')
        end_date = args.get('endDate', '2024-12-31')
        max_cloud_cover = args.get('maxCloudCover', 30)
        
        # 查询数据
        results = query_sentinel2(geometry, start_date, end_date, max_cloud_cover)
        
        # 输出JSON结果
        print(json.dumps(results))
    
    except Exception as e:
        print(f"Fatal error: {e}", file=sys.stderr)
        sys.exit(1)
