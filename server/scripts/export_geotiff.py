#!/usr/bin/env python3
"""
导出Sentinel-2影像为GeoTIFF格式
"""

import sys
import json
import os
import tempfile
from datetime import datetime

def export_geotiff(image_id, geometry, file_name, scale=10):
    """
    导出影像为GeoTIFF
    
    Args:
        image_id: GEE影像ID
        geometry: 几何体对象
        file_name: 输出文件名
        scale: 分辨率（米）
    
    Returns:
        导出任务信息
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
        
        # 获取影像
        image = ee.Image(image_id)
        
        # 创建几何体
        if isinstance(geometry, dict):
            if geometry.get('type') == 'Polygon':
                coords = geometry['coordinates'][0]
                geom = ee.Geometry.Polygon(coords)
            elif geometry.get('type') == 'Point':
                coords = geometry['coordinates']
                geom = ee.Geometry.Point(coords).buffer(500)
            else:
                # Rectangle格式
                coords = geometry.get('coordinates', [[116.4, 39.9], [116.7, 40.2]])
                if isinstance(coords[0], list) and len(coords[0]) == 2:
                    # [[lng1, lat1], [lng2, lat2]] 格式
                    geom = ee.Geometry.Rectangle([coords[0][0], coords[0][1], coords[1][0], coords[1][1]])
                else:
                    # [lng1, lat1, lng2, lat2] 格式
                    geom = ee.Geometry.Rectangle(coords)
        else:
            geom = ee.Geometry.Rectangle([116.4, 39.9, 116.7, 40.2])
        
        # 创建导出任务
        task = ee.batch.Export.image.toDrive(
            image=image,
            description=file_name,
            folder='GEE_Exports',
            fileNamePrefix=file_name,
            region=geom,
            scale=scale,
            fileFormat='GeoTIFF',
            maxPixels=1e13
        )
        
        # 启动任务
        task.start()
        
        return {
            'taskId': task.id,
            'status': 'RUNNING',
            'fileName': file_name,
            'timestamp': datetime.now().isoformat(),
        }
    
    except ImportError:
        print("Error: earthengine-api not installed", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error exporting GeoTIFF: {e}", file=sys.stderr)
        return None

if __name__ == '__main__':
    try:
        # 从命令行参数读取输入
        args = json.loads(sys.argv[1])
        
        image_id = args.get('imageId')
        geometry = args.get('geometry')
        file_name = args.get('fileName')
        scale = args.get('scale', 10)
        
        if not all([image_id, geometry, file_name]):
            raise ValueError("imageId, geometry, and fileName are required")
        
        # 导出GeoTIFF
        result = export_geotiff(image_id, geometry, file_name, scale)
        
        if result:
            print(json.dumps(result))
        else:
            sys.exit(1)
    
    except Exception as e:
        print(f"Fatal error: {e}", file=sys.stderr)
        sys.exit(1)
