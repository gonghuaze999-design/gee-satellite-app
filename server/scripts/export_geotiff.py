#!/usr/bin/env python3
"""
导出Sentinel-2影像为GeoTIFF格式
"""

import sys
import json
import os
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
        
        # 初始化GEE
        try:
            ee.Initialize()
        except:
            pass
        
        # 获取影像
        image = ee.Image(image_id)
        
        # 创建几何体
        if geometry.get('type') == 'Polygon':
            coords = geometry['coordinates'][0]
            geom = ee.Geometry.Polygon(coords)
        else:
            geom = ee.Geometry.Rectangle(geometry.get('coordinates', [100, 25, 120, 35]))
        
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
