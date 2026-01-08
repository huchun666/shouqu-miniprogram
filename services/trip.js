// services/trip.js - 行程服务
import { get } from '../utils/request';
import { API_ENDPOINTS } from '../constants/index';

/**
 * 获取行程列表
 */
export const getTripList = (params = {}) => {
  const { page = 1, pageSize = 20, vehicleId, startDate, endDate } = params;
  return get(API_ENDPOINTS.TRIP_LIST, {
    page,
    pageSize,
    vehicleId,
    startDate,
    endDate
  });
};

/**
 * 获取行程详情
 */
export const getTripDetail = (tripId) => {
  return get(API_ENDPOINTS.TRIP_DETAIL, { tripId });
};

/**
 * 获取行程统计
 */
export const getTripStatistics = (params = {}) => {
  const { vehicleId, startDate, endDate, period = 'month' } = params;
  return get(API_ENDPOINTS.TRIP_STATISTICS, {
    vehicleId,
    startDate,
    endDate,
    period
  });
};

export default {
  getTripList,
  getTripDetail,
  getTripStatistics
};
