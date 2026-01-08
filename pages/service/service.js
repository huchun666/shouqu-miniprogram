// pages/service/service.js - 售后服务页面
Page({
  data: {
    stores: [],
    repairs: []
  },

  onLoad() {
    this.loadData();
  },

  /**
   * 加载数据
   */
  async loadData() {
    // TODO: 实现服务网点列表和报修记录加载
  },

  /**
   * 查找服务网点
   */
  findStores() {
    wx.navigateTo({
      url: '/pages/service/stores/stores'
    });
  },

  /**
   * 在线报修
   */
  createRepair() {
    wx.navigateTo({
      url: '/pages/service/repair/repair'
    });
  },

  /**
   * 查看报修记录
   */
  viewRepairs() {
    wx.navigateTo({
      url: '/pages/service/repair-list/repair-list'
    });
  }
});
