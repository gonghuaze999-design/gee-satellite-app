// 完整的中国行政区划数据

export interface Division {
  code: string;
  name: string;
  lat: number;
  lng: number;
  children?: Division[];
}

export const chinaProvinces: Division[] = [
  {
    "code": "beijing",
    "name": "北京市",
    "lat": 39.9042,
    "lng": 116.4074,
    "children": [
      {
        "code": "beijing_chaoyang",
        "name": "朝阳区",
        "lat": 39.9042,
        "lng": 116.4074
      },
      {
        "code": "beijing_chongwen",
        "name": "崇文区",
        "lat": 39.8816,
        "lng": 116.4074
      },
      {
        "code": "beijing_xicheng",
        "name": "西城区",
        "lat": 39.9289,
        "lng": 116.3605
      },
      {
        "code": "beijing_dongcheng",
        "name": "东城区",
        "lat": 39.9289,
        "lng": 116.4074
      }
    ]
  },
  {
    "code": "shanghai",
    "name": "上海市",
    "lat": 31.2304,
    "lng": 121.4737,
    "children": [
      {
        "code": "shanghai_pudong",
        "name": "浦东新区",
        "lat": 31.2304,
        "lng": 121.4737
      },
      {
        "code": "shanghai_huangpu",
        "name": "黄浦区",
        "lat": 31.2304,
        "lng": 121.4737
      },
      {
        "code": "shanghai_jing",
        "name": "静安区",
        "lat": 31.2304,
        "lng": 121.4737
      }
    ]
  },
  {
    "code": "guangdong",
    "name": "广东省",
    "lat": 23.1291,
    "lng": 113.2644,
    "children": [
      {
        "code": "guangdong_guangzhou",
        "name": "广州市",
        "lat": 23.1291,
        "lng": 113.2644
      },
      {
        "code": "guangdong_shenzhen",
        "name": "深圳市",
        "lat": 22.5431,
        "lng": 114.0579
      },
      {
        "code": "guangdong_zhuhai",
        "name": "珠海市",
        "lat": 22.271,
        "lng": 113.5439
      }
    ]
  },
  {
    "code": "zhejiang",
    "name": "浙江省",
    "lat": 30.2741,
    "lng": 120.1551,
    "children": [
      {
        "code": "zhejiang_hangzhou",
        "name": "杭州市",
        "lat": 30.2741,
        "lng": 120.1551
      },
      {
        "code": "zhejiang_ningbo",
        "name": "宁波市",
        "lat": 29.8683,
        "lng": 121.544
      },
      {
        "code": "zhejiang_wenzhou",
        "name": "温州市",
        "lat": 27.9881,
        "lng": 120.6551
      }
    ]
  },
  {
    "code": "jiangsu",
    "name": "江苏省",
    "lat": 32.0603,
    "lng": 118.7969,
    "children": [
      {
        "code": "jiangsu_nanjing",
        "name": "南京市",
        "lat": 32.0603,
        "lng": 118.7969
      },
      {
        "code": "jiangsu_suzhou",
        "name": "苏州市",
        "lat": 31.2989,
        "lng": 120.5954
      },
      {
        "code": "jiangsu_wuxi",
        "name": "无锡市",
        "lat": 31.4745,
        "lng": 120.2954
      }
    ]
  },
  {
    "code": "anhui",
    "name": "安徽省",
    "lat": 31.8206,
    "lng": 117.2272,
    "children": [
      {
        "code": "anhui_hefei",
        "name": "合肥市",
        "lat": 31.8206,
        "lng": 117.2272
      },
      {
        "code": "anhui_wuhu",
        "name": "芜湖市",
        "lat": 30.9396,
        "lng": 118.3675
      }
    ]
  },
  {
    "code": "shandong",
    "name": "山东省",
    "lat": 36.0671,
    "lng": 120.3826,
    "children": [
      {
        "code": "shandong_jinan",
        "name": "济南市",
        "lat": 36.6519,
        "lng": 117.1205
      },
      {
        "code": "shandong_qingdao",
        "name": "青岛市",
        "lat": 36.0671,
        "lng": 120.3826
      }
    ]
  },
  {
    "code": "henan",
    "name": "河南省",
    "lat": 34.7466,
    "lng": 113.6253,
    "children": [
      {
        "code": "henan_zhengzhou",
        "name": "郑州市",
        "lat": 34.7466,
        "lng": 113.6253
      },
      {
        "code": "henan_luoyang",
        "name": "洛阳市",
        "lat": 34.6301,
        "lng": 112.4543
      }
    ]
  },
  {
    "code": "hubei",
    "name": "湖北省",
    "lat": 30.5928,
    "lng": 114.3055,
    "children": [
      {
        "code": "hubei_wuhan",
        "name": "武汉市",
        "lat": 30.5928,
        "lng": 114.3055
      },
      {
        "code": "hubei_yichang",
        "name": "宜昌市",
        "lat": 30.7461,
        "lng": 111.3038
      }
    ]
  },
  {
    "code": "hunan",
    "name": "湖南省",
    "lat": 28.2282,
    "lng": 112.9388,
    "children": [
      {
        "code": "hunan_changsha",
        "name": "长沙市",
        "lat": 28.2282,
        "lng": 112.9388
      },
      {
        "code": "hunan_zhuzhou",
        "name": "株洲市",
        "lat": 27.8358,
        "lng": 113.2338
      }
    ]
  },
  {
    "code": "sichuan",
    "name": "四川省",
    "lat": 30.5728,
    "lng": 104.0668,
    "children": [
      {
        "code": "sichuan_chengdu",
        "name": "成都市",
        "lat": 30.5728,
        "lng": 104.0668
      },
      {
        "code": "sichuan_chongqing",
        "name": "重庆市",
        "lat": 29.4316,
        "lng": 106.9123
      }
    ]
  },
  {
    "code": "yunnan",
    "name": "云南省",
    "lat": 25.042,
    "lng": 102.7103,
    "children": [
      {
        "code": "yunnan_kunming",
        "name": "昆明市",
        "lat": 25.042,
        "lng": 102.7103
      },
      {
        "code": "yunnan_dali",
        "name": "大理州",
        "lat": 25.5989,
        "lng": 100.3161
      }
    ]
  },
  {
    "code": "guizhou",
    "name": "贵州省",
    "lat": 26.5783,
    "lng": 106.7135,
    "children": [
      {
        "code": "guizhou_guiyang",
        "name": "贵阳市",
        "lat": 26.5783,
        "lng": 106.7135
      },
      {
        "code": "guizhou_zunyi",
        "name": "遵义市",
        "lat": 27.7237,
        "lng": 106.9333
      }
    ]
  },
  {
    "code": "guangxi",
    "name": "广西壮族自治区",
    "lat": 22.817,
    "lng": 108.3665,
    "children": [
      {
        "code": "guangxi_nanning",
        "name": "南宁市",
        "lat": 22.817,
        "lng": 108.3665
      },
      {
        "code": "guangxi_guilin",
        "name": "桂林市",
        "lat": 25.2747,
        "lng": 110.2896
      }
    ]
  },
  {
    "code": "xinjiang",
    "name": "新疆维吾尔自治区",
    "lat": 43.7929,
    "lng": 87.6278,
    "children": [
      {
        "code": "xinjiang_urumqi",
        "name": "乌鲁木齐市",
        "lat": 43.7929,
        "lng": 87.6278
      },
      {
        "code": "xinjiang_kashgar",
        "name": "喀什市",
        "lat": 39.4753,
        "lng": 75.9248
      }
    ]
  },
  {
    "code": "ningxia",
    "name": "宁夏回族自治区",
    "lat": 38.468,
    "lng": 106.2586,
    "children": [
      {
        "code": "ningxia_yinchuan",
        "name": "银川市",
        "lat": 38.468,
        "lng": 106.2586
      },
      {
        "code": "ningxia_wuzhong",
        "name": "吴忠市",
        "lat": 37.986,
        "lng": 106.8037
      }
    ]
  },
  {
    "code": "qinghai",
    "name": "青海省",
    "lat": 36.6171,
    "lng": 101.7782,
    "children": [
      {
        "code": "qinghai_xining",
        "name": "西宁市",
        "lat": 36.6171,
        "lng": 101.7782
      },
      {
        "code": "qinghai_haidong",
        "name": "海东市",
        "lat": 36.5032,
        "lng": 102.1014
      }
    ]
  },
  {
    "code": "gansu",
    "name": "甘肃省",
    "lat": 36.0611,
    "lng": 103.8343,
    "children": [
      {
        "code": "gansu_lanzhou",
        "name": "兰州市",
        "lat": 36.0611,
        "lng": 103.8343
      },
      {
        "code": "gansu_jiayuguan",
        "name": "嘉峪关市",
        "lat": 39.7734,
        "lng": 98.2867
      }
    ]
  },
  {
    "code": "shaanxi",
    "name": "陕西省",
    "lat": 34.3416,
    "lng": 108.9398,
    "children": [
      {
        "code": "shaanxi_xian",
        "name": "西安市",
        "lat": 34.3416,
        "lng": 108.9398
      },
      {
        "code": "shaanxi_xianyang",
        "name": "咸阳市",
        "lat": 34.8206,
        "lng": 108.7139
      }
    ]
  },
  {
    "code": "shanxi",
    "name": "山西省",
    "lat": 37.8706,
    "lng": 112.5489,
    "children": [
      {
        "code": "shanxi_taiyuan",
        "name": "太原市",
        "lat": 37.8706,
        "lng": 112.5489
      },
      {
        "code": "shanxi_datong",
        "name": "大同市",
        "lat": 40.0901,
        "lng": 113.2997
      }
    ]
  },
  {
    "code": "hebei",
    "name": "河北省",
    "lat": 38.0428,
    "lng": 114.5149,
    "children": [
      {
        "code": "hebei_shijiazhuang",
        "name": "石家庄市",
        "lat": 38.0428,
        "lng": 114.5149
      },
      {
        "code": "hebei_tangshan",
        "name": "唐山市",
        "lat": 39.6326,
        "lng": 118.1889
      }
    ]
  },
  {
    "code": "liaoning",
    "name": "辽宁省",
    "lat": 41.8045,
    "lng": 123.4328,
    "children": [
      {
        "code": "liaoning_shenyang",
        "name": "沈阳市",
        "lat": 41.8045,
        "lng": 123.4328
      },
      {
        "code": "liaoning_dalian",
        "name": "大连市",
        "lat": 38.914,
        "lng": 121.6147
      }
    ]
  },
  {
    "code": "jilin",
    "name": "吉林省",
    "lat": 43.8171,
    "lng": 125.3235,
    "children": [
      {
        "code": "jilin_changchun",
        "name": "长春市",
        "lat": 43.8171,
        "lng": 125.3235
      },
      {
        "code": "jilin_jilin",
        "name": "吉林市",
        "lat": 43.8604,
        "lng": 126.5349
      }
    ]
  },
  {
    "code": "heilongjiang",
    "name": "黑龙江省",
    "lat": 45.8038,
    "lng": 126.5349,
    "children": [
      {
        "code": "heilongjiang_harbin",
        "name": "哈尔滨市",
        "lat": 45.8038,
        "lng": 126.5349
      },
      {
        "code": "heilongjiang_qiqihaer",
        "name": "齐齐哈尔市",
        "lat": 47.3426,
        "lng": 123.9668
      }
    ]
  },
  {
    "code": "fujian",
    "name": "福建省",
    "lat": 26.0745,
    "lng": 119.2965,
    "children": [
      {
        "code": "fujian_fuzhou",
        "name": "福州市",
        "lat": 26.0745,
        "lng": 119.2965
      },
      {
        "code": "fujian_xiamen",
        "name": "厦门市",
        "lat": 24.4798,
        "lng": 118.0894
      }
    ]
  },
  {
    "code": "jiangxi",
    "name": "江西省",
    "lat": 28.6832,
    "lng": 115.8581,
    "children": [
      {
        "code": "jiangxi_nanchang",
        "name": "南昌市",
        "lat": 28.6832,
        "lng": 115.8581
      },
      {
        "code": "jiangxi_ganzhou",
        "name": "赣州市",
        "lat": 25.8314,
        "lng": 114.9387
      }
    ]
  },
  {
    "code": "guizhou2",
    "name": "贵州省",
    "lat": 26.5783,
    "lng": 106.7135,
    "children": [
      {
        "code": "guizhou_guiyang2",
        "name": "贵阳市",
        "lat": 26.5783,
        "lng": 106.7135
      }
    ]
  },
  {
    "code": "tianjin",
    "name": "天津市",
    "lat": 39.0842,
    "lng": 117.201,
    "children": [
      {
        "code": "tianjin_hedong",
        "name": "河东区",
        "lat": 39.0842,
        "lng": 117.201
      },
      {
        "code": "tianjin_hexi",
        "name": "河西区",
        "lat": 39.0842,
        "lng": 117.201
      }
    ]
  },
  {
    "code": "chongqing",
    "name": "重庆市",
    "lat": 29.4316,
    "lng": 106.9123,
    "children": [
      {
        "code": "chongqing_yuzhong",
        "name": "渝中区",
        "lat": 29.4316,
        "lng": 106.9123
      },
      {
        "code": "chongqing_jiangbei",
        "name": "江北区",
        "lat": 29.563,
        "lng": 106.5516
      }
    ]
  },
  {
    "code": "xianggang",
    "name": "香港特别行政区",
    "lat": 22.3193,
    "lng": 114.1694,
    "children": [
      {
        "code": "xianggang_central",
        "name": "中环",
        "lat": 22.3193,
        "lng": 114.1694
      }
    ]
  },
  {
    "code": "aomen",
    "name": "澳门特别行政区",
    "lat": 22.1987,
    "lng": 113.5439,
    "children": [
      {
        "code": "aomen_central",
        "name": "中心",
        "lat": 22.1987,
        "lng": 113.5439
      }
    ]
  }
];


export function getDivisionCenter(code: string): { lat: number; lng: number } {
  const division = findDivision(code);
  return division ? { lat: division.lat, lng: division.lng } : { lat: 39.9042, lng: 116.4074 };
}

export function getCitiesByProvince(provinceCode: string): Division[] {
  const province = chinaProvinces.find(p => p.code === provinceCode);
  return province?.children || [];
}

export function getDistrictsByCity(cityCode: string): Division[] {
  for (const province of chinaProvinces) {
    const city = province.children?.find(c => c.code === cityCode);
    if (city?.children) return city.children;
  }
  return [];
}

function findDivision(code: string): Division | null {
  for (const province of chinaProvinces) {
    if (province.code === code) return province;
    if (province.children) {
      for (const city of province.children) {
        if (city.code === code) return city;
        if (city.children) {
          for (const district of city.children) {
            if (district.code === code) return district;
          }
        }
      }
    }
  }
  return null;
}
