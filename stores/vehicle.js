// stores/vehicle.js - 车辆状态管理
import { Store } from './index';
import * as vehicleService from '../services/vehicle';
import { setVehicleInfo, getVehicleInfo } from '../utils/storage';
import { logger } from '../utils/logger';

class VehicleStore extends Store {
  constructor() {
    super();
    this.state = {
      vehicleList: [],
      currentVehicle: null,
      vehicleStatus: null,
      isConnected: false,
      isOnline: false,
      connectionStatus: 'disconnected', // disconnected, connecting, connected
      statusUpdateTimer: null
    };
  }

  /**
   * 初始化车辆连接
   */
  async initConnection() {
    try {
      // 从缓存加载车辆信息
      const cachedVehicle = getVehicleInfo();
      if (cachedVehicle) {
        this.setState({ currentVehicle: cachedVehicle });
        await this.connectVehicle(cachedVehicle.id);
      }
    } catch (error) {
      logger.error('初始化车辆连接失败', error);
    }
  }

  /**
   * 获取车辆列表
   */
  async getVehicleList() {
    try {
      const list = await vehicleService.getVehicleList();
      this.setState({ vehicleList: list });
      return list;
    } catch (error) {
      logger.error('获取车辆列表失败', error);
      throw error;
    }
  }

  /**
   * 设置当前车辆
   */
  setCurrentVehicle(vehicle) {
    this.setState({ currentVehicle: vehicle });
    setVehicleInfo(vehicle);
  }

  /**
   * 连接车辆
   */
  async connectVehicle(vehicleId) {
    try {
      this.setState({ connectionStatus: 'connecting' });
      await vehicleService.connectVehicle(vehicleId);
      this.setState({
        isConnected: true,
        connectionStatus: 'connected'
      });
      
      // 开始轮询车辆状态
      this.startStatusPolling(vehicleId);
      
      logger.info('车辆连接成功', { vehicleId });
    } catch (error) {
      this.setState({ connectionStatus: 'disconnected' });
      logger.error('车辆连接失败', error);
      throw error;
    }
  }

  /**
   * 断开车辆连接
   */
  async disconnectVehicle(vehicleId) {
    try {
      await vehicleService.disconnectVehicle(vehicleId);
      this.setState({
        isConnected: false,
        connectionStatus: 'disconnected'
      });
      
      // 停止状态轮询
      this.stopStatusPolling();
      
      logger.info('车辆断开连接', { vehicleId });
    } catch (error) {
      logger.error('断开车辆连接失败', error);
      throw error;
    }
  }

  /**
   * 获取车辆状态
   */
  async getVehicleStatus(vehicleId) {
    try {
      const status = await vehicleService.getVehicleStatus(vehicleId);
      this.setState({
        vehicleStatus: status,
        isOnline: status.signal > 0
      });
      return status;
    } catch (error) {
      logger.error('获取车辆状态失败', error);
      this.setState({ isOnline: false });
      throw error;
    }
  }

  /**
   * 开始状态轮询
   */
  startStatusPolling(vehicleId) {
    this.stopStatusPolling(); // 先清除旧的定时器
    
    // 立即获取一次状态
    this.getVehicleStatus(vehicleId);
    
    // 每5秒轮询一次
    this.state.statusUpdateTimer = setInterval(() => {
      this.getVehicleStatus(vehicleId);
    }, 5000);
  }

  /**
   * 停止状态轮询
   */
  stopStatusPolling() {
    if (this.state.statusUpdateTimer) {
      clearInterval(this.state.statusUpdateTimer);
      this.state.statusUpdateTimer = null;
    }
  }

  /**
   * 远程解锁
   */
  async unlockVehicle(vehicleId) {
    try {
      await vehicleService.unlockVehicle(vehicleId);
      // 更新状态
      await this.getVehicleStatus(vehicleId);
      logger.info('车辆解锁成功', { vehicleId });
    } catch (error) {
      logger.error('车辆解锁失败', error);
      throw error;
    }
  }

  /**
   * 远程锁定
   */
  async lockVehicle(vehicleId) {
    try {
      await vehicleService.lockVehicle(vehicleId);
      // 更新状态
      await this.getVehicleStatus(vehicleId);
      logger.info('车辆锁定成功', { vehicleId });
    } catch (error) {
      logger.error('车辆锁定失败', error);
      throw error;
    }
  }

  /**
   * 启动车辆
   */
  async startVehicle(vehicleId) {
    try {
      await vehicleService.startVehicle(vehicleId);
      logger.info('车辆启动成功', { vehicleId });
    } catch (error) {
      logger.error('车辆启动失败', error);
      throw error;
    }
  }

  /**
   * 停止车辆
   */
  async stopVehicle(vehicleId) {
    try {
      await vehicleService.stopVehicle(vehicleId);
      logger.info('车辆停止成功', { vehicleId });
    } catch (error) {
      logger.error('车辆停止失败', error);
      throw error;
    }
  }

  /**
   * 寻车
   */
  async findVehicle(vehicleId) {
    try {
      await vehicleService.findVehicle(vehicleId);
      logger.info('寻车指令发送成功', { vehicleId });
    } catch (error) {
      logger.error('寻车失败', error);
      throw error;
    }
  }

  /**
   * 获取车辆位置
   */
  async getVehicleLocation(vehicleId) {
    try {
      const location = await vehicleService.getVehicleLocation(vehicleId);
      return location;
    } catch (error) {
      logger.error('获取车辆位置失败', error);
      throw error;
    }
  }
}

// 创建单例
export const vehicleStore = new VehicleStore();
