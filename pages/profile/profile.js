// pages/profile/profile.js - 个人中心页面
import { userStore } from '../../stores/user';
import { navigateTo, showModal } from '../../utils/ui';

Page({
  data: {
    userInfo: null
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const state = userStore.getState();
    this.setData({
      userInfo: state.userInfo
    });
  },

  /**
   * 编辑个人信息
   */
  editProfile() {
    navigateTo('/pages/profile/edit/edit');
  },

  /**
   * 我的车辆
   */
  myVehicles() {
    navigateTo('/pages/vehicle/list/list');
  },

  /**
   * 设置
   */
  settings() {
    navigateTo('/pages/settings/settings');
  },

  /**
   * 关于
   */
  about() {
    navigateTo('/pages/about/about');
  },

  /**
   * 退出登录
   */
  async logout() {
    const res = await showModal({
      title: '确认退出',
      content: '确定要退出登录吗？'
    });

    if (res) {
      userStore.logout();
      wx.reLaunch({
        url: '/pages/login/login'
      });
    }
  }
});
