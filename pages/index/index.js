// pages/index/index.js - 首页
import { vehicleStore } from '../../stores/vehicle';
import { 
  unlockVehicleViaBluetooth, 
  lockVehicleViaBluetooth,
  getBluetoothConnectionStatus 
} from '../../hooks/bluetooth';
import { navigateTo } from '../../utils/ui';
import { showLoading, hideLoading, showToast } from '../../utils/ui';

Page({
  data: {
    vehicle: null,
    status: null,
    isConnected: false,
    isOnline: false,
    battery: 0,
    range: 0,
    speed: 0,
    mileage: 0,
    isLocked: true,
    bluetoothConnected: false // 蓝牙连接状态
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    // 每次显示页面时刷新状态
    this.refreshStatus();
    this.checkBluetoothStatus();
  },

  onUnload() {
    // 页面卸载时停止状态更新
    vehicleStore.stopStatusPolling();
  },

  /**
   * 初始化页面
   */
  async initPage() {
    try {
      showLoading();
      const state = vehicleStore.getState();
      
      if (state.currentVehicle) {
        this.setData({
          vehicle: state.currentVehicle,
          isConnected: state.isConnected,
          isOnline: state.isOnline
        });
        
        if (state.vehicleStatus) {
          this.updateStatus(state.vehicleStatus);
        }
        
        // 开始状态轮询
        if (state.isConnected) {
          vehicleStore.startStatusPolling(state.currentVehicle.id);
        }
      } else {
        // 没有车辆，跳转到车辆列表或添加车辆页面
        this.handleNoVehicle();
      }
    } catch (error) {
      showToast('加载失败，请重试');
    } finally {
      hideLoading();
    }
  },

  /**
   * 刷新状态
   */
  async refreshStatus() {
    const state = vehicleStore.getState();
    if (state.currentVehicle && state.isConnected) {
      try {
        await vehicleStore.getVehicleStatus(state.currentVehicle.id);
        const newState = vehicleStore.getState();
        if (newState.vehicleStatus) {
          this.updateStatus(newState.vehicleStatus);
        }
      } catch (error) {
        console.error('刷新状态失败', error);
      }
    }
  },

  /**
   * 更新状态显示
   */
  updateStatus(status) {
    this.setData({
      status,
      battery: status.battery || 0,
      range: status.range || 0,
      speed: status.speed || 0,
      mileage: status.totalMileage || 0,
      isLocked: status.isLocked !== false
    });
  },

  /**
   * 检查蓝牙连接状态
   */
  checkBluetoothStatus() {
    const status = getBluetoothConnectionStatus();
    this.setData({
      bluetoothConnected: status.isConnected
    });
  },

  /**
   * 处理没有车辆的情况
   */
  handleNoVehicle() {
    // TODO: 跳转到添加车辆页面
    showToast('请先添加车辆');
  },

  /**
   * 跳转到车辆状态页面
   */
  goToStatus() {
    navigateTo('/pages/vehicle/status/status');
  },

  /**
   * 跳转到寻车页面
   */
  goToFind() {
    navigateTo('/pages/vehicle/find/find');
  },

  /**
   * 跳转到行程记录
   */
  goToTrip() {
    navigateTo('/pages/trip/record/record');
  },

  /**
   * 跳转到电池管理
   */
  goToBattery() {
    navigateTo('/pages/battery/battery');
  },

  /**
   * 跳转到蓝牙连接
   */
  goToBluetooth() {
    navigateTo('/pages/bluetooth/connect/connect');
  },

  /**
   * 快速解锁
   */
  async handleQuickUnlock() {
    // 检查蓝牙连接
    if (this.data.bluetoothConnected) {
      await this.handleUnlockViaBluetooth();
      return;
    }

    // 网络控制
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
      showLoading('解锁中...');
      await vehicleStore.unlockVehicle(state.currentVehicle.id);
      showToast('解锁成功', 'success');
      this.refreshStatus();
    } catch (error) {
      showToast('解锁失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 通过蓝牙解锁
   */
  async handleUnlockViaBluetooth() {
    if (!this.data.bluetoothConnected) {
      showToast('蓝牙未连接，请先连接蓝牙');
      this.goToBluetooth();
      return;
    }

    try {
      showLoading('解锁中...');
      const result = await unlockVehicleViaBluetooth();
      showToast(result.message || '解锁成功', 'success');
      this.setData({ isLocked: false });
      this.refreshStatus();
    } catch (error) {
      showToast(error.message || '解锁失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 快速锁定
   */
  async handleQuickLock() {
    // 检查蓝牙连接
    if (this.data.bluetoothConnected) {
      await this.handleLockViaBluetooth();
      return;
    }

    // 网络控制
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
      showLoading('锁定中...');
      await vehicleStore.lockVehicle(state.currentVehicle.id);
      showToast('锁定成功', 'success');
      this.refreshStatus();
    } catch (error) {
      showToast('锁定失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 通过蓝牙锁定
   */
  async handleLockViaBluetooth() {
    if (!this.data.bluetoothConnected) {
      showToast('蓝牙未连接，请先连接蓝牙');
      this.goToBluetooth();
      return;
    }

    try {
      showLoading('锁定中...');
      const result = await lockVehicleViaBluetooth();
      showToast(result.message || '锁定成功', 'success');
      this.setData({ isLocked: true });
      this.refreshStatus();
    } catch (error) {
      showToast(error.message || '锁定失败');
    } finally {
      hideLoading();
    }
  }
});
