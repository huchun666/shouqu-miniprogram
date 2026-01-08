// services/user.js - 用户服务
import { get, post, put } from '../utils/request';
import { API_ENDPOINTS } from '../constants/index';

/**
 * 用户登录
 */
export const login = (code) => {
  return post(API_ENDPOINTS.USER_LOGIN, { code });
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return get(API_ENDPOINTS.USER_INFO);
};

/**
 * 更新用户信息
 */
export const updateUserInfo = (userInfo) => {
  return put(API_ENDPOINTS.USER_UPDATE, userInfo);
};

export default {
  login,
  getUserInfo,
  updateUserInfo
};
