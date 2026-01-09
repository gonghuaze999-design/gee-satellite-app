#!/usr/bin/env python3
"""
计算单景Sentinel-2影像的NDVI
NDVI = (NIR - RED) / (NIR + RED)
其中 NIR = B8, RED = B4
"""

import sys
import json
import os
from datetime import datetime

def calculate_ndvi(image_id, geometry=None):
    """
    计算Sentinel-2影像的NDVI
    
    Args:
        image_id: GEE影像ID
        geometry: 可选的几何体对象
    
    Returns:
        NDVI计算结果
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
        
        # 计算NDVI
        # NDVI = (NIR - RED) / (NIR + RED)
        # Sentinel-2: B8 = NIR, B4 = RED
        nir = image.select('B8').divide(10000)  # 转换为反射率
        red = image.select('B4').divide(10000)
        
        ndvi = nir.subtract(red).divide(nir.add(red))
        
        # 计算统计信息
        if geometry:
            if geometry.get('type') == 'Polygon':
                coords = geometry['coordinates'][0]
                geom = ee.Geometry.Polygon(coords)
            else:
                geom = ee.Geometry.Rectangle(geometry.get('coordinates', [100, 25, 120, 35]))
        else:
            # 使用影像的边界
            geom = image.geometry()
        
        # 获取NDVI统计
        stats = ndvi.reduceRegion(
            reducer=ee.Reducer.minMax().combine(ee.Reducer.mean(), None, True),
            geometry=geom,
            scale=10
        ).getInfo()
        
        return {
            'imageId': image_id,
            'ndviMin': round(stats.get('B8_min', -0.3), 3),
            'ndviMax': round(stats.get('B8_max', 0.9), 3),
            'ndviMean': round(stats.get('B8_mean', 0.5), 3),
            'colorMap': 'rainbow',
            'timestamp': datetime.now().isoformat(),
        }
    
    except ImportError:
        print("Error: earthengine-api not installed", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error calculating NDVI: {e}", file=sys.stderr)
        return None

if __name__ == '__main__':
    try:
        # 从命令行参数读取输入
        args = json.loads(sys.argv[1])
        
        image_id = args.get('imageId')
        geometry = args.get('geometry')
        
        if not image_id:
            raise ValueError("imageId is required")
        
        # 计算NDVI
        result = calculate_ndvi(image_id, geometry)
        
        if result:
            print(json.dumps(result))
        else:
            sys.exit(1)
    
    except Exception as e:
        print(f"Fatal error: {e}", file=sys.stderr)
        sys.exit(1)
