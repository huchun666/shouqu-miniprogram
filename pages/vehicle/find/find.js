// pages/vehicle/find/find.js - 寻车页面
import { vehicleStore } from '../../../stores/vehicle';
import { showLoading, hideLoading, showToast } from '../../../utils/ui';

Page({
  data: {
    vehicle: null,
    location: null,
    isConnected: false,
    markers: []
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.loadLocation();
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
   * 加载车辆位置
   */
  async loadLocation() {
    const state = vehicleStore.getState();
    if (!state.currentVehicle) {
      showToast('请先连接车辆');
      return;
    }

    try {
      showLoading('加载中...');
      const location = await vehicleStore.getVehicleLocation(state.currentVehicle.id);
      const markers = [{
        id: 1,
        latitude: location.latitude,
        longitude: location.longitude,
        iconPath: '/assets/icons/marker.png',
        width: 40,
        height: 40,
        callout: {
          content: '车辆位置',
          color: '#333',
          fontSize: 14,
          borderRadius: 4,
          bgColor: '#fff',
          padding: 8,
          display: 'ALWAYS'
        }
      }];
      this.setData({ location, markers });
    } catch (error) {
      showToast('获取位置失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 寻车（鸣笛+闪灯）
   */
  async handleFind() {
    const state = vehicleStore.getState();
    if (!state.currentVehicle) {
      showToast('请先连接车辆');
      return;
    }

    if (!state.isConnected) {
      showToast('车辆未连接');
      return;
    }

    try {
      showLoading('寻车中...');
      await vehicleStore.findVehicle(state.currentVehicle.id);
      showToast('寻车指令已发送', 'success');
    } catch (error) {
      showToast('寻车失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 打开地图导航
   */
  openMap() {
    const { location } = this.data;
    if (!location) {
      showToast('暂无位置信息');
      return;
    }

    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: '车辆位置',
      address: location.address || '',
      scale: 18,
      success: () => {
        console.log('打开地图成功');
      },
      fail: (error) => {
        console.error('打开地图失败', error);
        showToast('打开地图失败');
      }
    });
  }
});
