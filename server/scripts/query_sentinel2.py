#!/usr/bin/env python3
"""
查询Sentinel-2卫星影像
从Google Earth Engine查询指定区域和时间范围内的Sentinel-2影像
"""

import sys
import json
import os
import tempfile
from datetime import datetime

def query_sentinel2(geometry, start_date, end_date, max_cloud_cover):
    """
    查询Sentinel-2卫星影像
    """
    try:
        import ee
        
        # 获取GEE服务账户密钥
        gee_key_str = os.environ.get('GEE_SERVICE_ACCOUNT_KEY')
        
        if not gee_key_str:
            raise Exception("GEE_SERVICE_ACCOUNT_KEY环境变量未设置")
        
        # 解析JSON密钥
        try:
            gee_key = json.loads(gee_key_str)
        except json.JSONDecodeError as e:
            raise Exception(f"GEE密钥JSON解析失败: {e}")
        
        # 修复PEM格式（Manus系统会移除PEM标记中的空格）
        if 'private_key' in gee_key:
            private_key = gee_key['private_key']
            private_key = private_key.replace('-----BEGINPRIVATEKEY-----', '-----BEGIN PRIVATE KEY-----')
            private_key = private_key.replace('-----ENDPRIVATEKEY-----', '-----END PRIVATE KEY-----')
            gee_key['private_key'] = private_key
        
        # 使用临时文件进行认证
        temp_key_file = None
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
                json.dump(gee_key, f)
                temp_key_file = f.name
            
            with open(temp_key_file) as f:
                key_data = json.load(f)
            
            credentials = ee.ServiceAccountCredentials(
                email=key_data['client_email'],
                key_data=key_data['private_key']
            )
            ee.Initialize(credentials)
            
        except Exception as auth_error:
            raise Exception(f"GEE初始化失败: {auth_error}")
        
        finally:
            if temp_key_file and os.path.exists(temp_key_file):
                try:
                    os.unlink(temp_key_file)
                except:
                    pass
        
        # 创建几何体
        if isinstance(geometry, dict):
            if geometry.get('type') == 'Polygon':
                coords = geometry['coordinates'][0]
                geom = ee.Geometry.Polygon(coords)
            elif geometry.get('type') == 'Point':
                coords = geometry['coordinates']
                geom = ee.Geometry.Point(coords).buffer(500)
            else:
                geom = ee.Geometry.Rectangle(geometry.get('coordinates', [116.4, 39.9, 116.7, 40.2]))
        else:
            # 默认使用北京市朝阳区范围
            geom = ee.Geometry.Rectangle([116.4, 39.9, 116.7, 40.2])
        
        # 查询Sentinel-2数据
        sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
            .filterBounds(geom) \
            .filterDate(start_date, end_date) \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', max_cloud_cover)) \
            .sort('system:time_start', False)
        
        # 获取影像总数
        total_size = sentinel2.size().getInfo()
        print(f"[DEBUG] 找到 {total_size} 张影像", file=sys.stderr)
        
        # 返回所有数据（不限制数量）
        max_return = total_size
        
        # 获取影像列表
        image_list = sentinel2.toList(max_return).getInfo()
        print(f"[DEBUG] 准备返回 {len(image_list)} 张影像", file=sys.stderr)
        
        # 处理结果 - 只返回元数据，不生成缩略图和NDVI
        results = []
        for i, image_info in enumerate(image_list):
            try:
                properties = image_info.get('properties', {})
                
                # 提取关键信息
                timestamp = properties.get('system:time_start', 0)
                date_str = datetime.fromtimestamp(timestamp / 1000).strftime('%Y-%m-%d')
                
                cloud_cover = properties.get('CLOUDY_PIXEL_PERCENTAGE', 0)
                quality = 100 - cloud_cover
                
                # 获取传感器信息
                platform = properties.get('PLATFORM_NAME', 'Sentinel-2')
                
                # 获取影像ID
                image_id = image_info.get('id', f'S2_{date_str}_{i:03d}')
                
                # 生成缩略图URL（使用GEE的getThumbURL）
                try:
                    image = ee.Image(image_id)
                    thumbnail_url = image.getThumbURL({
                        'min': 0,
                        'max': 3000,
                        'bands': ['B4', 'B3', 'B2'],
                        'region': geom,
                        'dimensions': 100,
                        'format': 'png'
                    })
                except Exception as thumb_error:
                    # 如果缩略图生成失败，使用占位符
                    colors = ['FFD700', 'FFA500', 'FF6347', '32CD32', '00CED1', '4169E1', 'FF1493', '00FF00']
                    color = colors[i % len(colors)]
                    thumbnail_url = f"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23{color}' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='12'%3E{date_str}%3C/text%3E%3C/svg%3E"
                
                result = {
                    'id': image_id,
                    'date': date_str,
                    'cloudCover': round(float(cloud_cover), 2),
                    'quality': round(float(quality), 2),
                    'sensor': platform,
                    'resolution': 10,
                    'ndvi': None,  # 延迟计算
                    'thumbnail': thumbnail_url,
                }
                
                results.append(result)
                
            except Exception as e:
                print(f"[DEBUG] 处理影像失败: {e}", file=sys.stderr)
                continue
        
        print(f"[DEBUG] 返回 {len(results)} 张影像", file=sys.stderr)
        return results
        
    except Exception as e:
        raise

if __name__ == '__main__':
    try:
        # 从命令行参数读取输入
        args_str = sys.argv[1] if len(sys.argv) > 1 else '{}'
        args = json.loads(args_str)
        
        # 提取参数
        geometry = args.get('geometry')
        start_date = args.get('startDate', '2024-01-01')
        end_date = args.get('endDate', '2024-12-31')
        max_cloud_cover = args.get('maxCloudCover', 30)
        
        print(f"[DEBUG] 开始查询: {start_date} 到 {end_date}, 云量 < {max_cloud_cover}%", file=sys.stderr)
        
        # 查询数据
        results = query_sentinel2(geometry, start_date, end_date, max_cloud_cover)
        
        # 输出JSON结果
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)
