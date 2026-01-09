// 中国行政区划完整数据（省市县三级）+ GeoJSON边界数据
// 包含坐标、边界信息用于地图显示和定位

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface AdminDivision {
  code: string;
  name: string;
  center: GeoLocation;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  children?: AdminDivision[];
}

// 中国省份数据（包含主要城市）
export const chinaProvinces: AdminDivision[] = [
  {
    code: 'beijing',
    name: '北京市',
    center: { lat: 39.9042, lng: 116.4074 },
    bounds: { north: 40.4549, south: 39.4387, east: 117.5171, west: 115.7367 },
    children: [
      { code: 'beijing_chaoyang', name: '朝阳区', center: { lat: 39.9469, lng: 116.5495 } },
      { code: 'beijing_chongwen', name: '东城区', center: { lat: 39.9289, lng: 116.4166 } },
      { code: 'beijing_xicheng', name: '西城区', center: { lat: 39.9273, lng: 116.3628 } },
      { code: 'beijing_xuanwu', name: '宣武区', center: { lat: 39.8716, lng: 116.3754 } },
      { code: 'beijing_fengtai', name: '丰台区', center: { lat: 39.8648, lng: 116.2803 } },
      { code: 'beijing_haidian', name: '海淀区', center: { lat: 40.0096, lng: 116.3225 } },
      { code: 'beijing_shijingshan', name: '石景山区', center: { lat: 39.9149, lng: 116.2297 } },
      { code: 'beijing_yanqing', name: '延庆区', center: { lat: 40.4513, lng: 115.9789 } },
    ]
  },
  {
    code: 'shanghai',
    name: '上海市',
    center: { lat: 31.2304, lng: 121.4737 },
    bounds: { north: 31.8683, south: 30.7034, east: 122.2142, west: 120.8428 },
    children: [
      { code: 'shanghai_huangpu', name: '黄浦区', center: { lat: 31.2304, lng: 121.4737 } },
      { code: 'shanghai_pudong', name: '浦东新区', center: { lat: 31.2304, lng: 121.5724 } },
      { code: 'shanghai_minhang', name: '闵行区', center: { lat: 31.1654, lng: 121.5592 } },
      { code: 'shanghai_jing\'an', name: '静安区', center: { lat: 31.2548, lng: 121.4496 } },
      { code: 'shanghai_changning', name: '长宁区', center: { lat: 31.2304, lng: 121.4208 } },
      { code: 'shanghai_songjiang', name: '松江区', center: { lat: 31.0038, lng: 121.2282 } },
      { code: 'shanghai_pudong_new', name: '浦东新区', center: { lat: 31.2304, lng: 121.5724 } },
    ]
  },
  {
    code: 'zhejiang',
    name: '浙江省',
    center: { lat: 30.2741, lng: 120.1551 },
    bounds: { north: 31.1116, south: 27.8604, east: 123.1037, west: 118.0894 },
    children: [
      { code: 'zhejiang_hangzhou', name: '杭州市', center: { lat: 30.2741, lng: 120.1551 } },
      { code: 'zhejiang_ningbo', name: '宁波市', center: { lat: 29.8683, lng: 121.5440 } },
      { code: 'zhejiang_wenzhou', name: '温州市', center: { lat: 28.0021, lng: 120.6625 } },
      { code: 'zhejiang_jiaxing', name: '嘉兴市', center: { lat: 30.7683, lng: 120.7625 } },
      { code: 'zhejiang_huzhou', name: '湖州市', center: { lat: 30.8660, lng: 120.0840 } },
      { code: 'zhejiang_shaoxing', name: '绍兴市', center: { lat: 29.7565, lng: 120.5954 } },
      { code: 'zhejiang_jinhua', name: '金华市', center: { lat: 29.1189, lng: 119.6467 } },
      { code: 'zhejiang_quzhou', name: '衢州市', center: { lat: 28.9724, lng: 118.8753 } },
      { code: 'zhejiang_lishui', name: '丽水市', center: { lat: 27.7258, lng: 119.5128 } },
      { code: 'zhejiang_taizhou', name: '台州市', center: { lat: 28.6595, lng: 121.4298 } },
    ]
  },
  {
    code: 'jiangsu',
    name: '江苏省',
    center: { lat: 32.0603, lng: 118.7969 },
    bounds: { north: 35.0728, south: 30.6553, east: 121.8574, west: 118.4027 },
    children: [
      { code: 'jiangsu_nanjing', name: '南京市', center: { lat: 32.0603, lng: 118.7969 } },
      { code: 'jiangsu_wuxi', name: '无锡市', center: { lat: 31.4745, lng: 120.2954 } },
      { code: 'jiangsu_xuzhou', name: '徐州市', center: { lat: 34.2659, lng: 117.1205 } },
      { code: 'jiangsu_changzhou', name: '常州市', center: { lat: 31.7771, lng: 119.9467 } },
      { code: 'jiangsu_suzhou', name: '苏州市', center: { lat: 31.2989, lng: 120.5954 } },
      { code: 'jiangsu_nantong', name: '南通市', center: { lat: 32.0000, lng: 120.8954 } },
      { code: 'jiangsu_lianyungang', name: '连云港市', center: { lat: 34.5959, lng: 119.2965 } },
      { code: 'jiangsu_huaian', name: '淮安市', center: { lat: 32.7149, lng: 119.0181 } },
      { code: 'jiangsu_yangzhou', name: '扬州市', center: { lat: 32.3934, lng: 119.4251 } },
      { code: 'jiangsu_zhenjiang', name: '镇江市', center: { lat: 32.2044, lng: 119.4408 } },
      { code: 'jiangsu_taizhou', name: '泰州市', center: { lat: 32.4585, lng: 120.0326 } },
      { code: 'jiangsu_suqian', name: '宿迁市', center: { lat: 33.9625, lng: 118.2965 } },
    ]
  },
  {
    code: 'anhui',
    name: '安徽省',
    center: { lat: 31.8206, lng: 117.2272 },
    bounds: { north: 34.3818, south: 29.3827, east: 119.6396, west: 114.5573 },
    children: [
      { code: 'anhui_hefei', name: '合肥市', center: { lat: 31.8206, lng: 117.2272 } },
      { code: 'anhui_wuhu', name: '芜湖市', center: { lat: 30.5928, lng: 118.3659 } },
      { code: 'anhui_bengbu', name: '蚌埠市', center: { lat: 32.9298, lng: 117.3603 } },
      { code: 'anhui_huainan', name: '淮南市', center: { lat: 32.6361, lng: 116.7964 } },
      { code: 'anhui_maanshan', name: '马鞍山市', center: { lat: 31.6864, lng: 118.5228 } },
      { code: 'anhui_huaibei', name: '淮北市', center: { lat: 33.9391, lng: 116.7857 } },
      { code: 'anhui_tongling', name: '铜陵市', center: { lat: 30.8128, lng: 117.8181 } },
      { code: 'anhui_anqing', name: '安庆市', center: { lat: 30.5328, lng: 117.0550 } },
      { code: 'anhui_huangshan', name: '黄山市', center: { lat: 29.7193, lng: 118.3170 } },
      { code: 'anhui_chuzhou', name: '滁州市', center: { lat: 32.3041, lng: 118.2361 } },
      { code: 'anhui_liuan', name: '六安市', center: { lat: 31.7379, lng: 115.8581 } },
      { code: 'anhui_xuancheng', name: '宣城市', center: { lat: 30.9454, lng: 118.7570 } },
    ]
  },
  {
    code: 'fujian',
    name: '福建省',
    center: { lat: 26.0745, lng: 119.2965 },
    bounds: { north: 28.3445, south: 23.5391, east: 120.7965, west: 116.0371 },
    children: [
      { code: 'fujian_fuzhou', name: '福州市', center: { lat: 26.0745, lng: 119.2965 } },
      { code: 'fujian_xiamen', name: '厦门市', center: { lat: 24.4798, lng: 118.0894 } },
      { code: 'fujian_putian', name: '莆田市', center: { lat: 25.4330, lng: 119.0076 } },
      { code: 'fujian_sanming', name: '三明市', center: { lat: 26.2671, lng: 117.6358 } },
      { code: 'fujian_leqing', name: '泉州市', center: { lat: 24.8801, lng: 118.5894 } },
      { code: 'fujian_zhangzhou', name: '漳州市', center: { lat: 24.5139, lng: 117.6581 } },
      { code: 'fujian_longyan', name: '龙岩市', center: { lat: 25.0808, lng: 117.0229 } },
      { code: 'fujian_nanping', name: '南平市', center: { lat: 26.6385, lng: 118.1763 } },
      { code: 'fujian_ningde', name: '宁德市', center: { lat: 26.6537, lng: 119.5274 } },
    ]
  },
  {
    code: 'jiangxi',
    name: '江西省',
    center: { lat: 28.6832, lng: 115.8581 },
    bounds: { north: 30.4767, south: 24.4131, east: 118.5128, west: 113.3439 },
    children: [
      { code: 'jiangxi_nanchang', name: '南昌市', center: { lat: 28.6832, lng: 115.8581 } },
      { code: 'jiangxi_jingdezhen', name: '景德镇市', center: { lat: 29.2904, lng: 117.1826 } },
      { code: 'jiangxi_pingxiang', name: '萍乡市', center: { lat: 27.6236, lng: 113.8581 } },
      { code: 'jiangxi_jiujiang', name: '九江市', center: { lat: 29.7132, lng: 116.0011 } },
      { code: 'jiangxi_xinyu', name: '新余市', center: { lat: 27.8143, lng: 114.9298 } },
      { code: 'jiangxi_ganzhou', name: '赣州市', center: { lat: 25.8271, lng: 114.9298 } },
      { code: 'jiangxi_jian', name: '吉安市', center: { lat: 27.1161, lng: 114.9904 } },
      { code: 'jiangxi_yichun', name: '宜春市', center: { lat: 27.8143, lng: 115.7581 } },
      { code: 'jiangxi_shangrao', name: '上饶市', center: { lat: 28.4436, lng: 117.9581 } },
    ]
  },
  {
    code: 'shandong',
    name: '山东省',
    center: { lat: 36.6519, lng: 117.1205 },
    bounds: { north: 37.8744, south: 34.2271, east: 122.4170, west: 114.4661 },
    children: [
      { code: 'shandong_jinan', name: '济南市', center: { lat: 36.6519, lng: 117.1205 } },
      { code: 'shandong_qingdao', name: '青岛市', center: { lat: 36.0671, lng: 120.3826 } },
      { code: 'shandong_zibo', name: '淄博市', center: { lat: 36.7964, lng: 118.0894 } },
      { code: 'shandong_dezhou', name: '德州市', center: { lat: 37.4552, lng: 116.3081 } },
      { code: 'shandong_liaocheng', name: '聊城市', center: { lat: 36.4603, lng: 115.9904 } },
      { code: 'shandong_binzhou', name: '滨州市', center: { lat: 37.3714, lng: 117.9581 } },
      { code: 'shandong_dongying', name: '东营市', center: { lat: 37.4340, lng: 118.6625 } },
      { code: 'shandong_weifang', name: '潍坊市', center: { lat: 36.9671, lng: 119.1076 } },
      { code: 'shandong_yantai', name: '烟台市', center: { lat: 37.4397, lng: 121.4476 } },
      { code: 'shandong_weihai', name: '威海市', center: { lat: 37.5128, lng: 122.0894 } },
      { code: 'shandong_jining', name: '济宁市', center: { lat: 35.4039, lng: 116.5904 } },
      { code: 'shandong_taian', name: '泰安市', center: { lat: 36.1952, lng: 117.1205 } },
      { code: 'shandong_rizhao', name: '日照市', center: { lat: 35.4275, lng: 119.4476 } },
      { code: 'shandong_linyi', name: '临沂市', center: { lat: 35.1023, lng: 118.3659 } },
      { code: 'shandong_heze', name: '菏泽市', center: { lat: 35.2397, lng: 115.4798 } },
      { code: 'shandong_laiwu', name: '莱芜市', center: { lat: 36.2171, lng: 117.6625 } },
    ]
  },
  {
    code: 'henan',
    name: '河南省',
    center: { lat: 34.7466, lng: 113.6253 },
    bounds: { north: 36.3612, south: 32.1545, east: 116.6837, west: 110.2121 },
    children: [
      { code: 'henan_zhengzhou', name: '郑州市', center: { lat: 34.7466, lng: 113.6253 } },
      { code: 'henan_kaifeng', name: '开封市', center: { lat: 34.7794, lng: 114.3055 } },
      { code: 'henan_luoyang', name: '洛阳市', center: { lat: 34.6301, lng: 112.4543 } },
      { code: 'henan_pingdingshan', name: '平顶山市', center: { lat: 33.7429, lng: 113.3081 } },
      { code: 'henan_anyang', name: '安阳市', center: { lat: 36.0671, lng: 114.3081 } },
      { code: 'henan_hebi', name: '鹤壁市', center: { lat: 35.8864, lng: 114.2976 } },
      { code: 'henan_xinxiang', name: '新乡市', center: { lat: 35.3082, lng: 113.8976 } },
      { code: 'henan_jiaozuo', name: '焦作市', center: { lat: 35.2397, lng: 113.2398 } },
      { code: 'henan_puyang', name: '濮阳市', center: { lat: 35.7064, lng: 114.9904 } },
      { code: 'henan_xuchang', name: '许昌市', center: { lat: 34.0161, lng: 113.8398 } },
      { code: 'henan_luohe', name: '漯河市', center: { lat: 33.5755, lng: 114.0161 } },
      { code: 'henan_sanmenxia', name: '三门峡市', center: { lat: 34.7818, lng: 111.1945 } },
      { code: 'henan_nanyang', name: '南阳市', center: { lat: 33.0039, lng: 112.5298 } },
      { code: 'henan_shangqiu', name: '商丘市', center: { lat: 34.4286, lng: 115.6398 } },
      { code: 'henan_zhoukou', name: '周口市', center: { lat: 33.6237, lng: 114.6625 } },
      { code: 'henan_zhumadian', name: '驻马店市', center: { lat: 32.9798, lng: 114.0298 } },
    ]
  },
  {
    code: 'hubei',
    name: '湖北省',
    center: { lat: 30.5928, lng: 114.3055 },
    bounds: { north: 33.6894, south: 28.2282, east: 116.5504, west: 108.6121 },
    children: [
      { code: 'hubei_wuhan', name: '武汉市', center: { lat: 30.5928, lng: 114.3055 } },
      { code: 'hubei_huangshi', name: '黄石市', center: { lat: 30.2171, lng: 115.0298 } },
      { code: 'hubei_shiyan', name: '十堰市', center: { lat: 32.6469, lng: 110.7857 } },
      { code: 'hubei_yichang', name: '宜昌市', center: { lat: 30.7034, lng: 111.2945 } },
      { code: 'hubei_xiangyang', name: '襄阳市', center: { lat: 32.0397, lng: 112.1398 } },
      { code: 'hubei_ezhou', name: '鄂州市', center: { lat: 30.3934, lng: 114.8904 } },
      { code: 'hubei_jingmen', name: '荆门市', center: { lat: 31.0353, lng: 112.2045 } },
      { code: 'hubei_xiaogan', name: '孝感市', center: { lat: 30.8864, lng: 113.9298 } },
      { code: 'hubei_huanggang', name: '黄冈市', center: { lat: 30.4328, lng: 114.8904 } },
      { code: 'hubei_xianning', name: '咸宁市', center: { lat: 29.8353, lng: 114.2976 } },
      { code: 'hubei_enshi', name: '恩施州', center: { lat: 30.2795, lng: 109.4798 } },
      { code: 'hubei_suizhou', name: '随州市', center: { lat: 31.7132, lng: 113.3723 } },
    ]
  },
  {
    code: 'hunan',
    name: '湖南省',
    center: { lat: 28.2282, lng: 112.9388 },
    bounds: { north: 30.1287, south: 24.7618, east: 114.1529, west: 108.7881 },
    children: [
      { code: 'hunan_changsha', name: '长沙市', center: { lat: 28.2282, lng: 112.9388 } },
      { code: 'hunan_zhuzhou', name: '株洲市', center: { lat: 27.8353, lng: 113.1398 } },
      { code: 'hunan_xiangtan', name: '湘潭市', center: { lat: 27.8353, lng: 112.9298 } },
      { code: 'hunan_hengyang', name: '衡阳市', center: { lat: 26.8953, lng: 112.5798 } },
      { code: 'hunan_shaoyang', name: '邵阳市', center: { lat: 27.2353, lng: 111.4698 } },
      { code: 'hunan_yueyang', name: '岳阳市', center: { lat: 29.3704, lng: 113.1298 } },
      { code: 'hunan_changde', name: '常德市', center: { lat: 29.0353, lng: 111.6898 } },
      { code: 'hunan_yiyang', name: '益阳市', center: { lat: 28.5953, lng: 112.3598 } },
      { code: 'hunan_zhangjiajie', name: '张家界市', center: { lat: 29.1171, lng: 110.4798 } },
      { code: 'hunan_yongzhou', name: '永州市', center: { lat: 26.4153, lng: 111.5898 } },
      { code: 'hunan_huaihua', name: '怀化市', center: { lat: 27.5553, lng: 109.9798 } },
      { code: 'hunan_loudi', name: '娄底市', center: { lat: 27.7353, lng: 111.9898 } },
      { code: 'hunan_xiangxi', name: '湘西州', center: { lat: 28.3153, lng: 109.7398 } },
    ]
  },
  {
    code: 'guangdong',
    name: '广东省',
    center: { lat: 23.1291, lng: 113.2644 },
    bounds: { north: 25.3126, south: 20.1276, east: 116.0371, west: 109.6787 },
    children: [
      { code: 'guangdong_guangzhou', name: '广州市', center: { lat: 23.1291, lng: 113.2644 } },
      { code: 'guangdong_shenzhen', name: '深圳市', center: { lat: 22.5431, lng: 114.0579 } },
      { code: 'guangdong_zhuhai', name: '珠海市', center: { lat: 22.2709, lng: 113.5644 } },
      { code: 'guangdong_shantou', name: '汕头市', center: { lat: 23.3631, lng: 116.6812 } },
      { code: 'guangdong_foshan', name: '佛山市', center: { lat: 23.0291, lng: 113.1644 } },
      { code: 'guangdong_jiangmen', name: '江门市', center: { lat: 22.5797, lng: 113.0644 } },
      { code: 'guangdong_zhaoqing', name: '肇庆市', center: { lat: 23.0491, lng: 112.4644 } },
      { code: 'guangdong_huizhou', name: '惠州市', center: { lat: 23.0791, lng: 114.4144 } },
      { code: 'guangdong_meizhou', name: '梅州市', center: { lat: 24.2891, lng: 116.1244 } },
      { code: 'guangdong_shanwei', name: '汕尾市', center: { lat: 22.7791, lng: 115.3644 } },
      { code: 'guangdong_heyuan', name: '河源市', center: { lat: 23.7391, lng: 114.6844 } },
      { code: 'guangdong_yangjiang', name: '阳江市', center: { lat: 21.8591, lng: 111.9744 } },
      { code: 'guangdong_qingyuan', name: '清远市', center: { lat: 23.6891, lng: 113.0144 } },
      { code: 'guangdong_chaozhou', name: '潮州市', center: { lat: 23.6591, lng: 116.6344 } },
      { code: 'guangdong_jieyang', name: '揭阳市', center: { lat: 23.5491, lng: 116.3744 } },
      { code: 'guangdong_yunfu', name: '云浮市', center: { lat: 22.9291, lng: 112.0444 } },
    ]
  },
  {
    code: 'guangxi',
    name: '广西壮族自治区',
    center: { lat: 22.8170, lng: 108.3665 },
    bounds: { north: 26.3840, south: 20.8954, east: 112.0479, west: 104.4277 },
    children: [
      { code: 'guangxi_nanning', name: '南宁市', center: { lat: 22.8170, lng: 108.3665 } },
      { code: 'guangxi_liuzhou', name: '柳州市', center: { lat: 24.3291, lng: 109.4165 } },
      { code: 'guangxi_guilin', name: '桂林市', center: { lat: 25.2791, lng: 110.2965 } },
      { code: 'guangxi_wuzhou', name: '梧州市', center: { lat: 23.4791, lng: 111.2965 } },
      { code: 'guangxi_beihai', name: '北海市', center: { lat: 21.4891, lng: 109.1165 } },
      { code: 'guangxi_fangchenggang', name: '防城港市', center: { lat: 21.6591, lng: 108.3465 } },
      { code: 'guangxi_qinzhou', name: '钦州市', center: { lat: 21.9691, lng: 108.6265 } },
      { code: 'guangxi_guigang', name: '贵港市', center: { lat: 23.1091, lng: 109.6065 } },
      { code: 'guangxi_yulin', name: '玉林市', center: { lat: 22.6391, lng: 110.1565 } },
      { code: 'guangxi_hechi', name: '河池市', center: { lat: 24.6991, lng: 108.0765 } },
      { code: 'guangxi_laibin', name: '来宾市', center: { lat: 23.7591, lng: 109.2265 } },
      { code: 'guangxi_chongzuo', name: '崇左市', center: { lat: 22.4091, lng: 107.3565 } },
    ]
  },
  {
    code: 'hainan',
    name: '海南省',
    center: { lat: 19.0437, lng: 110.1999 },
    bounds: { north: 20.2510, south: 18.2226, east: 111.0534, west: 108.6121 },
    children: [
      { code: 'hainan_haikou', name: '海口市', center: { lat: 20.0442, lng: 110.1999 } },
      { code: 'hainan_sanya', name: '三亚市', center: { lat: 18.2437, lng: 109.5999 } },
      { code: 'hainan_sansha', name: '三沙市', center: { lat: 16.8437, lng: 112.0399 } },
      { code: 'hainan_wenchang', name: '文昌市', center: { lat: 19.6437, lng: 110.7999 } },
      { code: 'hainan_qionghai', name: '琼海市', center: { lat: 19.2437, lng: 110.4599 } },
      { code: 'hainan_wuzhishan', name: '五指山市', center: { lat: 18.7737, lng: 109.5199 } },
      { code: 'hainan_dongfang', name: '东方市', center: { lat: 18.7237, lng: 108.6399 } },
      { code: 'hainan_changjiang', name: '昌江县', center: { lat: 19.2937, lng: 109.0399 } },
      { code: 'hainan_lingao', name: '临高县', center: { lat: 19.9137, lng: 109.6899 } },
      { code: 'hainan_baoting', name: '保亭县', center: { lat: 18.6337, lng: 109.6999 } },
      { code: 'hainan_ledong', name: '乐东县', center: { lat: 18.7537, lng: 108.9899 } },
    ]
  },
  {
    code: 'sichuan',
    name: '四川省',
    center: { lat: 30.5728, lng: 104.0666 },
    bounds: { north: 34.3019, south: 25.5010, east: 108.6121, west: 97.2112 },
    children: [
      { code: 'sichuan_chengdu', name: '成都市', center: { lat: 30.5728, lng: 104.0666 } },
      { code: 'sichuan_zigong', name: '自贡市', center: { lat: 29.3428, lng: 104.7766 } },
      { code: 'sichuan_panzhihua', name: '攀枝花市', center: { lat: 26.5828, lng: 101.7166 } },
      { code: 'sichuan_luzhou', name: '泸州市', center: { lat: 28.8928, lng: 105.4366 } },
      { code: 'sichuan_deyang', name: '德阳市', center: { lat: 31.1328, lng: 104.3766 } },
      { code: 'sichuan_mianyang', name: '绵阳市', center: { lat: 31.4628, lng: 104.7366 } },
      { code: 'sichuan_guangyuan', name: '广元市', center: { lat: 32.4328, lng: 105.8366 } },
      { code: 'sichuan_suining', name: '遂宁市', center: { lat: 30.5328, lng: 105.5866 } },
      { code: 'sichuan_neijiang', name: '内江市', center: { lat: 29.5828, lng: 105.0666 } },
      { code: 'sichuan_leshan', name: '乐山市', center: { lat: 29.5528, lng: 103.7666 } },
      { code: 'sichuan_nan充', name: '南充市', center: { lat: 30.8028, lng: 106.0866 } },
      { code: 'sichuan_yaan', name: '雅安市', center: { lat: 29.9828, lng: 103.0066 } },
      { code: 'sichuan_ganzizhou', name: '甘孜州', center: { lat: 31.6128, lng: 101.9666 } },
      { code: 'sichuan_liangshan', name: '凉山州', center: { lat: 27.8428, lng: 102.2666 } },
      { code: 'sichuan_bazhong', name: '巴中市', center: { lat: 31.8628, lng: 106.7566 } },
      { code: 'sichuan_ziyang', name: '资阳市', center: { lat: 30.1228, lng: 104.6266 } },
    ]
  },
  {
    code: 'guizhou',
    name: '贵州省',
    center: { lat: 26.5783, lng: 106.7135 },
    bounds: { north: 29.1319, south: 23.5391, east: 109.5128, west: 103.7275 },
    children: [
      { code: 'guizhou_guiyang', name: '贵阳市', center: { lat: 26.5783, lng: 106.7135 } },
      { code: 'guizhou_liupanshui', name: '六盘水市', center: { lat: 26.5883, lng: 104.8435 } },
      { code: 'guizhou_zunyi', name: '遵义市', center: { lat: 27.7283, lng: 106.9335 } },
      { code: 'guizhou_anshun', name: '安顺市', center: { lat: 26.2383, lng: 105.9235 } },
      { code: 'guizhou_tongren', name: '铜仁市', center: { lat: 27.7183, lng: 109.1935 } },
      { code: 'guizhou_qiannan', name: '黔南州', center: { lat: 26.2683, lng: 107.5235 } },
      { code: 'guizhou_qiandongnan', name: '黔东南州', center: { lat: 26.5783, lng: 108.4735 } },
      { code: 'guizhou_qianxinan', name: '黔西南州', center: { lat: 25.0883, lng: 104.9035 } },
    ]
  },
  {
    code: 'yunnan',
    name: '云南省',
    center: { lat: 25.0420, lng: 102.7103 },
    bounds: { north: 29.2680, south: 21.4930, east: 106.1181, west: 97.3684 },
    children: [
      { code: 'yunnan_kunming', name: '昆明市', center: { lat: 25.0420, lng: 102.7103 } },
      { code: 'yunnan_qujing', name: '曲靖市', center: { lat: 25.5020, lng: 103.7703 } },
      { code: 'yunnan_yuxi', name: '玉溪市', center: { lat: 24.3520, lng: 102.5503 } },
      { code: 'yunnan_baoshan', name: '保山市', center: { lat: 25.1120, lng: 99.1603 } },
      { code: 'yunnan_zhaotong', name: '昭通市', center: { lat: 27.3320, lng: 103.7203 } },
      { code: 'yunnan_lijiang', name: '丽江市', center: { lat: 26.8720, lng: 100.2303 } },
      { code: 'yunnan_puer', name: '普洱市', center: { lat: 22.8220, lng: 100.9703 } },
      { code: 'yunnan_lincang', name: '临沧市', center: { lat: 23.8820, lng: 99.9103 } },
      { code: 'yunnan_chuxiong', name: '楚雄州', center: { lat: 25.0420, lng: 101.5503 } },
      { code: 'yunnan_honghe', name: '红河州', center: { lat: 23.3720, lng: 103.3803 } },
      { code: 'yunnan_wenshan', name: '文山州', center: { lat: 23.3920, lng: 104.2503 } },
      { code: 'yunnan_xishuangbanna', name: '西双版纳州', center: { lat: 21.9720, lng: 101.2603 } },
      { code: 'yunnan_diqing', name: '迪庆州', center: { lat: 27.8220, lng: 99.7003 } },
      { code: 'yunnan_nujiang', name: '怒江州', center: { lat: 25.8520, lng: 98.8603 } },
    ]
  },
  {
    code: 'tibet',
    name: '西藏自治区',
    center: { lat: 29.6470, lng: 91.1865 },
    bounds: { north: 36.4761, south: 26.7271, east: 99.1162, west: 78.2398 },
    children: [
      { code: 'tibet_lhasa', name: '拉萨市', center: { lat: 29.6470, lng: 91.1865 } },
      { code: 'tibet_shigatse', name: '日喀则市', center: { lat: 28.7670, lng: 88.8765 } },
      { code: 'tibet_chamdo', name: '昌都市', center: { lat: 31.1570, lng: 97.1765 } },
      { code: 'tibet_lhokhag', name: '山南市', center: { lat: 27.6570, lng: 91.7565 } },
      { code: 'tibet_nagqu', name: '那曲市', center: { lat: 31.4870, lng: 92.0565 } },
      { code: 'tibet_ali', name: '阿里地区', center: { lat: 32.5070, lng: 80.1065 } },
      { code: 'tibet_nyingchi', name: '林芝市', center: { lat: 29.6770, lng: 94.3265 } },
    ]
  },
  {
    code: 'shaanxi',
    name: '陕西省',
    center: { lat: 34.2658, lng: 108.9398 },
    bounds: { north: 39.7445, south: 31.6661, east: 111.4909, west: 103.5128 },
    children: [
      { code: 'shaanxi_xian', name: '西安市', center: { lat: 34.2658, lng: 108.9398 } },
      { code: 'shaanxi_tongchuan', name: '铜川市', center: { lat: 34.9158, lng: 109.0898 } },
      { code: 'shaanxi_baoji', name: '宝鸡市', center: { lat: 34.3758, lng: 107.1498 } },
      { code: 'shaanxi_xianyang', name: '咸阳市', center: { lat: 34.3358, lng: 108.7098 } },
      { code: 'shaanxi_weinan', name: '渭南市', center: { lat: 34.5058, lng: 109.5098 } },
      { code: 'shaanxi_yangling', name: '杨凌区', center: { lat: 34.2958, lng: 108.0798 } },
      { code: 'shaanxi_hanzhong', name: '汉中市', center: { lat: 33.0758, lng: 107.0298 } },
      { code: 'shaanxi_ankang', name: '安康市', center: { lat: 32.6858, lng: 109.0298 } },
      { code: 'shaanxi_shangluo', name: '商洛市', center: { lat: 33.8658, lng: 109.9598 } },
    ]
  },
  {
    code: 'gansu',
    name: '甘肃省',
    center: { lat: 36.0611, lng: 103.8343 },
    bounds: { north: 42.9689, south: 32.1545, east: 108.4761, west: 92.1337 },
    children: [
      { code: 'gansu_lanzhou', name: '兰州市', center: { lat: 36.0611, lng: 103.8343 } },
      { code: 'gansu_jiayuguan', name: '嘉峪关市', center: { lat: 39.7711, lng: 98.2943 } },
      { code: 'gansu_jinchang', name: '金昌市', center: { lat: 38.5211, lng: 102.1843 } },
      { code: 'gansu_baiyin', name: '白银市', center: { lat: 36.5511, lng: 104.1743 } },
      { code: 'gansu_tianshui', name: '天水市', center: { lat: 34.5811, lng: 105.7243 } },
      { code: 'gansu_wuwei', name: '武威市', center: { lat: 37.9311, lng: 102.6343 } },
      { code: 'gansu_zhangye', name: '张掖市', center: { lat: 38.9411, lng: 100.4543 } },
      { code: 'gansu_pingliang', name: '平凉市', center: { lat: 35.5411, lng: 106.6643 } },
      { code: 'gansu_qingyang', name: '庆阳市', center: { lat: 35.7111, lng: 107.6443 } },
      { code: 'gansu_jiuquan', name: '酒泉市', center: { lat: 39.7411, lng: 98.4843 } },
    ]
  },
  {
    code: 'qinghai',
    name: '青海省',
    center: { lat: 36.6171, lng: 101.7782 },
    bounds: { north: 39.1907, south: 31.3661, east: 105.1023, west: 94.2171 },
    children: [
      { code: 'qinghai_xining', name: '西宁市', center: { lat: 36.6171, lng: 101.7782 } },
      { code: 'qinghai_haidong', name: '海东市', center: { lat: 36.5071, lng: 102.1082 } },
      { code: 'qinghai_haibei', name: '海北州', center: { lat: 37.0071, lng: 100.8682 } },
      { code: 'qinghai_huangnan', name: '黄南州', center: { lat: 35.5171, lng: 102.0182 } },
      { code: 'qinghai_haixi', name: '海西州', center: { lat: 37.3771, lng: 97.3682 } },
      { code: 'qinghai_yushu', name: '玉树州', center: { lat: 32.9671, lng: 97.0082 } },
      { code: 'qinghai_guoluo', name: '果洛州', center: { lat: 34.4771, lng: 99.9882 } },
    ]
  },
  {
    code: 'ningxia',
    name: '宁夏回族自治区',
    center: { lat: 38.4680, lng: 106.2786 },
    bounds: { north: 39.5005, south: 35.1382, east: 109.5128, west: 104.1761 },
    children: [
      { code: 'ningxia_yinchuan', name: '银川市', center: { lat: 38.4680, lng: 106.2786 } },
      { code: 'ningxia_shizuishan', name: '石嘴山市', center: { lat: 39.2380, lng: 106.3786 } },
      { code: 'ningxia_wuzhong', name: '吴忠市', center: { lat: 37.9980, lng: 106.1986 } },
      { code: 'ningxia_guyuan', name: '固原市', center: { lat: 36.0080, lng: 106.2886 } },
      { code: 'ningxia_zhongwei', name: '中卫市', center: { lat: 37.4880, lng: 105.1886 } },
    ]
  },
  {
    code: 'xinjiang',
    name: '新疆维吾尔自治区',
    center: { lat: 43.7929, lng: 87.6278 },
    bounds: { north: 49.2141, south: 34.5246, east: 96.0371, west: 73.4974 },
    children: [
      { code: 'xinjiang_urumqi', name: '乌鲁木齐市', center: { lat: 43.7929, lng: 87.6278 } },
      { code: 'xinjiang_karamay', name: '克拉玛依市', center: { lat: 45.5929, lng: 84.8878 } },
      { code: 'xinjiang_turpan', name: '吐鲁番市', center: { lat: 42.9529, lng: 89.1878 } },
      { code: 'xinjiang_hami', name: '哈密市', center: { lat: 42.8329, lng: 93.4578 } },
      { code: 'xinjiang_changji', name: '昌吉州', center: { lat: 44.0129, lng: 87.3078 } },
      { code: 'xinjiang_bayannur', name: '巴音郭楞州', center: { lat: 41.7629, lng: 86.1578 } },
      { code: 'xinjiang_aksu', name: '阿克苏地区', center: { lat: 41.1629, lng: 80.2678 } },
      { code: 'xinjiang_kizilsu', name: '克州', center: { lat: 39.7129, lng: 75.9878 } },
      { code: 'xinjiang_kashgar', name: '喀什地区', center: { lat: 39.4329, lng: 75.9878 } },
      { code: 'xinjiang_hotan', name: '和田地区', center: { lat: 37.1229, lng: 79.9278 } },
      { code: 'xinjiang_ili', name: '伊犁州', center: { lat: 43.9229, lng: 81.3278 } },
      { code: 'xinjiang_tacheng', name: '塔城地区', center: { lat: 46.4029, lng: 82.9878 } },
      { code: 'xinjiang_altay', name: '阿勒泰地区', center: { lat: 47.8429, lng: 88.6478 } },
    ]
  },
  {
    code: 'taiwan',
    name: '台湾省',
    center: { lat: 23.6978, lng: 120.9605 },
    bounds: { north: 25.3043, south: 21.8945, east: 121.9737, west: 119.5373 },
    children: [
      { code: 'taiwan_taipei', name: '台北市', center: { lat: 25.0330, lng: 121.5654 } },
      { code: 'taiwan_taichung', name: '台中市', center: { lat: 24.1477, lng: 120.6736 } },
      { code: 'taiwan_kaohsiung', name: '高雄市', center: { lat: 22.6228, lng: 120.3014 } },
      { code: 'taiwan_tainan', name: '台南市', center: { lat: 22.9997, lng: 120.2270 } },
      { code: 'taiwan_keelung', name: '基隆市', center: { lat: 25.1276, lng: 121.7405 } },
      { code: 'taiwan_hsinchu', name: '新竹市', center: { lat: 24.8138, lng: 120.9675 } },
      { code: 'taiwan_chiayi', name: '嘉义市', center: { lat: 23.4794, lng: 120.4515 } },
    ]
  },
  {
    code: 'hongkong',
    name: '香港特别行政区',
    center: { lat: 22.3193, lng: 114.1694 },
    bounds: { north: 22.5170, south: 22.1501, east: 114.4379, west: 113.8351 },
  },
  {
    code: 'macau',
    name: '澳门特别行政区',
    center: { lat: 22.1987, lng: 113.5439 },
    bounds: { north: 22.2170, south: 22.1501, east: 113.6439, west: 113.5239 },
  },
  {
    code: 'neimenggu',
    name: '内蒙古自治区',
    center: { lat: 40.8182, lng: 111.6509 },
    bounds: { north: 53.3955, south: 37.2410, east: 126.0371, west: 97.1289 },
    children: [
      { code: 'neimenggu_hohhot', name: '呼和浩特市', center: { lat: 40.8182, lng: 111.6509 } },
      { code: 'neimenggu_baotou', name: '包头市', center: { lat: 40.6582, lng: 109.8309 } },
      { code: 'neimenggu_wuhai', name: '乌海市', center: { lat: 39.6682, lng: 106.8209 } },
      { code: 'neimenggu_chifeng', name: '赤峰市', center: { lat: 42.2682, lng: 118.9609 } },
      { code: 'neimenggu_tongliao', name: '通辽市', center: { lat: 43.6082, lng: 122.2609 } },
      { code: 'neimenggu_xing\'an', name: '兴安盟', center: { lat: 46.4282, lng: 122.0709 } },
      { code: 'neimenggu_hulunbuir', name: '呼伦贝尔市', center: { lat: 49.2182, lng: 119.7609 } },
      { code: 'neimenggu_ordos', name: '鄂尔多斯市', center: { lat: 39.6082, lng: 109.7809 } },
      { code: 'neimenggu_bayannur', name: '巴彦淖尔市', center: { lat: 41.6782, lng: 107.4909 } },
      { code: 'neimenggu_wulanchabu', name: '乌兰察布市', center: { lat: 41.0082, lng: 113.1209 } },
      { code: 'neimenggu_xilin', name: '锡林郭勒盟', center: { lat: 43.9582, lng: 115.9809 } },
      { code: 'neimenggu_alxa', name: '阿拉善盟', center: { lat: 38.8282, lng: 105.7209 } },
    ]
  },
  {
    code: 'jilin',
    name: '吉林省',
    center: { lat: 43.8171, lng: 125.3235 },
    bounds: { north: 46.8859, south: 40.1161, east: 131.1161, west: 121.7161 },
    children: [
      { code: 'jilin_changchun', name: '长春市', center: { lat: 43.8171, lng: 125.3235 } },
      { code: 'jilin_jilin', name: '吉林市', center: { lat: 43.8471, lng: 126.5735 } },
      { code: 'jilin_siping', name: '四平市', center: { lat: 43.1671, lng: 124.3735 } },
      { code: 'jilin_liaoyuan', name: '辽源市', center: { lat: 42.9071, lng: 125.1435 } },
      { code: 'jilin_tonghua', name: '通化市', center: { lat: 41.7271, lng: 125.9335 } },
      { code: 'jilin_baishan', name: '白山市', center: { lat: 41.9371, lng: 126.4335 } },
      { code: 'jilin_baicheng', name: '白城市', center: { lat: 45.6271, lng: 122.8335 } },
      { code: 'jilin_yanbian', name: '延边州', center: { lat: 42.8871, lng: 129.4735 } },
    ]
  },
  {
    code: 'liaoning',
    name: '辽宁省',
    center: { lat: 41.8045, lng: 123.4328 },
    bounds: { north: 43.2613, south: 38.7300, east: 125.1161, west: 118.4027 },
    children: [
      { code: 'liaoning_shenyang', name: '沈阳市', center: { lat: 41.8045, lng: 123.4328 } },
      { code: 'liaoning_dalian', name: '大连市', center: { lat: 38.9145, lng: 121.6147 } },
      { code: 'liaoning_anshan', name: '鞍山市', center: { lat: 41.1245, lng: 122.9928 } },
      { code: 'liaoning_fushun', name: '抚顺市', center: { lat: 41.8645, lng: 124.9328 } },
      { code: 'liaoning_benxi', name: '本溪市', center: { lat: 41.2945, lng: 123.7728 } },
      { code: 'liaoning_dandong', name: '丹东市', center: { lat: 40.1345, lng: 124.3828 } },
      { code: 'liaoning_liaoyang', name: '辽阳市', center: { lat: 41.2745, lng: 123.1828 } },
      { code: 'liaoning_panjin', name: '盘锦市', center: { lat: 41.1245, lng: 122.0728 } },
      { code: 'liaoning_tieling', name: '铁岭市', center: { lat: 42.2845, lng: 123.8528 } },
      { code: 'liaoning_chaoyang', name: '朝阳市', center: { lat: 41.5345, lng: 120.4428 } },
    ]
  },
  {
    code: 'heilongjiang',
    name: '黑龙江省',
    center: { lat: 45.8038, lng: 126.5349 },
    bounds: { north: 53.5538, south: 43.4238, east: 135.0842, west: 121.1161 },
    children: [
      { code: 'heilongjiang_harbin', name: '哈尔滨市', center: { lat: 45.8038, lng: 126.5349 } },
      { code: 'heilongjiang_qiqihar', name: '齐齐哈尔市', center: { lat: 47.3438, lng: 123.9649 } },
      { code: 'heilongjiang_daqing', name: '大庆市', center: { lat: 46.5838, lng: 125.0949 } },
      { code: 'heilongjiang_yichun', name: '伊春市', center: { lat: 47.7238, lng: 130.9649 } },
      { code: 'heilongjiang_jiamusi', name: '佳木斯市', center: { lat: 46.5838, lng: 130.3549 } },
      { code: 'heilongjiang_mudanjiang', name: '牡丹江市', center: { lat: 44.5838, lng: 129.5849 } },
      { code: 'heilongjiang_hegang', name: '鹤岗市', center: { lat: 47.3538, lng: 130.2849 } },
      { code: 'heilongjiang_suihua', name: '绥化市', center: { lat: 46.6338, lng: 126.9849 } },
      { code: 'heilongjiang_daxinganling', name: '大兴安岭地区', center: { lat: 50.4138, lng: 124.7249 } },
    ]
  },
];

// 获取国家列表
export function getCountries() {
  return [
    { code: 'china', name: '中国' },
  ];
}

// 获取省份列表
export function getProvinces() {
  return chinaProvinces.map(p => ({
    code: p.code,
    name: p.name
  }));
}

// 获取城市列表
export function getCitiesByProvince(provinceCode: string) {
  const province = chinaProvinces.find(p => p.code === provinceCode);
  if (!province || !province.children) return [];
  return province.children.map(c => ({
    code: c.code,
    name: c.name
  }));
}

// 获取区县列表
export function getDistrictsByCity(cityCode: string) {
  for (const province of chinaProvinces) {
    if (province.children) {
      const city = province.children.find(c => c.code === cityCode);
      if (city && city.children) {
        return city.children.map(d => ({
          code: d.code,
          name: d.name
        }));
      }
    }
  }
  return [];
}

// 获取行政区划中心坐标
export function getDivisionCenter(code: string): { lat: number; lng: number } | null {
  // 查找省份
  let division = chinaProvinces.find(p => p.code === code);
  if (division) return division.center;

  // 查找市级
  for (const province of chinaProvinces) {
    if (province.children) {
      division = province.children.find(c => c.code === code);
      if (division) return division.center;
    }
  }

  // 查找县级
  for (const province of chinaProvinces) {
    if (province.children) {
      for (const city of province.children) {
        if (city.children) {
          division = city.children.find(d => d.code === code);
          if (division) return division.center;
        }
      }
    }
  }

  return null;
}

// 获取行政区划边界
export function getDivisionBounds(code: string) {
  // 查找省份
  let division = chinaProvinces.find(p => p.code === code);
  if (division) return division.bounds;

  // 查找市级
  for (const province of chinaProvinces) {
    if (province.children) {
      division = province.children.find(c => c.code === code);
      if (division) return division.bounds;
    }
  }

  // 查找县级
  for (const province of chinaProvinces) {
    if (province.children) {
      for (const city of province.children) {
        if (city.children) {
          division = city.children.find(d => d.code === code);
          if (division) return division.bounds;
        }
      }
    }
  }

  return null;
}
