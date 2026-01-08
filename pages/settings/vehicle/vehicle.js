// pages/settings/vehicle/vehicle.js - 车辆设置页面
import { vehicleStore } from '../../../stores/vehicle';
import { getVehicleSettings, updateVehicleSettings, toggleHeadlight, setCruiseControl, setSeatSensor } from '../../../services/vehicle';
import { showLoading, hideLoading, showToast } from '../../../utils/ui';

Page({
  data: {
    vehicle: null,
    isConnected: false,
    settings: {
      headlight: {
        enabled: false,
        brightness: 50
      },
      cruiseControl: {
        enabled: false,
        speed: 25
      },
      seatSensor: {
        enabled: false
      },
      alarm: {
        enabled: false,
        sensitivity: 50
      }
    }
  },

  onLoad() {
    this.initPage();
  },

  /**
   * 初始化页面
   */
  async initPage() {
    const state = vehicleStore.getState();
    this.setData({
      vehicle: state.currentVehicle,
      isConnected: state.isConnected
    });

    if (state.currentVehicle && state.isConnected) {
      await this.loadSettings();
    }
  },

  /**
   * 加载设置
   */
  async loadSettings() {
    const state = vehicleStore.getState();
    if (!state.currentVehicle) return;

    try {
      showLoading('加载中...');
      const settings = await getVehicleSettings(state.currentVehicle.id);
      if (settings) {
        this.setData({ settings });
      }
    } catch (error) {
      showToast('加载设置失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 切换大灯
   */
  async toggleHeadlight(e) {
    const { value } = e.detail;
    const state = vehicleStore.getState();
    if (!state.currentVehicle) return;

    try {
      showLoading('设置中...');
      await toggleHeadlight(state.currentVehicle.id, value, this.data.settings.headlight.brightness);
      this.setData({
        'settings.headlight.enabled': value
      });
      showToast('设置成功', 'success');
    } catch (error) {
      showToast('设置失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 调整大灯亮度
   */
  async changeBrightness(e) {
    const { value } = e.detail;
    const state = vehicleStore.getState();
    if (!state.currentVehicle) return;

    try {
      await toggleHeadlight(
        state.currentVehicle.id,
        this.data.settings.headlight.enabled,
        value
      );
      this.setData({
        'settings.headlight.brightness': value
      });
    } catch (error) {
      showToast('设置失败');
    }
  },

  /**
   * 设置定速巡航
   */
  async toggleCruiseControl(e) {
    const { value } = e.detail;
    const state = vehicleStore.getState();
    if (!state.currentVehicle) return;

    try {
      showLoading('设置中...');
      await setCruiseControl(
        state.currentVehicle.id,
        value,
        this.data.settings.cruiseControl.speed
      );
      this.setData({
        'settings.cruiseControl.enabled': value
      });
      showToast('设置成功', 'success');
    } catch (error) {
      showToast('设置失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 设置定速巡航速度
   */
  async changeCruiseSpeed(e) {
    const { value } = e.detail;
    const state = vehicleStore.getState();
    if (!state.currentVehicle) return;

    try {
      await setCruiseControl(
        state.currentVehicle.id,
        this.data.settings.cruiseControl.enabled,
        value
      );
      this.setData({
        'settings.cruiseControl.speed': value
      });
    } catch (error) {
      showToast('设置失败');
    }
  },

  /**
   * 设置坐垫感应
   */
  async toggleSeatSensor(e) {
    const { value } = e.detail;
    const state = vehicleStore.getState();
    if (!state.currentVehicle) return;

    try {
      showLoading('设置中...');
      await setSeatSensor(state.currentVehicle.id, value);
      this.setData({
        'settings.seatSensor.enabled': value
      });
      showToast('设置成功', 'success');
    } catch (error) {
      showToast('设置失败');
    } finally {
      hideLoading();
    }
  }
});
