// pages/trip/record/record.js - 行程记录页面
import { getTripList, getTripStatistics } from '../../../services/trip';
import { showLoading, hideLoading, showToast, navigateTo } from '../../../utils/ui';
import { formatDate, formatDistance, formatDuration } from '../../../utils/format';

Page({
  data: {
    tripList: [],
    statistics: null,
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 20
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    // 刷新数据
    this.refreshData();
  },

  /**
   * 加载数据
   */
  async loadData() {
    if (this.data.loading) return;

    try {
      this.setData({ loading: true });
      showLoading('加载中...');

      const [tripList, statistics] = await Promise.all([
        this.loadTripList(),
        this.loadStatistics()
      ]);

      this.setData({
        tripList,
        statistics
      });
    } catch (error) {
      showToast('加载失败');
    } finally {
      this.setData({ loading: false });
      hideLoading();
    }
  },

  /**
   * 刷新数据
   */
  async refreshData() {
    this.setData({ page: 1, tripList: [], hasMore: true });
    await this.loadData();
  },

  /**
   * 加载行程列表
   */
  async loadTripList() {
    try {
      const result = await getTripList({
        page: this.data.page,
        pageSize: this.data.pageSize
      });

      const newList = this.data.page === 1 
        ? result.list || []
        : [...this.data.tripList, ...(result.list || [])];

      this.setData({
        tripList: newList,
        hasMore: result.hasMore !== false && (result.list || []).length === this.data.pageSize
      });

      return newList;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 加载统计数据
   */
  async loadStatistics() {
    try {
      const statistics = await getTripStatistics({
        period: 'month'
      });
      return statistics;
    } catch (error) {
      return null;
    }
  },

  /**
   * 加载更多
   */
  async loadMore() {
    if (!this.data.hasMore || this.data.loading) return;

    this.setData({ page: this.data.page + 1 });
    await this.loadTripList();
  },

  /**
   * 查看行程详情
   */
  viewDetail(e) {
    const { id } = e.currentTarget.dataset;
    navigateTo('/pages/trip/detail/detail', { id });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.refreshData().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 上拉加载
   */
  onReachBottom() {
    this.loadMore();
  }
});
