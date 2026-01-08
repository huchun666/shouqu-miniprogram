// utils/icon-helper.js - 图标辅助工具
/**
 * 图标路径统一管理
 * 如果图标资源未准备好，可以使用占位方案
 */

// 图标基础路径
const ICON_BASE_PATH = '/assets/icons';

/**
 * 获取图标路径
 * @param {string} iconName - 图标名称（不含扩展名）
 * @param {string} extension - 文件扩展名，默认 'png'
 * @returns {string} 图标完整路径
 */
export const getIconPath = (iconName, extension = 'png') => {
  return `${ICON_BASE_PATH}/${iconName}.${extension}`;
};

/**
 * 图标路径映射
 * 如果图标不存在，可以返回占位图标或使用字体图标
 */
export const ICONS = {
  // TabBar图标
  HOME: getIconPath('home'),
  HOME_ACTIVE: getIconPath('home-active'),
  TRIP: getIconPath('trip'),
  TRIP_ACTIVE: getIconPath('trip-active'),
  COMMUNITY: getIconPath('community'),
  COMMUNITY_ACTIVE: getIconPath('community-active'),
  PROFILE: getIconPath('profile'),
  PROFILE_ACTIVE: getIconPath('profile-active'),
  
  // 功能图标
  UNLOCK: getIconPath('unlock'),
  LOCK: getIconPath('lock'),
  START: getIconPath('start'),
  STOP: getIconPath('stop'),
  FIND: getIconPath('find'),
  CONTROL: getIconPath('control'),
  STATUS: getIconPath('status'),
  BATTERY: getIconPath('battery'),
  SETTINGS: getIconPath('settings'),
  HEADLIGHT: getIconPath('headlight'),
  CRUISE: getIconPath('cruise'),
  SEAT: getIconPath('seat'),
  MAP: getIconPath('map'),
  MARKER: getIconPath('marker'),
  LOCATION_START: getIconPath('location-start'),
  LOCATION_END: getIconPath('location-end'),
  STORE: getIconPath('store'),
  REPAIR: getIconPath('repair'),
  LIST: getIconPath('list'),
  VEHICLE: getIconPath('vehicle'),
  ABOUT: getIconPath('about'),
  AVATAR_DEFAULT: getIconPath('avatar-default')
};

/**
 * 检查图标是否存在（小程序中无法直接检查，此方法用于开发时提示）
 * @param {string} iconPath - 图标路径
 * @returns {boolean} 总是返回true，实际检查需要手动验证
 */
export const checkIconExists = (iconPath) => {
  // 小程序中无法直接检查文件是否存在
  // 此方法主要用于开发时的类型检查
  return true;
};

export default {
  getIconPath,
  ICONS,
  checkIconExists
};
