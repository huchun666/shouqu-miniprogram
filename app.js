// app.js
import { initStore } from './stores/index';
import { initRequest } from './utils/request';
import { initLogger } from './utils/logger';
import { checkUpdate } from './utils/update';

App({
  onLaunch(options) {
    console.log('App Launch', options);
    
    // 初始化日志系统
    initLogger();
    
    // 初始化状态管理
    initStore();
    
    // 初始化网络请求
    initRequest();
    
    // 检查小程序更新
    checkUpdate();
    
    // 初始化用户信息
    this.initUser();
    
    // 初始化车辆连接
    this.initVehicle();
  },

  onShow(options) {
    console.log('App Show', options);
  },

  onHide() {
    console.log('App Hide');
  },

  onError(msg) {
    console.error('App Error', msg);
    // 错误上报
    this.reportError(msg);
  },

  /**
   * 初始化用户信息
   */
  async initUser() {
    try {
      const { userStore } = require('./stores/user');
      await userStore.getUserInfo();
    } catch (error) {
      console.error('初始化用户信息失败', error);
    }
  },

  /**
   * 初始化车辆连接
   */
  async initVehicle() {
    try {
      const { vehicleStore } = require('./stores/vehicle');
      await vehicleStore.initConnection();
    } catch (error) {
      console.error('初始化车辆连接失败', error);
    }
  },

  /**
   * 错误上报
   */
  reportError(error) {
    // TODO: 实现错误上报逻辑
    console.error('Error Report:', error);
  },

  globalData: {
    userInfo: null,
    vehicleInfo: null,
    systemInfo: null
  }
});
