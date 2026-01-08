// utils/ui.js - UI工具函数
/**
 * 显示Toast
 */
export const showToast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration,
    mask: true
  });
};

/**
 * 显示Loading
 */
export const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  });
};

/**
 * 隐藏Loading
 */
export const hideLoading = () => {
  wx.hideLoading();
};

/**
 * 显示Modal
 */
export const showModal = (options) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: options.title || '提示',
      content: options.content || '',
      showCancel: options.showCancel !== false,
      cancelText: options.cancelText || '取消',
      cancelColor: options.cancelColor || '#000000',
      confirmText: options.confirmText || '确定',
      confirmColor: options.confirmColor || '#576B95',
      success: (res) => {
        if (res.confirm) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * 显示ActionSheet
 */
export const showActionSheet = (itemList) => {
  return new Promise((resolve, reject) => {
    wx.showActionSheet({
      itemList,
      success: (res) => {
        resolve(res.tapIndex);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * 显示选择器
 */
export const showPicker = (options) => {
  return new Promise((resolve, reject) => {
    // 这里需要配合picker组件使用
    // 返回一个Promise，在picker的bindchange中resolve
    resolve(options);
  });
};

/**
 * 页面跳转
 */
export const navigateTo = (url, params = {}) => {
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  wx.navigateTo({
    url: fullUrl,
    fail: (error) => {
      console.error('Navigate error:', error);
      showToast('页面跳转失败');
    }
  });
};

/**
 * 页面重定向
 */
export const redirectTo = (url, params = {}) => {
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  wx.redirectTo({
    url: fullUrl,
    fail: (error) => {
      console.error('Redirect error:', error);
      showToast('页面跳转失败');
    }
  });
};

/**
 * 返回上一页
 */
export const navigateBack = (delta = 1) => {
  wx.navigateBack({
    delta
  });
};

/**
 * 切换到Tab页面
 */
export const switchTab = (url) => {
  wx.switchTab({
    url,
    fail: (error) => {
      console.error('Switch tab error:', error);
    }
  });
};

/**
 * 重新启动到指定页面
 */
export const reLaunch = (url, params = {}) => {
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  wx.reLaunch({
    url: fullUrl
  });
};

export default {
  showToast,
  showLoading,
  hideLoading,
  showModal,
  showActionSheet,
  showPicker,
  navigateTo,
  redirectTo,
  navigateBack,
  switchTab,
  reLaunch
};
