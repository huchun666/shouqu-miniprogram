// constants/index.js - 常量定义

/**
 * API端点
 */
export const API_ENDPOINTS = {
  // 用户相关
  USER_LOGIN: '/api/user/login',
  USER_INFO: '/api/user/info',
  USER_UPDATE: '/api/user/update',
  
  // 车辆相关
  VEHICLE_LIST: '/api/vehicle/list',
  VEHICLE_INFO: '/api/vehicle/info',
  VEHICLE_STATUS: '/api/vehicle/status',
  VEHICLE_CONNECT: '/api/vehicle/connect',
  VEHICLE_DISCONNECT: '/api/vehicle/disconnect',
  VEHICLE_UNLOCK: '/api/vehicle/unlock',
  VEHICLE_LOCK: '/api/vehicle/lock',
  VEHICLE_START: '/api/vehicle/start',
  VEHICLE_STOP: '/api/vehicle/stop',
  VEHICLE_FIND: '/api/vehicle/find',
  VEHICLE_LOCATION: '/api/vehicle/location',
  VEHICLE_SETTINGS: '/api/vehicle/settings',
  VEHICLE_SETTINGS_UPDATE: '/api/vehicle/settings/update',
  
  // 行程相关
  TRIP_LIST: '/api/trip/list',
  TRIP_DETAIL: '/api/trip/detail',
  TRIP_STATISTICS: '/api/trip/statistics',
  
  // 电池相关
  BATTERY_INFO: '/api/battery/info',
  BATTERY_HEALTH: '/api/battery/health',
  
  // 社区相关
  COMMUNITY_POSTS: '/api/community/posts',
  COMMUNITY_POST_DETAIL: '/api/community/post',
  COMMUNITY_POST_CREATE: '/api/community/post/create',
  
  // 服务相关
  SERVICE_STORES: '/api/service/stores',
  SERVICE_REPAIR: '/api/service/repair',
  SERVICE_REPAIR_LIST: '/api/service/repair/list'
};

/**
 * 错误码
 */
export const ERROR_CODES = {
  SUCCESS: 0,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  VEHICLE_NOT_CONNECTED: 1001,
  VEHICLE_OFFLINE: 1002,
  OPERATION_TIMEOUT: 1003,
  INVALID_PARAMS: 1004
};

/**
 * 车辆状态
 */
export const VEHICLE_STATUS = {
  OFFLINE: 'offline',
  ONLINE: 'online',
  CONNECTED: 'connected',
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  MOVING: 'moving',
  STATIONARY: 'stationary'
};

/**
 * 电池状态
 */
export const BATTERY_STATUS = {
  CHARGING: 'charging',
  DISCHARGING: 'discharging',
  FULL: 'full',
  LOW: 'low',
  CRITICAL: 'critical'
};

/**
 * 存储键
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  VEHICLE_INFO: 'vehicleInfo',
  SETTINGS: 'settings',
  TRIP_CACHE: 'tripCache'
};

/**
 * 页面路径
 */
export const PAGE_PATHS = {
  INDEX: '/pages/index/index',
  VEHICLE_CONTROL: '/pages/vehicle/control/control',
  VEHICLE_STATUS: '/pages/vehicle/status/status',
  VEHICLE_FIND: '/pages/vehicle/find/find',
  TRIP_RECORD: '/pages/trip/record/record',
  TRIP_DETAIL: '/pages/trip/detail/detail',
  SETTINGS_VEHICLE: '/pages/settings/vehicle/vehicle',
  NAVIGATION: '/pages/navigation/navigation',
  BATTERY: '/pages/battery/battery',
  COMMUNITY: '/pages/community/community',
  SERVICE: '/pages/service/service',
  PROFILE: '/pages/profile/profile'
};

export default {
  API_ENDPOINTS,
  ERROR_CODES,
  VEHICLE_STATUS,
  BATTERY_STATUS,
  STORAGE_KEYS,
  PAGE_PATHS
};
