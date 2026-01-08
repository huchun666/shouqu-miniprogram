// services/vehicle.js - 车辆服务
import { get, post, put } from '../utils/request';
import { API_ENDPOINTS } from '../constants/index';

/**
 * 获取车辆列表
 */
export const getVehicleList = () => {
  return get(API_ENDPOINTS.VEHICLE_LIST);
};

/**
 * 获取车辆信息
 */
export const getVehicleInfo = (vehicleId) => {
  return get(API_ENDPOINTS.VEHICLE_INFO, { vehicleId });
};

/**
 * 获取车辆实时状态
 */
export const getVehicleStatus = (vehicleId) => {
  return get(API_ENDPOINTS.VEHICLE_STATUS, { vehicleId });
};

/**
 * 连接车辆
 */
export const connectVehicle = (vehicleId) => {
  return post(API_ENDPOINTS.VEHICLE_CONNECT, { vehicleId });
};

/**
 * 断开车辆连接
 */
export const disconnectVehicle = (vehicleId) => {
  return post(API_ENDPOINTS.VEHICLE_DISCONNECT, { vehicleId });
};

/**
 * 远程解锁
 */
export const unlockVehicle = (vehicleId) => {
  return post(API_ENDPOINTS.VEHICLE_UNLOCK, { vehicleId });
};

/**
 * 远程锁定
 */
export const lockVehicle = (vehicleId) => {
  return post(API_ENDPOINTS.VEHICLE_LOCK, { vehicleId });
};

/**
 * 启动车辆
 */
export const startVehicle = (vehicleId) => {
  return post(API_ENDPOINTS.VEHICLE_START, { vehicleId });
};

/**
 * 停止车辆
 */
export const stopVehicle = (vehicleId) => {
  return post(API_ENDPOINTS.VEHICLE_STOP, { vehicleId });
};

/**
 * 寻车（车辆鸣笛/闪灯）
 */
export const findVehicle = (vehicleId) => {
  return post(API_ENDPOINTS.VEHICLE_FIND, { vehicleId });
};

/**
 * 获取车辆位置
 */
export const getVehicleLocation = (vehicleId) => {
  return get(API_ENDPOINTS.VEHICLE_LOCATION, { vehicleId });
};

/**
 * 获取车辆设置
 */
export const getVehicleSettings = (vehicleId) => {
  return get(API_ENDPOINTS.VEHICLE_SETTINGS, { vehicleId });
};

/**
 * 更新车辆设置
 */
export const updateVehicleSettings = (vehicleId, settings) => {
  return put(API_ENDPOINTS.VEHICLE_SETTINGS_UPDATE, {
    vehicleId,
    ...settings
  });
};

/**
 * 开启/关闭大灯
 */
export const toggleHeadlight = (vehicleId, enabled, brightness = 50) => {
  return updateVehicleSettings(vehicleId, {
    headlight: {
      enabled,
      brightness
    }
  });
};

/**
 * 设置定速巡航
 */
export const setCruiseControl = (vehicleId, enabled, speed = 25) => {
  return updateVehicleSettings(vehicleId, {
    cruiseControl: {
      enabled,
      speed
    }
  });
};

/**
 * 设置坐垫感应
 */
export const setSeatSensor = (vehicleId, enabled) => {
  return updateVehicleSettings(vehicleId, {
    seatSensor: {
      enabled
    }
  });
};

export default {
  getVehicleList,
  getVehicleInfo,
  getVehicleStatus,
  connectVehicle,
  disconnectVehicle,
  unlockVehicle,
  lockVehicle,
  startVehicle,
  stopVehicle,
  findVehicle,
  getVehicleLocation,
  getVehicleSettings,
  updateVehicleSettings,
  toggleHeadlight,
  setCruiseControl,
  setSeatSensor
};
