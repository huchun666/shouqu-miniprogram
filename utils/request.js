// utils/request.js - 网络请求封装
import { getToken, clearToken } from './storage';
import { showToast } from './ui';
import { logger } from './logger';

// API地址配置
// 开发环境：使用Mock服务器
// 生产环境：使用实际API地址
// 如果需要切换环境，请修改下面的 BASE_URL

// 开发环境 - Mock服务器（本地开发）
const BASE_URL = 'http://localhost:3000';

// 生产环境 - 实际API服务器（部署时使用）
// const BASE_URL = 'https://api.example.com';

// 真机调试 - 使用局域网IP（替换为你的电脑IP）
// const BASE_URL = 'http://192.168.1.100:3000';

// 真机调试 - 使用内网穿透（如ngrok）
// const BASE_URL = 'https://your-ngrok-url.ngrok.io';

/**
 * 请求拦截器
 */
const requestInterceptor = (config) => {
  // 添加token
  const token = getToken();
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    };
  }

  // 添加通用header
  config.header = {
    ...config.header,
    'Content-Type': 'application/json',
    'X-Platform': 'miniprogram',
    'X-Version': '1.0.0'
  };

  // 记录请求日志
  logger.info('Request', {
    url: config.url,
    method: config.method,
    data: config.data
  });

  return config;
};

/**
 * 响应拦截器
 */
const responseInterceptor = (response) => {
  const { statusCode, data } = response;

  // 记录响应日志
  logger.info('Response', {
    url: response.config?.url,
    statusCode,
    data
  });

  // HTTP状态码处理
  if (statusCode === 200) {
    // 业务状态码处理
    if (data.code === 0 || data.success) {
      return data.data || data;
    } else {
      // 业务错误
      handleBusinessError(data);
      return Promise.reject(new Error(data.message || '请求失败'));
    }
  } else if (statusCode === 401) {
    // 未授权，清除token并跳转登录
    clearToken();
    wx.reLaunch({
      url: '/pages/login/login'
    });
    return Promise.reject(new Error('未授权，请重新登录'));
  } else if (statusCode >= 500) {
    // 服务器错误
    showToast('服务器错误，请稍后重试');
    return Promise.reject(new Error('服务器错误'));
  } else {
    // 其他错误
    showToast('网络错误，请稍后重试');
    return Promise.reject(new Error('网络错误'));
  }
};

/**
 * 处理业务错误
 */
const handleBusinessError = (data) => {
  const errorCode = data.code;
  const errorMessage = data.message || '操作失败';

  // 根据错误码处理不同情况
  switch (errorCode) {
    case 1001:
      showToast('车辆未连接');
      break;
    case 1002:
      showToast('车辆离线');
      break;
    case 1003:
      showToast('操作超时');
      break;
    default:
      showToast(errorMessage);
  }
};

/**
 * 通用请求方法
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    const config = {
      url: options.url.startsWith('http') ? options.url : `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {},
      timeout: options.timeout || 10000,
      ...options
    };

    // 请求拦截
    const interceptedConfig = requestInterceptor(config);

    wx.request({
      ...interceptedConfig,
      success: (res) => {
        try {
          const result = responseInterceptor(res);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      fail: (error) => {
        logger.error('Request Failed', error);
        showToast('网络连接失败');
        reject(error);
      }
    });
  });
};

/**
 * GET请求
 */
export const get = (url, params = {}, options = {}) => {
  // 将params拼接到url
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  return request({
    url: fullUrl,
    method: 'GET',
    ...options
  });
};

/**
 * POST请求
 */
export const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
};

/**
 * PUT请求
 */
export const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
};

/**
 * DELETE请求
 */
export const del = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
};

/**
 * 初始化请求模块
 */
export const initRequest = () => {
  console.log('Request module initialized');
};

export default {
  get,
  post,
  put,
  delete: del,
  request
};
