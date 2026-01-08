// utils/storage.js - 本地存储封装
const TOKEN_KEY = 'token';
const USER_INFO_KEY = 'userInfo';
const VEHICLE_INFO_KEY = 'vehicleInfo';
const SETTINGS_KEY = 'settings';

/**
 * 存储数据
 */
export const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value);
    return true;
  } catch (error) {
    console.error('Storage set error:', error);
    return false;
  }
};

/**
 * 获取数据
 */
export const getStorage = (key, defaultValue = null) => {
  try {
    const value = wx.getStorageSync(key);
    return value !== '' ? value : defaultValue;
  } catch (error) {
    console.error('Storage get error:', error);
    return defaultValue;
  }
};

/**
 * 删除数据
 */
export const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (error) {
    console.error('Storage remove error:', error);
    return false;
  }
};

/**
 * 清空所有数据
 */
export const clearStorage = () => {
  try {
    wx.clearStorageSync();
    return true;
  } catch (error) {
    console.error('Storage clear error:', error);
    return false;
  }
};

/**
 * Token相关
 */
export const setToken = (token) => {
  return setStorage(TOKEN_KEY, token);
};

export const getToken = () => {
  return getStorage(TOKEN_KEY);
};

export const clearToken = () => {
  return removeStorage(TOKEN_KEY);
};

/**
 * 用户信息相关
 */
export const setUserInfo = (userInfo) => {
  return setStorage(USER_INFO_KEY, userInfo);
};

export const getUserInfo = () => {
  return getStorage(USER_INFO_KEY);
};

export const clearUserInfo = () => {
  return removeStorage(USER_INFO_KEY);
};

/**
 * 车辆信息相关
 */
export const setVehicleInfo = (vehicleInfo) => {
  return setStorage(VEHICLE_INFO_KEY, vehicleInfo);
};

export const getVehicleInfo = () => {
  return getStorage(VEHICLE_INFO_KEY);
};

export const clearVehicleInfo = () => {
  return removeStorage(VEHICLE_INFO_KEY);
};

/**
 * 设置相关
 */
export const setSettings = (settings) => {
  return setStorage(SETTINGS_KEY, settings);
};

export const getSettings = () => {
  return getStorage(SETTINGS_KEY, {});
};

export default {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  setToken,
  getToken,
  clearToken,
  setUserInfo,
  getUserInfo,
  clearUserInfo,
  setVehicleInfo,
  getVehicleInfo,
  clearVehicleInfo,
  setSettings,
  getSettings
};
