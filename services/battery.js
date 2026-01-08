// services/battery.js - 电池服务
import { get } from '../utils/request';
import { API_ENDPOINTS } from '../constants/index';

/**
 * 获取电池信息
 */
export const getBatteryInfo = (vehicleId) => {
  return get(API_ENDPOINTS.BATTERY_INFO, { vehicleId });
};

/**
 * 获取电池健康度
 */
export const getBatteryHealth = (vehicleId) => {
  return get(API_ENDPOINTS.BATTERY_HEALTH, { vehicleId });
};

export default {
  getBatteryInfo,
  getBatteryHealth
};
