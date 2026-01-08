// pages/community/community.js - 社区页面
Page({
  data: {
    posts: [],
    loading: false
  },

  onLoad() {
    this.loadPosts();
  },

  /**
   * 加载帖子列表
   */
  async loadPosts() {
    // TODO: 实现帖子列表加载
    this.setData({ loading: true });
    // 模拟数据
    setTimeout(() => {
      this.setData({
        posts: [],
        loading: false
      });
    }, 1000);
  },

  /**
   * 发布帖子
   */
  createPost() {
    wx.navigateTo({
      url: '/pages/community/create/create'
    });
  }
});
