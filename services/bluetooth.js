// utils/bluetooth.js - 蓝牙工具类
import { showToast, showLoading, hideLoading } from '../utils/ui';
import { logger } from '../utils/logger';

/**
 * 蓝牙服务类
 */
class BluetoothService {
  constructor() {
    this.adapterState = false; // 蓝牙适配器状态
    this.deviceId = null; // 当前连接的设备ID
    this.serviceId = null; // 服务UUID
    this.characteristicId = null; // 特征UUID
    this.isConnected = false; // 是否已连接
    this.devices = []; // 扫描到的设备列表
    this.onDeviceFound = null; // 设备发现回调
    this.onConnectionChange = null; // 连接状态变化回调
  }

  /**
   * 初始化蓝牙适配器
   */
  async initAdapter() {
    try {
      const res = await new Promise((resolve, reject) => {
        wx.openBluetoothAdapter({
          success: resolve,
          fail: reject
        });
      });

      this.adapterState = true;
      logger.info('蓝牙适配器初始化成功', res);
      return true;
    } catch (error) {
      logger.error('蓝牙适配器初始化失败', error);
      showToast('蓝牙初始化失败，请检查蓝牙是否开启');
      return false;
    }
  }

  /**
   * 关闭蓝牙适配器
   */
  async closeAdapter() {
    if (!this.adapterState) return;

    try {
      await new Promise((resolve, reject) => {
        wx.closeBluetoothAdapter({
          success: resolve,
          fail: reject
        });
      });

      this.adapterState = false;
      logger.info('蓝牙适配器已关闭');
    } catch (error) {
      logger.error('关闭蓝牙适配器失败', error);
    }
  }

  /**
   * 开始扫描蓝牙设备
   */
  async startScan(options = {}) {
    if (!this.adapterState) {
      const initSuccess = await this.initAdapter();
      if (!initSuccess) return false;
    }

    try {
      // 停止之前的扫描
      await this.stopScan();

      // 开始扫描
      await new Promise((resolve, reject) => {
        wx.startBluetoothDevicesDiscovery({
          allowDuplicatesKey: false, // 不允许重复上报
          interval: 0, // 上报间隔
          success: resolve,
          fail: reject
        });
      });

      // 监听设备发现
      wx.onBluetoothDeviceFound((res) => {
        const devices = res.devices || [];
        devices.forEach(device => {
          // 过滤设备（可以根据设备名称或服务UUID过滤）
          if (this.isTargetDevice(device, options)) {
            const existingIndex = this.devices.findIndex(d => d.deviceId === device.deviceId);
            if (existingIndex >= 0) {
              this.devices[existingIndex] = device;
            } else {
              this.devices.push(device);
            }

            if (this.onDeviceFound) {
              this.onDeviceFound(device);
            }
          }
        });
      });

      logger.info('开始扫描蓝牙设备');
      return true;
    } catch (error) {
      logger.error('开始扫描失败', error);
      showToast('扫描蓝牙设备失败');
      return false;
    }
  }

  /**
   * 停止扫描
   */
  async stopScan() {
    try {
      await new Promise((resolve, reject) => {
        wx.stopBluetoothDevicesDiscovery({
          success: resolve,
          fail: reject
        });
      });
      logger.info('停止扫描蓝牙设备');
    } catch (error) {
      logger.error('停止扫描失败', error);
    }
  }

  /**
   * 判断是否为目标设备
   */
  isTargetDevice(device, options = {}) {
    const { deviceName, serviceUUIDs } = options;

    // 如果指定了设备名称
    if (deviceName && device.name) {
      return device.name.includes(deviceName);
    }

    // 如果指定了服务UUID
    if (serviceUUIDs && device.advertisServiceUUIDs) {
      return serviceUUIDs.some(uuid => 
        device.advertisServiceUUIDs.includes(uuid.toUpperCase())
      );
    }

    // 默认返回所有设备
    return true;
  }

  /**
   * 连接蓝牙设备
   */
  async connectDevice(deviceId) {
    if (this.isConnected && this.deviceId === deviceId) {
      logger.info('设备已连接');
      return true;
    }

    try {
      showLoading('连接中...');

      // 断开之前的连接
      if (this.deviceId && this.deviceId !== deviceId) {
        await this.disconnectDevice();
      }

      // 连接新设备
      await new Promise((resolve, reject) => {
        wx.createBLEConnection({
          deviceId,
          success: resolve,
          fail: reject
        });
      });

      this.deviceId = deviceId;
      this.isConnected = true;

      // 监听连接状态
      wx.onBLEConnectionStateChange((res) => {
        if (res.deviceId === this.deviceId) {
          this.isConnected = res.connected;
          if (!res.connected) {
            this.deviceId = null;
            this.serviceId = null;
            this.characteristicId = null;
          }

          if (this.onConnectionChange) {
            this.onConnectionChange(res.connected);
          }

          logger.info('蓝牙连接状态变化', res);
        }
      });

      // 获取服务
      await this.getServices(deviceId);

      hideLoading();
      showToast('连接成功', 'success');
      logger.info('蓝牙设备连接成功', { deviceId });
      return true;
    } catch (error) {
      hideLoading();
      logger.error('连接蓝牙设备失败', error);
      showToast('连接失败：' + (error.errMsg || '未知错误'));
      return false;
    }
  }

  /**
   * 断开连接
   */
  async disconnectDevice() {
    if (!this.deviceId || !this.isConnected) {
      return;
    }

    try {
      await new Promise((resolve, reject) => {
        wx.closeBLEConnection({
          deviceId: this.deviceId,
          success: resolve,
          fail: reject
        });
      });

      this.isConnected = false;
      this.deviceId = null;
      this.serviceId = null;
      this.characteristicId = null;

      logger.info('蓝牙设备已断开');
      return true;
    } catch (error) {
      logger.error('断开连接失败', error);
      return false;
    }
  }

  /**
   * 获取设备服务
   */
  async getServices(deviceId) {
    try {
      const res = await new Promise((resolve, reject) => {
        wx.getBLEDeviceServices({
          deviceId: deviceId || this.deviceId,
          success: resolve,
          fail: reject
        });
      });

      const services = res.services || [];
      
      // 查找目标服务（通常是车辆控制服务）
      // 这里使用一个通用的服务UUID，实际使用时需要替换为真实的服务UUID
      const targetService = services.find(s => 
        s.isPrimary && s.uuid
      ) || services[0];

      if (targetService) {
        this.serviceId = targetService.uuid;
        // 获取特征值
        await this.getCharacteristics(deviceId || this.deviceId);
      }

      logger.info('获取服务成功', { services, serviceId: this.serviceId });
      return services;
    } catch (error) {
      logger.error('获取服务失败', error);
      throw error;
    }
  }

  /**
   * 获取特征值
   */
  async getCharacteristics(deviceId) {
    if (!this.serviceId) {
      throw new Error('服务ID未设置');
    }

    try {
      const res = await new Promise((resolve, reject) => {
        wx.getBLEDeviceCharacteristics({
          deviceId: deviceId || this.deviceId,
          serviceId: this.serviceId,
          success: resolve,
          fail: reject
        });
      });

      const characteristics = res.characteristics || [];
      
      // 查找可写的特征值
      const writableChar = characteristics.find(c => 
        c.properties.write || c.properties.writeNoResponse
      );

      if (writableChar) {
        this.characteristicId = writableChar.uuid;
      }

      logger.info('获取特征值成功', { 
        characteristics, 
        characteristicId: this.characteristicId 
      });
      return characteristics;
    } catch (error) {
      logger.error('获取特征值失败', error);
      throw error;
    }
  }

  /**
   * 写入数据（发送指令）
   */
  async writeData(data, deviceId = null) {
    if (!this.isConnected || !this.deviceId) {
      throw new Error('设备未连接');
    }

    if (!this.serviceId || !this.characteristicId) {
      throw new Error('服务或特征值未设置');
    }

    try {
      // 将数据转换为ArrayBuffer
      const buffer = this.stringToArrayBuffer(data);

      await new Promise((resolve, reject) => {
        wx.writeBLECharacteristicValue({
          deviceId: deviceId || this.deviceId,
          serviceId: this.serviceId,
          characteristicId: this.characteristicId,
          value: buffer,
          success: resolve,
          fail: reject
        });
      });

      logger.info('写入数据成功', { data });
      return true;
    } catch (error) {
      logger.error('写入数据失败', error);
      throw error;
    }
  }

  /**
   * 读取数据
   */
  async readData(deviceId = null) {
    if (!this.isConnected || !this.deviceId) {
      throw new Error('设备未连接');
    }

    if (!this.serviceId || !this.characteristicId) {
      throw new Error('服务或特征值未设置');
    }

    try {
      await new Promise((resolve, reject) => {
        wx.readBLECharacteristicValue({
          deviceId: deviceId || this.deviceId,
          serviceId: this.serviceId,
          characteristicId: this.characteristicId,
          success: resolve,
          fail: reject
        });
      });

      // 监听数据接收
      wx.onBLECharacteristicValueChange((res) => {
        const value = this.arrayBufferToString(res.value);
        logger.info('接收到数据', { value });
        return value;
      });

      return true;
    } catch (error) {
      logger.error('读取数据失败', error);
      throw error;
    }
  }

  /**
   * 1. ArrayBuffer
        作用：表示固定长度的原始二进制数据缓冲区
        特点：
        不能直接操作，需要通过视图（如 Uint8Array）操作
        大小固定，创建后不能改变
   * 2. Uint8Array
        作用：8 位无符号整数数组视图，用于操作 ArrayBuffer
        特点：
        每个元素占 1 字节（0-255）
        可以直接读写 ArrayBuffer 的数据
    */
  /**
   * 字符串转ArrayBuffer
   */
  stringToArrayBuffer(str) {
    const buffer = new ArrayBuffer(str.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++) {
      view[i] = str.charCodeAt(i);
    }
    return buffer;
  }

  /**
   * ArrayBuffer转字符串
   */
  arrayBufferToString(buffer) {
    const view = new Uint8Array(buffer);
    let str = '';
    for (let i = 0; i < view.length; i++) {
      str += String.fromCharCode(view[i]);
    }
    return str;
  }

  /**
   * 获取已连接的设备
   */
  getConnectedDevices() {
    return new Promise((resolve, reject) => {
      wx.getConnectedBluetoothDevices({
        services: [],
        success: (res) => {
          resolve(res.devices || []);
        },
        fail: reject
      });
    });
  }

  /**
   * 清空设备列表
   */
  clearDevices() {
    this.devices = [];
  }
}

// 创建单例
export const bluetoothService = new BluetoothService();

export default bluetoothService;
