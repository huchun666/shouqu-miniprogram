// pages/vehicle/control/control.js - 车辆控制页面
import { vehicleStore } from '../../../stores/vehicle';
import { 
  startVehicleViaBluetooth, 
  stopVehicleViaBluetooth,
  unlockVehicleViaBluetooth,
  lockVehicleViaBluetooth,
  getBluetoothConnectionStatus 
} from '../../../services/bluetooth';
import { showLoading, hideLoading, showToast, showModal, navigateTo } from '../../../utils/ui';

Page({
  data: {
    vehicle: null,
    isConnected: false,
    isLocked: true,
    isAlarmOn: false,
    bluetoothConnected: false, // 蓝牙连接状态
    controlMode: 'network' // 控制模式：network 或 bluetooth
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.refreshStatus();
    this.checkBluetoothStatus();
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
    
    if (state.vehicleStatus) {
      this.setData({
        isLocked: state.vehicleStatus.isLocked !== false,
        isAlarmOn: state.vehicleStatus.isAlarmOn || false
      });
    }

    // 检查蓝牙连接状态
    this.checkBluetoothStatus();
  },

  /**
   * 检查蓝牙连接状态
   */
  checkBluetoothStatus() {
    const status = getBluetoothConnectionStatus();
    this.setData({
      bluetoothConnected: status.isConnected,
      controlMode: status.isConnected ? 'bluetooth' : 'network'
    });
  },

  /**
   * 跳转到蓝牙连接页面
   */
  goToBluetoothConnect() {
    navigateTo('/pages/bluetooth/connect/connect');
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
          this.setData({
            isLocked: newState.vehicleStatus.isLocked !== false,
            isAlarmOn: newState.vehicleStatus.isAlarmOn || false
          });
        }
      } catch (error) {
        console.error('刷新状态失败', error);
      }
    }
  },

  /**
   * 解锁车辆
   */
  async handleUnlock() {
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

    const res = await showModal({
      title: '确认解锁',
      content: '确定要解锁车辆吗？'
    });

    if (!res) return;

    try {
      showLoading('解锁中...');
      await vehicleStore.unlockVehicle(state.currentVehicle.id);
      showToast('解锁成功', 'success');
      this.setData({ isLocked: false });
    } catch (error) {
      showToast('解锁失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 通过蓝牙解锁车辆
   */
  async handleUnlockViaBluetooth() {
    if (!this.data.bluetoothConnected) {
      showToast('蓝牙未连接，请先连接蓝牙');
      this.goToBluetoothConnect();
      return;
    }

    const res = await showModal({
      title: '确认解锁',
      content: '确定要通过蓝牙解锁车辆吗？'
    });

    if (!res) return;

    try {
      showLoading('解锁中...');
      const result = await unlockVehicleViaBluetooth();
      showToast(result.message || '解锁成功', 'success');
      this.setData({ isLocked: false });
    } catch (error) {
      showToast(error.message || '解锁失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 锁定车辆
   */
  async handleLock() {
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

    const res = await showModal({
      title: '确认锁定',
      content: '确定要锁定车辆吗？'
    });

    if (!res) return;

    try {
      showLoading('锁定中...');
      await vehicleStore.lockVehicle(state.currentVehicle.id);
      showToast('锁定成功', 'success');
      this.setData({ isLocked: true });
    } catch (error) {
      showToast('锁定失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 通过蓝牙锁定车辆
   */
  async handleLockViaBluetooth() {
    if (!this.data.bluetoothConnected) {
      showToast('蓝牙未连接，请先连接蓝牙');
      this.goToBluetoothConnect();
      return;
    }

    const res = await showModal({
      title: '确认锁定',
      content: '确定要通过蓝牙锁定车辆吗？'
    });

    if (!res) return;

    try {
      showLoading('锁定中...');
      const result = await lockVehicleViaBluetooth();
      showToast(result.message || '锁定成功', 'success');
      this.setData({ isLocked: true });
    } catch (error) {
      showToast(error.message || '锁定失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 启动车辆
   */
  async handleStart() {
    const state = vehicleStore.getState();
    
    // 检查蓝牙连接
    if (this.data.bluetoothConnected) {
      await this.handleStartViaBluetooth();
      return;
    }

    // 网络控制
    if (!state.currentVehicle) {
      showToast('请先连接车辆');
      return;
    }

    if (!state.isConnected) {
      showToast('车辆未连接');
      return;
    }

    if (this.data.isLocked) {
      showToast('请先解锁车辆');
      return;
    }

    const res = await showModal({
      title: '确认启动',
      content: '确定要启动车辆吗？'
    });

    if (!res) return;

    try {
      showLoading('启动中...');
      await vehicleStore.startVehicle(state.currentVehicle.id);
      showToast('启动成功', 'success');
    } catch (error) {
      showToast('启动失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 通过蓝牙启动车辆
   */
  async handleStartViaBluetooth() {
    if (!this.data.bluetoothConnected) {
      showToast('蓝牙未连接，请先连接蓝牙');
      this.goToBluetoothConnect();
      return;
    }

    const res = await showModal({
      title: '确认启动',
      content: '确定要通过蓝牙启动车辆吗？'
    });

    if (!res) return;

    try {
      showLoading('启动中...');
      const result = await startVehicleViaBluetooth();
      showToast(result.message || '启动成功', 'success');
    } catch (error) {
      showToast(error.message || '启动失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 停止车辆
   */
  async handleStop() {
    // 检查蓝牙连接
    if (this.data.bluetoothConnected) {
      await this.handleStopViaBluetooth();
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

    const res = await showModal({
      title: '确认停止',
      content: '确定要停止车辆吗？'
    });

    if (!res) return;

    try {
      showLoading('停止中...');
      await vehicleStore.stopVehicle(state.currentVehicle.id);
      showToast('停止成功', 'success');
    } catch (error) {
      showToast('停止失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 通过蓝牙停止车辆
   */
  async handleStopViaBluetooth() {
    if (!this.data.bluetoothConnected) {
      showToast('蓝牙未连接，请先连接蓝牙');
      this.goToBluetoothConnect();
      return;
    }

    const res = await showModal({
      title: '确认停止',
      content: '确定要通过蓝牙停止车辆吗？'
    });

    if (!res) return;

    try {
      showLoading('停止中...');
      const result = await stopVehicleViaBluetooth();
      showToast(result.message || '停止成功', 'success');
    } catch (error) {
      showToast(error.message || '停止失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 寻车
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
   * 跳转到车辆设置
   */
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/vehicle/vehicle'
    });
  }
});
