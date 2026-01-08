// types/index.js - 类型定义（用于文档和IDE提示）

/**
 * 用户信息
 */
export const UserInfo = {
  id: String,
  nickname: String,
  avatar: String,
  phone: String,
  email: String,
  createdAt: String
};

/**
 * 车辆信息
 */
export const VehicleInfo = {
  id: String,
  name: String,
  model: String,
  sn: String, // 序列号
  mac: String, // MAC地址
  firmwareVersion: String, // 固件版本
  isConnected: Boolean, // 是否连接
  isOnline: Boolean, // 是否在线
  lastOnlineTime: String, // 最后在线时间
  createdAt: String
};

/**
 * 车辆状态
 */
export const VehicleStatus = {
  battery: Number, // 电量 0-100
  range: Number, // 预估续航里程 km
  speed: Number, // 当前速度 km/h
  totalMileage: Number, // 总里程 km
  isLocked: Boolean, // 是否锁定
  isAlarmOn: Boolean, // 是否开启报警
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  temperature: Number, // 温度
  signal: Number, // 信号强度 0-100
  timestamp: String // 状态更新时间
};

/**
 * 行程记录
 */
export const TripRecord = {
  id: String,
  vehicleId: String,
  startTime: String,
  endTime: String,
  duration: Number, // 时长 秒
  distance: Number, // 距离 km
  averageSpeed: Number, // 平均速度 km/h
  maxSpeed: Number, // 最大速度 km/h
  startLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  endLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  path: Array, // 轨迹点数组
  createdAt: String
};

/**
 * 车辆设置
 */
export const VehicleSettings = {
  headlight: {
    enabled: Boolean,
    brightness: Number // 0-100
  },
  cruiseControl: {
    enabled: Boolean,
    speed: Number // 定速巡航速度 km/h
  },
  seatSensor: {
    enabled: Boolean // 坐垫感应开关
  },
  alarm: {
    enabled: Boolean,
    sensitivity: Number // 灵敏度 0-100
  },
  energyRecovery: {
    level: Number // 能量回收等级 0-3
  }
};

/**
 * 电池信息
 */
export const BatteryInfo = {
  level: Number, // 电量 0-100
  voltage: Number, // 电压 V
  current: Number, // 电流 A
  temperature: Number, // 温度 ℃
  health: Number, // 健康度 0-100
  cycleCount: Number, // 循环次数
  status: String, // 状态: charging, discharging, full, low
  estimatedRange: Number, // 预估续航 km
  chargingTime: Number, // 预计充电时间 分钟
  lastChargeTime: String // 上次充电时间
};

/**
 * API响应
 */
export const ApiResponse = {
  code: Number,
  message: String,
  data: Object,
  success: Boolean,
  timestamp: String
};

export default {
  UserInfo,
  VehicleInfo,
  VehicleStatus,
  TripRecord,
  VehicleSettings,
  BatteryInfo,
  ApiResponse
};
