// pages/navigation/navigation.js - 导航页面
import { vehicleStore } from '../../stores/vehicle';
import { 
  startNavigationViaBluetooth, 
  updateNavigationViaBluetooth,
  stopNavigationViaBluetooth,
  getBluetoothConnectionStatus 
} from '../../services/bluetooth';
import { 
  chooseDestination, 
  planRoute, 
  calculateDistance
} from '../../utils/navigation';
import { showToast, showLoading, hideLoading } from '../../utils/ui';

Page({
  data: {
    vehicle: null,
    location: null,
    destination: null,
    markers: [],
    route: null,
    navigating: false,
    bluetoothConnected: false,
    currentStep: 0,
    remainingDistance: 0,
    remainingTime: 0,
    navigationTimer: null,
    formatDistance: formatDistanceForPage,
    formatTime: formatTimeForPage
  },

  onLoad() {
    this.initPage();
  },

  onUnload() {
    // 页面卸载时停止导航
    if (this.data.navigating) {
      this.stopNavigation();
    }
  },

  /**
   * 初始化页面
   */
  initPage() {
    const state = vehicleStore.getState();
    this.setData({
      vehicle: state.currentVehicle
    });
    this.loadVehicleLocation();
    this.checkBluetoothStatus();
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
   * 加载车辆位置
   */
  async loadVehicleLocation() {
    const state = vehicleStore.getState();
    if (!state.currentVehicle) {
      showToast('请先连接车辆');
      return;
    }

    try {
      const location = await vehicleStore.getVehicleLocation(state.currentVehicle.id);
      const markers = [{
        id: 1,
        latitude: location.latitude,
        longitude: location.longitude,
        iconPath: '/assets/icons/marker.png',
        width: 40,
        height: 40
      }];
      this.setData({ location, markers });
    } catch (error) {
      showToast('获取位置失败');
    }
  },

  /**
   * 选择目的地
   */
  async chooseDestination() {
    try {
      showLoading('加载中...');
      const destination = await chooseDestination();
      
      // 规划路线
      if (this.data.location) {
        const route = await planRoute(
          { latitude: this.data.location.latitude, longitude: this.data.location.longitude },
          destination
        );
        
        this.setData({
          destination,
          route,
          remainingDistance: route.distance,
          remainingTime: route.estimatedTime
        });

        // 更新地图标记
        const markers = [
          {
            id: 1,
            latitude: this.data.location.latitude,
            longitude: this.data.location.longitude,
            iconPath: '/assets/icons/location-start.png',
            width: 40,
            height: 40,
            callout: {
              content: '当前位置',
              display: 'ALWAYS'
            }
          },
          {
            id: 2,
            latitude: destination.latitude,
            longitude: destination.longitude,
            iconPath: '/assets/icons/location-end.png',
            width: 40,
            height: 40,
            callout: {
              content: destination.name || '目的地',
              display: 'ALWAYS'
            }
          }
        ];
        this.setData({ markers });
      } else {
        this.setData({ destination });
      }
    } catch (error) {
      if (error.errMsg && !error.errMsg.includes('cancel')) {
        showToast('选择目的地失败');
      }
    } finally {
      hideLoading();
    }
  },

  /**
   * 开始导航
   */
  async startNavigation() {
    const { location, destination, route } = this.data;
    if (!location || !destination) {
      showToast('请先选择目的地');
      return;
    }

    if (!route) {
      showToast('路线规划失败，请重新选择目的地');
      return;
    }

    try {
      showLoading('启动导航...');

      // 如果蓝牙已连接，发送导航数据到车辆屏幕
      if (this.data.bluetoothConnected) {
        try {
          await startNavigationViaBluetooth({
            destination,
            route: route.route,
            totalDistance: route.distance,
            estimatedTime: route.estimatedTime
          });
          showToast('导航已投屏到车辆', 'success');
        } catch (error) {
          console.error('蓝牙投屏失败', error);
          showToast('蓝牙投屏失败，将使用手机导航');
        }
      }

      // 开始导航
      this.setData({
        navigating: true,
        currentStep: 0
      });

      // 启动导航更新定时器
      this.startNavigationUpdate();

      // 打开微信地图导航
      wx.openLocation({
        latitude: destination.latitude,
        longitude: destination.longitude,
        name: destination.name || '目的地',
        address: destination.address || '',
        scale: 18
      });

      hideLoading();
    } catch (error) {
      hideLoading();
      showToast('启动导航失败');
    }
  },

  /**
   * 开始导航更新（定时更新导航信息到车辆屏幕）
   */
  startNavigationUpdate() {
    // 清除之前的定时器
    if (this.data.navigationTimer) {
      clearInterval(this.data.navigationTimer);
    }

    // 每5秒更新一次导航信息
    const timer = setInterval(() => {
      this.updateNavigationInfo();
    }, 5000);

    this.setData({ navigationTimer: timer });
  },

  /**
   * 获取当前位置
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          resolve({
            latitude: res.latitude,
            longitude: res.longitude
          });
        },
        fail: reject
      });
    });
  },

  /**
   * 更新导航信息
   */
  async updateNavigationInfo() {
    if (!this.data.navigating) {
      return;
    }

    const { destination, route, currentStep } = this.data;
    if (!destination || !route) {
      return;
    }

    try {
      // 获取当前位置
      let currentLocation;
      try {
        currentLocation = await this.getCurrentLocation();
      } catch (error) {
        // 如果获取位置失败，使用车辆位置
        if (this.data.location) {
          currentLocation = {
            latitude: this.data.location.latitude,
            longitude: this.data.location.longitude
          };
        } else {
          console.error('无法获取当前位置', error);
          return;
        }
      }

      // 计算当前位置到目的地的距离
      const remainingDistance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        destination.latitude,
        destination.longitude
      );

      // 计算剩余时间（假设平均速度15m/s，约54km/h）
      const remainingTime = Math.round(remainingDistance / 15);

      // 计算下一个转弯信息（简化处理）
      const nextTurn = route.route && route.route.length > currentStep + 1
        ? route.route[currentStep + 1]
        : null;

      const nextTurnDistance = nextTurn 
        ? Math.max(0, nextTurn.distance - (route.route[currentStep]?.distance || 0))
        : remainingDistance;

      // 如果蓝牙已连接，更新到车辆屏幕
      if (this.data.bluetoothConnected) {
        try {
          await updateNavigationViaBluetooth({
            currentStep,
            nextTurn: nextTurn ? {
              instruction: nextTurn.instruction || '继续行驶',
              distance: nextTurnDistance
            } : null,
            remainingDistance,
            remainingTime,
            currentLocation,
            direction: 'straight', // 简化处理，实际应该根据路线计算方向
            distance: nextTurnDistance
          });
        } catch (error) {
          console.error('蓝牙投屏更新失败', error);
        }
      }

      // 更新页面数据
      this.setData({
        remainingDistance,
        remainingTime,
        location: currentLocation
      });

      // 更新地图标记
      const markers = [
        {
          id: 1,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          iconPath: '/assets/icons/location-start.png',
          width: 40,
          height: 40,
          callout: {
            content: '当前位置',
            display: 'ALWAYS'
          }
        },
        {
          id: 2,
          latitude: destination.latitude,
          longitude: destination.longitude,
          iconPath: '/assets/icons/location-end.png',
          width: 40,
          height: 40,
          callout: {
            content: destination.name || '目的地',
            display: 'ALWAYS'
          }
        }
      ];
      this.setData({ markers });
    } catch (error) {
      console.error('更新导航信息失败', error);
    }
  },

  /**
   * 停止导航
   */
  async stopNavigation() {
    if (!this.data.navigating) {
      return;
    }

    try {
      // 停止蓝牙投屏
      if (this.data.bluetoothConnected) {
        try {
          await stopNavigationViaBluetooth();
        } catch (error) {
          console.error('停止蓝牙投屏失败', error);
        }
      }

      // 清除定时器
      if (this.data.navigationTimer) {
        clearInterval(this.data.navigationTimer);
        this.setData({ navigationTimer: null });
      }

      this.setData({
        navigating: false,
        currentStep: 0
      });

      showToast('导航已停止');
    } catch (error) {
      showToast('停止导航失败');
    }
  }
});
