// pages/vehicle/status/status.js - 车辆状态页面
import { vehicleStore } from '../../../stores/vehicle';
import { showLoading, hideLoading } from '../../../utils/ui';
import { formatBattery, formatDistance, formatSpeed } from '../../../utils/format';

Page({
  data: {
    vehicle: null,
    status: null,
    isConnected: false,
    isOnline: false
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.refreshStatus();
  },

  onUnload() {
    // 停止状态更新
    vehicleStore.stopStatusPolling();
  },

  /**
   * 初始化页面
   */
  initPage() {
    const state = vehicleStore.getState();
    this.setData({
      vehicle: state.currentVehicle,
      isConnected: state.isConnected,
      isOnline: state.isOnline
    });
    
    if (state.vehicleStatus) {
      this.setData({ status: state.vehicleStatus });
    }
  },

  /**
   * 刷新状态
   */
  async refreshStatus() {
    const state = vehicleStore.getState();
    if (state.currentVehicle && state.isConnected) {
      try {
        showLoading('加载中...');
        await vehicleStore.getVehicleStatus(state.currentVehicle.id);
        const newState = vehicleStore.getState();
        if (newState.vehicleStatus) {
          this.setData({
            status: newState.vehicleStatus,
            isOnline: newState.isOnline
          });
        }
      } catch (error) {
        console.error('刷新状态失败', error);
      } finally {
        hideLoading();
      }
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.refreshStatus().finally(() => {
      wx.stopPullDownRefresh();
    });
  }
});
