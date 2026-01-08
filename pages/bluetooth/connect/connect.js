// pages/bluetooth/connect/connect.js - 蓝牙连接页面
import { 
  initBluetooth, 
  scanVehicles, 
  stopScan, 
  connectVehicle,
  disconnectVehicle,
  getScannedDevices,
  getBluetoothConnectionStatus
} from '../../../services/bluetooth';
import { showLoading, hideLoading, showToast } from '../../../utils/ui';

Page({
  data: {
    scanning: false,
    devices: [],
    connected: false,
    connectedDevice: null,
    connectionStatus: null
  },

  onLoad() {
    this.initPage();
  },

  onUnload() {
    // 页面卸载时停止扫描
    if (this.data.scanning) {
      this.stopScanning();
    }
  },

  /**
   * 初始化页面
   */
  async initPage() {
    try {
      showLoading('初始化蓝牙...');
      const success = await initBluetooth();
      if (success) {
        // 检查是否已连接
        const status = getBluetoothConnectionStatus();
        this.setData({
          connected: status.isConnected,
          connectedDevice: status.deviceId ? {
            deviceId: status.deviceId,
            name: '已连接设备'
          } : null,
          connectionStatus: status
        });
      } else {
        showToast('蓝牙初始化失败');
      }
    } catch (error) {
      showToast('初始化失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 开始扫描
   */
  async startScanning() {
    if (this.data.scanning) {
      return;
    }

    try {
      this.setData({ scanning: true, devices: [] });

      // 设置设备发现回调
      const onDeviceFound = (device) => {
        const devices = this.data.devices;
        const existingIndex = devices.findIndex(d => d.deviceId === device.deviceId);
        
        if (existingIndex >= 0) {
          devices[existingIndex] = device;
        } else {
          devices.push(device);
        }

        this.setData({ devices: [...devices] });
      };

      const success = await scanVehicles({
        onDeviceFound,
        deviceName: '首驱' // 可以根据实际情况修改
      });

      if (!success) {
        this.setData({ scanning: false });
        showToast('开始扫描失败');
      }
    } catch (error) {
      this.setData({ scanning: false });
      showToast('扫描失败');
    }
  },

  /**
   * 停止扫描
   */
  async stopScanning() {
    try {
      await stopScan();
      this.setData({ scanning: false });
    } catch (error) {
      showToast('停止扫描失败');
    }
  },

  /**
   * 连接设备
   */
  async connectDevice(e) {
    const { deviceid } = e.currentTarget.dataset;
    if (!deviceid) {
      showToast('设备ID无效');
      return;
    }

    try {
      showLoading('连接中...');
      const success = await connectVehicle(deviceid);
      
      if (success) {
        const status = getBluetoothConnectionStatus();
        this.setData({
          connected: true,
          connectedDevice: {
            deviceId: deviceid,
            name: this.data.devices.find(d => d.deviceId === deviceid)?.name || '已连接设备'
          },
          connectionStatus: status
        });
        
        // 停止扫描
        await this.stopScanning();
        
        showToast('连接成功', 'success');
        
        // 延迟返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        showToast('连接失败');
      }
    } catch (error) {
      showToast('连接失败：' + error.message);
    } finally {
      hideLoading();
    }
  },

  /**
   * 断开连接
   */
  async disconnectDevice() {
    try {
      showLoading('断开中...');
      const success = await disconnectVehicle();
      
      if (success) {
        this.setData({
          connected: false,
          connectedDevice: null,
          connectionStatus: null
        });
        showToast('已断开连接', 'success');
      } else {
        showToast('断开失败');
      }
    } catch (error) {
      showToast('断开失败');
    } finally {
      hideLoading();
    }
  },

  /**
   * 刷新设备列表
   */
  refreshDevices() {
    this.setData({ devices: [] });
    if (this.data.scanning) {
      this.stopScanning().then(() => {
        setTimeout(() => {
          this.startScanning();
        }, 500);
      });
    } else {
      this.startScanning();
    }
  }
});
