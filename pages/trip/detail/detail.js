// pages/trip/detail/detail.js - 行程详情页面
import { getTripDetail } from '../../../services/trip';
import { showLoading, hideLoading, showToast } from '../../../utils/ui';
import { formatDate, formatDistance, formatDuration, formatSpeed } from '../../../utils/format';

Page({
  data: {
    tripId: null,
    trip: null
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ tripId: id });
      this.loadTripDetail();
    }
  },

  /**
   * 加载行程详情
   */
  async loadTripDetail() {
    try {
      showLoading('加载中...');
      const trip = await getTripDetail(this.data.tripId);
      this.setData({ trip });
    } catch (error) {
      showToast('加载失败');
    } finally {
      hideLoading();
    }
  }
});
