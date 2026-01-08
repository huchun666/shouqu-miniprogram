// pages/battery/battery.js - 电池管理页面
import { getBatteryInfo, getBatteryHealth } from '../../services/battery';
import { vehicleStore } from '../../stores/vehicle';
import { showLoading, hideLoading, showToast } from '../../utils/ui';

Page({
  data: {
    vehicle: null,
    isConnected: false,
    batteryInfo: null,
    batteryHealth: null
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.loadBatteryData();
  },

  /**
   * 初始化页面
   */
  initPage() {
    const state = vehicleStore.getState();
    this.setData({
      vehicle: state.currentVehicle,
      isConnected: state.isConnected
    });
  },

  /**
   * 加载电池数据
   */
  async loadBatteryData() {
    const state = vehicleStore.getState();
    if (!state.currentVehicle) {
      showToast('请先连接车辆');
      return;
    }

    try {
      showLoading('加载中...');
      const [batteryInfo, batteryHealth] = await Promise.all([
        getBatteryInfo(state.currentVehicle.id),
        getBatteryHealth(state.currentVehicle.id)
      ]);

      this.setData({
        batteryInfo,
        batteryHealth
      });
    } catch (error) {
      showToast('加载失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadBatteryData().finally(() => {
      wx.stopPullDownRefresh();
    });
  }
});
