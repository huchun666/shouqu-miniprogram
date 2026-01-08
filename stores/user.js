// stores/user.js - 用户状态管理
import { Store } from './index';
import * as userService from '../services/user';
import { setUserInfo, getUserInfo as getCachedUserInfo, setToken } from '../utils/storage';
import { logger } from '../utils/logger';

class UserStore extends Store {
  constructor() {
    super();
    this.state = {
      userInfo: null,
      isLoggedIn: false
    };
  }

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    try {
      // 先尝试从缓存加载
      const cachedUserInfo = getCachedUserInfo();
      if (cachedUserInfo) {
        this.setState({
          userInfo: cachedUserInfo,
          isLoggedIn: true
        });
      }

      // 从服务器获取最新信息
      const userInfo = await userService.getUserInfo();
      this.setState({
        userInfo,
        isLoggedIn: true
      });
      setUserInfo(userInfo);
      return userInfo;
    } catch (error) {
      logger.error('获取用户信息失败', error);
      throw error;
    }
  }

  /**
   * 用户登录
   */
  async login() {
    try {
      // 获取微信登录code
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        });
      });

      // 调用登录接口
      const result = await userService.login(loginRes.code);
      
      // 保存token和用户信息
      if (result.token) {
        setToken(result.token);
      }
      if (result.userInfo) {
        this.setState({
          userInfo: result.userInfo,
          isLoggedIn: true
        });
        setUserInfo(result.userInfo);
      }

      return result;
    } catch (error) {
      logger.error('用户登录失败', error);
      throw error;
    }
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(userInfo) {
    try {
      const updatedInfo = await userService.updateUserInfo(userInfo);
      this.setState({ userInfo: updatedInfo });
      setUserInfo(updatedInfo);
      return updatedInfo;
    } catch (error) {
      logger.error('更新用户信息失败', error);
      throw error;
    }
  }

  /**
   * 退出登录
   */
  logout() {
    this.setState({
      userInfo: null,
      isLoggedIn: false
    });
  }
}

// 创建单例
export const userStore = new UserStore();
