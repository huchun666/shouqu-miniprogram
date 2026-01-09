// utils/navigation.js - 导航工具函数
import { showToast } from './ui';

/**
 * 选择目的地（使用微信地图选点）
 */
export const chooseDestination = () => {
  return new Promise((resolve, reject) => {
    // 先尝试获取当前位置（用于地图选点时的初始位置）
    wx.getLocation({
      type: 'gcj02',
      success: (locationRes) => {
        // 获取位置成功后，打开选点界面
        wx.chooseLocation({
          latitude: locationRes.latitude,
          longitude: locationRes.longitude,
          success: (res) => {
            resolve({
              latitude: res.latitude,
              longitude: res.longitude,
              name: res.name,
              address: res.address
            });
          },
          fail: (error) => {
            console.error('chooseLocation失败:', error);
            reject(error);
          }
        });
      },
      fail: (locationError) => {
        console.error('getLocation失败:', locationError);
        // 即使获取位置失败，也尝试打开选点界面（可能用户会手动选择）
        wx.chooseLocation({
          success: (res) => {
            resolve({
              latitude: res.latitude,
              longitude: res.longitude,
              name: res.name,
              address: res.address
            });
          },
          fail: (error) => {
            console.error('chooseLocation失败:', error);
            reject(error);
          }
        });
      }
    });
  });
};

/**
 * 计算两点间距离（米）
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * 计算方向角
 */
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = 
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
};

/**
 * 获取方向描述
 */
export const getDirectionText = (bearing) => {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

/**
 * 格式化距离
 */
export const formatDistance = (distance) => {
  if (distance < 1000) {
    return `${Math.round(distance)}米`;
  } else {
    return `${(distance / 1000).toFixed(1)}公里`;
  }
};

/**
 * 格式化时间
 */
export const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分钟`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`;
  }
};

/**
 * 路线规划（实际应该调用地图API）
 */
export const planRoute = async (start, end) => {
  // ============================================
  // 方案1：使用腾讯地图API（推荐）
  // ============================================
  /*
  // 1. 首先需要安装腾讯地图SDK
  // npm install qqmap-wx-jssdk
  // 或下载 https://mapapi.qq.com/web/miniprogram/QQMapWX-JSSDK.zip
  
  // 2. 在页面或工具文件中引入
  // import QQMapWX from '../../libs/qqmap-wx-jssdk';
  
  // 3. 初始化（需要申请腾讯地图Key）
  const qqmapsdk = new QQMapWX({
    key: 'YOUR_TENCENT_MAP_KEY' // 替换为你的腾讯地图Key
  });
  
  try {
    // 4. 调用路线规划API
    const result = await new Promise((resolve, reject) => {
      qqmapsdk.direction({
        mode: 'driving', // 驾车模式，可选：driving(驾车)、walking(步行)、bicycling(骑行)
        from: `${start.latitude},${start.longitude}`, // 起点坐标
        to: `${end.latitude},${end.longitude}`, // 终点坐标
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
    
    // 5. 解析返回的路线数据
    if (result.result && result.result.routes && result.result.routes.length > 0) {
      const route = result.result.routes[0]; // 取第一条路线
      const distance = route.distance; // 总距离（米）
      const duration = route.duration; // 预计时间（秒）
      
      // 解析路线点
      const routePoints = [];
      if (route.steps && route.steps.length > 0) {
        route.steps.forEach((step, index) => {
          routePoints.push({
            latitude: step.start_location.lat,
            longitude: step.start_location.lng,
            instruction: step.instruction || step.road_name || '继续行驶',
            distance: step.distance || 0,
            direction: step.act_desc || 'straight', // 方向：直行、左转、右转等
            stepIndex: index
          });
        });
      }
      
      // 添加终点
      routePoints.push({
        latitude: end.latitude,
        longitude: end.longitude,
        instruction: '到达目的地',
        distance: distance,
        stepIndex: routePoints.length
      });
      
      return {
        distance,
        estimatedTime: Math.round(duration / 60), // 转换为分钟
        route: routePoints,
        polyline: route.polyline, // 路线坐标串（用于绘制路线）
        tollDistance: route.toll_distance || 0, // 收费路段距离
        tolls: route.tolls || 0 // 过路费
      };
    } else {
      throw new Error('未找到路线');
    }
  } catch (error) {
    console.error('腾讯地图路线规划失败', error);
    // 失败时返回模拟数据
    return getMockRoute(start, end);
  }
  */
  
  // ============================================
  // 方案2：使用HTTP请求调用腾讯地图API
  // ============================================
  /*
  // 使用微信小程序的 request API 直接调用
  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: 'https://apis.map.qq.com/ws/direction/v1/driving/',
        method: 'GET',
        data: {
          key: 'YOUR_TENCENT_MAP_KEY', // 替换为你的Key
          from: `${start.latitude},${start.longitude}`,
          to: `${end.latitude},${end.longitude}`,
          output: 'json'
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.status === 0) {
            resolve(res.data);
          } else {
            reject(new Error(res.data.message || '路线规划失败'));
          }
        },
        fail: reject
      });
    });
    
    // 解析数据（同方案1）
    if (response.result && response.result.routes && response.result.routes.length > 0) {
      const route = response.result.routes[0];
      // ... 解析逻辑同方案1
    }
  } catch (error) {
    console.error('路线规划失败', error);
    return getMockRoute(start, end);
  }
  */
  
  // ============================================
  // 方案3：使用高德地图API（备选方案）
  // ============================================
  /*
  // 高德地图路线规划API
  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: 'https://restapi.amap.com/v3/direction/driving',
        method: 'GET',
        data: {
          key: 'YOUR_AMAP_KEY', // 替换为你的高德地图Key
          origin: `${start.longitude},${start.latitude}`, // 注意：高德是经度在前
          destination: `${end.longitude},${end.latitude}`,
          extensions: 'all' // 返回详细信息
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.status === '1') {
            resolve(res.data);
          } else {
            reject(new Error(res.data.info || '路线规划失败'));
          }
        },
        fail: reject
      });
    });
    
    // 解析高德地图返回数据
    if (response.route && response.route.paths && response.route.paths.length > 0) {
      const path = response.route.paths[0];
      const distance = path.distance; // 距离（米）
      const duration = path.duration; // 时间（秒）
      
      // 解析步骤
      const routePoints = [];
      if (path.steps && path.steps.length > 0) {
        path.steps.forEach((step, index) => {
          const location = step.polyline.split(';')[0].split(',');
          routePoints.push({
            latitude: parseFloat(location[1]),
            longitude: parseFloat(location[0]),
            instruction: step.instruction || '继续行驶',
            distance: step.distance || 0,
            direction: step.action || 'straight',
            stepIndex: index
          });
        });
      }
      
      return {
        distance: parseInt(distance),
        estimatedTime: Math.round(parseInt(duration) / 60),
        route: routePoints,
        polyline: path.polyline
      };
    }
  } catch (error) {
    console.error('高德地图路线规划失败', error);
    return getMockRoute(start, end);
  }
  */
  
  // ============================================
  // 当前实现：模拟数据（开发测试用）
  // ============================================
  const distance = calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude);
  const estimatedTime = Math.round(distance / 15); // 假设平均速度15m/s（约54km/h）
  
  return {
    distance,
    estimatedTime,
    route: [
      {
        latitude: start.latitude,
        longitude: start.longitude,
        instruction: '起点',
        distance: 0,
        stepIndex: 0
      },
      {
        latitude: end.latitude,
        longitude: end.longitude,
        instruction: '终点',
        distance: distance,
        stepIndex: 1
      }
    ]
  };
};

/**
 * 获取模拟路线（用于API调用失败时的降级方案）
 */
function getMockRoute(start, end) {
  const distance = calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude);
  const estimatedTime = Math.round(distance / 15);
  
  return {
    distance,
    estimatedTime,
    route: [
      {
        latitude: start.latitude,
        longitude: start.longitude,
        instruction: '起点',
        distance: 0,
        stepIndex: 0
      },
      {
        latitude: end.latitude,
        longitude: end.longitude,
        instruction: '终点',
        distance: distance,
        stepIndex: 1
      }
    ]
  };
}

export default {
  chooseDestination,
  calculateDistance,
  calculateBearing,
  getDirectionText,
  formatDistance,
  formatTime,
  planRoute
};
