// services/bluetooth.js - 蓝牙车辆控制服务
import bluetoothService from '../utils/bluetooth';

/**
 * 车辆控制指令定义
 */
const COMMANDS = {
  START: 'START',      // 启动车辆
  STOP: 'STOP',        // 停止车辆
  UNLOCK: 'UNLOCK',    // 解锁
  LOCK: 'LOCK',        // 锁定
  FIND: 'FIND',        // 寻车
  STATUS: 'STATUS',    // 查询状态
  NAVIGATION_START: 'NAV_START',    // 开始导航
  NAVIGATION_UPDATE: 'NAV_UPDATE',  // 更新导航
  NAVIGATION_STOP: 'NAV_STOP'      // 停止导航
};

/**
 * 初始化蓝牙
 */
export const initBluetooth = async () => {
  return await bluetoothService.initAdapter();
};

/**
 * 扫描车辆设备
 */
export const scanVehicles = async (options = {}) => {
  // 车辆设备通常有特定的服务UUID或名称
  // 这里可以根据实际情况配置
  const scanOptions = {
    deviceName: options.deviceName || '首驱智能电动车', // 设备名称包含"首驱智能电动车"
    serviceUUIDs: options.serviceUUIDs || [] // 可以指定服务UUID
  };

  bluetoothService.onDeviceFound = options.onDeviceFound;
  return await bluetoothService.startScan(scanOptions);
};

/**
 * 停止扫描
 */
export const stopScan = async () => {
  return await bluetoothService.stopScan();
};

/**
 * 连接车辆
 */
export const connectVehicle = async (deviceId) => {
  bluetoothService.onConnectionChange = (connected) => {
    // 连接状态变化回调
    console.log('蓝牙连接状态:', connected);
  };

  return await bluetoothService.connectDevice(deviceId);
};

/**
 * 断开连接
 */
export const disconnectVehicle = async () => {
  return await bluetoothService.disconnectDevice();
};

/**
 * 启动车辆（通过蓝牙）
 */
export const startVehicleViaBluetooth = async () => {
  try {
    if (!bluetoothService.isConnected) {
      throw new Error('蓝牙未连接');
    }

    // 发送启动指令
    // 实际指令格式需要根据车辆协议定义
    const command = JSON.stringify({
      cmd: COMMANDS.START,
      timestamp: Date.now()
    });

    await bluetoothService.writeData(command);
    return { success: true, message: '启动指令已发送' };
  } catch (error) {
    throw new Error('启动失败：' + error.message);
  }
};

/**
 * 停止车辆（通过蓝牙）
 */
export const stopVehicleViaBluetooth = async () => {
  try {
    if (!bluetoothService.isConnected) {
      throw new Error('蓝牙未连接');
    }

    // 发送停止指令
    const command = JSON.stringify({
      cmd: COMMANDS.STOP,
      timestamp: Date.now()
    });

    await bluetoothService.writeData(command);
    return { success: true, message: '停止指令已发送' };
  } catch (error) {
    throw new Error('停止失败：' + error.message);
  }
};

/**
 * 解锁车辆（通过蓝牙）
 */
export const unlockVehicleViaBluetooth = async () => {
  try {
    if (!bluetoothService.isConnected) {
      throw new Error('蓝牙未连接');
    }

    const command = JSON.stringify({
      cmd: COMMANDS.UNLOCK,
      timestamp: Date.now()
    });

    await bluetoothService.writeData(command);
    return { success: true, message: '解锁指令已发送' };
  } catch (error) {
    throw new Error('解锁失败：' + error.message);
  }
};

/**
 * 锁定车辆（通过蓝牙）
 */
export const lockVehicleViaBluetooth = async () => {
  try {
    if (!bluetoothService.isConnected) {
      throw new Error('蓝牙未连接');
    }

    const command = JSON.stringify({
      cmd: COMMANDS.LOCK,
      timestamp: Date.now()
    });

    await bluetoothService.writeData(command);
    return { success: true, message: '锁定指令已发送' };
  } catch (error) {
    throw new Error('锁定失败：' + error.message);
  }
};

/**
 * 寻车（通过蓝牙）
 */
export const findVehicleViaBluetooth = async () => {
  try {
    if (!bluetoothService.isConnected) {
      throw new Error('蓝牙未连接');
    }

    const command = JSON.stringify({
      cmd: COMMANDS.FIND,
      timestamp: Date.now()
    });

    await bluetoothService.writeData(command);
    return { success: true, message: '寻车指令已发送' };
  } catch (error) {
    throw new Error('寻车失败：' + error.message);
  }
};

/**
 * 查询车辆状态（通过蓝牙）
 */
export const getVehicleStatusViaBluetooth = async () => {
  try {
    if (!bluetoothService.isConnected) {
      throw new Error('蓝牙未连接');
    }

    // 发送查询指令
    const command = JSON.stringify({
      cmd: COMMANDS.STATUS,
      timestamp: Date.now()
    });

    await bluetoothService.writeData(command);
    
    // 读取返回的状态数据
    const status = await bluetoothService.readData();
    return status;
  } catch (error) {
    throw new Error('查询状态失败：' + error.message);
  }
};

/**
 * 获取蓝牙连接状态
 */
export const getBluetoothConnectionStatus = () => {
  return {
    isConnected: bluetoothService.isConnected,
    deviceId: bluetoothService.deviceId,
    serviceId: bluetoothService.serviceId,
    characteristicId: bluetoothService.characteristicId
  };
};

/**
 * 获取扫描到的设备列表
 */
export const getScannedDevices = () => {
  return bluetoothService.devices;
};

/**
 * 开始导航投屏（通过蓝牙）
 */
export const startNavigationViaBluetooth = async (navigationData) => {
  try {
    if (!bluetoothService.isConnected) {
      throw new Error('蓝牙未连接');
    }

    const command = JSON.stringify({
      cmd: COMMANDS.NAVIGATION_START,
      data: {
        destination: {
          latitude: navigationData.destination.latitude,
          longitude: navigationData.destination.longitude,
          name: navigationData.destination.name || '',
          address: navigationData.destination.address || ''
        },
        route: navigationData.route || [],
        totalDistance: navigationData.totalDistance || 0,
        estimatedTime: navigationData.estimatedTime || 0
      },
      timestamp: Date.now()
    });

    await bluetoothService.writeData(command);
    return { success: true, message: '导航已开始投屏' };
  } catch (error) {
    throw new Error('开始导航投屏失败：' + error.message);
  }
};

/**
 * 更新导航信息（通过蓝牙）
 */
export const updateNavigationViaBluetooth = async (navigationData) => {
  try {
    if (!bluetoothService.isConnected) {
      throw new Error('蓝牙未连接');
    }

    const command = JSON.stringify({
      cmd: COMMANDS.NAVIGATION_UPDATE,
      data: {
        currentStep: navigationData.currentStep || 0,
        nextTurn: navigationData.nextTurn || null, // 下一个转弯信息
        remainingDistance: navigationData.remainingDistance || 0,
        remainingTime: navigationData.remainingTime || 0,
        currentLocation: {
          latitude: navigationData.currentLocation?.latitude || 0,
          longitude: navigationData.currentLocation?.longitude || 0
        },
        direction: navigationData.direction || 'straight', // 方向：straight, left, right, uturn
        distance: navigationData.distance || 0 // 到下一个转弯的距离（米）
      },
      timestamp: Date.now()
    });

    await bluetoothService.writeData(command);
    return { success: true, message: '导航信息已更新' };
  } catch (error) {
    throw new Error('更新导航信息失败：' + error.message);
  }
};

/**
 * 停止导航投屏（通过蓝牙）
 */
export const stopNavigationViaBluetooth = async () => {
  try {
    if (!bluetoothService.isConnected) {
      throw new Error('蓝牙未连接');
    }

    const command = JSON.stringify({
      cmd: COMMANDS.NAVIGATION_STOP,
      timestamp: Date.now()
    });

    await bluetoothService.writeData(command);
    return { success: true, message: '导航已停止' };
  } catch (error) {
    throw new Error('停止导航失败：' + error.message);
  }
};

export default {
  initBluetooth,
  scanVehicles,
  stopScan,
  connectVehicle,
  disconnectVehicle,
  startVehicleViaBluetooth,
  stopVehicleViaBluetooth,
  unlockVehicleViaBluetooth,
  lockVehicleViaBluetooth,
  findVehicleViaBluetooth,
  getVehicleStatusViaBluetooth,
  getBluetoothConnectionStatus,
  getScannedDevices,
  startNavigationViaBluetooth,
  updateNavigationViaBluetooth,
  stopNavigationViaBluetooth
};
