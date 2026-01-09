#!/usr/bin/env python3
"""
批量计算Sentinel-2影像的NDVI
"""

import sys
import json
import os
from datetime import datetime

def batch_calculate_ndvi(image_ids, geometry=None):
    """
    批量计算NDVI
    
    Args:
        image_ids: GEE影像ID列表
        geometry: 可选的几何体对象
    
    Returns:
        NDVI计算结果列表
    """
    try:
        import ee
        
        # 初始化GEE
        try:
            ee.Initialize()
        except:
            pass
        
        results = []
        
        for image_id in image_ids:
            try:
                # 获取影像
                image = ee.Image(image_id)
                
                # 计算NDVI
                nir = image.select('B8').divide(10000)
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
                    geom = image.geometry()
                
                # 获取NDVI统计
                stats = ndvi.reduceRegion(
                    reducer=ee.Reducer.minMax().combine(ee.Reducer.mean(), None, True),
                    geometry=geom,
                    scale=10
                ).getInfo()
                
                results.append({
                    'imageId': image_id,
                    'ndviMin': round(stats.get('B8_min', -0.3), 3),
                    'ndviMax': round(stats.get('B8_max', 0.9), 3),
                    'ndviMean': round(stats.get('B8_mean', 0.5), 3),
                    'colorMap': 'rainbow',
                    'timestamp': datetime.now().isoformat(),
                })
            except Exception as e:
                print(f"Error processing {image_id}: {e}", file=sys.stderr)
                results.append({
                    'imageId': image_id,
                    'error': str(e),
                })
        
        return results
    
    except ImportError:
        print("Error: earthengine-api not installed", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Error in batch calculation: {e}", file=sys.stderr)
        return []

if __name__ == '__main__':
    try:
        # 从命令行参数读取输入
        args = json.loads(sys.argv[1])
        
        image_ids = args.get('imageIds', [])
        geometry = args.get('geometry')
        
        if not image_ids:
            raise ValueError("imageIds is required")
        
        # 批量计算NDVI
        results = batch_calculate_ndvi(image_ids, geometry)
        
        print(json.dumps(results))
    
    except Exception as e:
        print(f"Fatal error: {e}", file=sys.stderr)
        sys.exit(1)
