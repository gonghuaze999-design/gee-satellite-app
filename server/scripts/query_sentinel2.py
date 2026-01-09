#!/usr/bin/env python3
"""
查询Sentinel-2卫星影像
从Google Earth Engine查询指定区域和时间范围内的Sentinel-2影像
返回所有满足条件的数据（不限制数量）
"""

import sys
import json
import os
import base64
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
        Sentinel-2影像列表（包含所有满足条件的数据）
    """
    try:
        import ee
        
        # 初始化GEE
        try:
            ee.Initialize()
        except Exception as init_error:
            # 如果初始化失败，尝试使用默认凭证
            print(f"Warning: GEE initialization failed: {init_error}", file=sys.stderr)
            pass
        
        # 创建几何体
        if isinstance(geometry, dict):
            if geometry.get('type') == 'Polygon':
                coords = geometry['coordinates'][0]
                geom = ee.Geometry.Polygon(coords)
            elif geometry.get('type') == 'Point':
                coords = geometry['coordinates']
                # 为点创建一个小的缓冲区（500米）
                geom = ee.Geometry.Point(coords).buffer(500)
            else:
                # 默认使用矩形
                geom = ee.Geometry.Rectangle(geometry.get('coordinates', [100, 25, 120, 35]))
        else:
            # 默认使用浙江省范围
            geom = ee.Geometry.Rectangle([118.0, 27.0, 123.0, 34.8])
        
        # 查询Sentinel-2数据 - 返回所有满足条件的影像
        sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
            .filterBounds(geom) \
            .filterDate(start_date, end_date) \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', max_cloud_cover)) \
            .sort('system:time_start')
        
        # 获取影像总数
        size = sentinel2.size().getInfo()
        print(f"Found {size} images matching criteria", file=sys.stderr)
        
        # 获取所有影像列表（不限制数量）
        image_list = sentinel2.toList(sentinel2.size()).getInfo()
        
        # 处理结果
        results = []
        for i, image_info in enumerate(image_list):
            try:
                properties = image_info.get('properties', {})
                
                # 提取关键信息
                timestamp = properties.get('system:time_start', 0)
                date_str = datetime.fromtimestamp(timestamp / 1000).strftime('%Y-%m-%d')
                
                cloud_cover = properties.get('CLOUDY_PIXEL_PERCENTAGE', 0)
                quality = 100 - cloud_cover
                
                # 确定传感器
                product_id = properties.get('PRODUCT_ID', '')
                sensor = 'Sentinel-2A' if 'S2A' in product_id else 'Sentinel-2B'
                
                # 生成缩略图URL（使用GEE的缩略图服务）
                image_id = image_info.get('id', '')
                thumbnail_url = None
                try:
                    # 尝试生成缩略图
                    image = ee.Image(image_id)
                    # 使用RGB波段生成缩略图
                    thumb_params = {
                        'min': 0,
                        'max': 3000,
                        'bands': ['B4', 'B3', 'B2'],  # Red, Green, Blue
                        'width': 100,
                        'height': 100,
                    }
                    thumbnail_url = image.getThumbURL(thumb_params)
                except Exception as thumb_error:
                    print(f"Warning: Could not generate thumbnail for {image_id}: {thumb_error}", file=sys.stderr)
                    # 生成占位符缩略图
                    hue = (quality / 100) * 120  # 从红色(0°)到绿色(120°)
                    thumbnail_url = f"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='hsl({hue},100%25,50%25)'/%3E%3C/svg%3E"
                
                results.append({
                    'id': image_id or f'S2_{date_str}_{i:03d}',
                    'date': date_str,
                    'cloudCover': round(cloud_cover, 2),
                    'quality': round(quality, 2),
                    'sensor': sensor,
                    'resolution': 10,
                    'ndvi': None,
                    'thumbnail': thumbnail_url,
                })
            except Exception as e:
                print(f"Warning: Error processing image {i}: {e}", file=sys.stderr)
                continue
        
        print(f"Successfully processed {len(results)} images", file=sys.stderr)
        return results
    
    except ImportError as ie:
        print(f"Error: earthengine-api not installed: {ie}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Error querying Sentinel-2: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return []

if __name__ == '__main__':
    try:
        # 从命令行参数读取输入
        args = json.loads(sys.argv[1])
        
        geometry = args.get('geometry', {})
        start_date = args.get('startDate', '2024-01-01')
        end_date = args.get('endDate', '2024-12-31')
        max_cloud_cover = args.get('maxCloudCover', 30)
        
        print(f"Query parameters: startDate={start_date}, endDate={end_date}, maxCloudCover={max_cloud_cover}", file=sys.stderr)
        
        # 查询数据
        results = query_sentinel2(geometry, start_date, end_date, max_cloud_cover)
        
        # 输出JSON结果
        print(json.dumps(results))
    
    except Exception as e:
        print(f"Fatal error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
