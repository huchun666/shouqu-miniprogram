// utils/update.js - 小程序更新检查
/**
 * 检查小程序更新
 */
export const checkUpdate = () => {
  if (wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        console.log('发现新版本');
      }
    });

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: (res) => {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(() => {
      console.error('新版本下载失败');
      wx.showToast({
        title: '更新失败',
        icon: 'none'
      });
    });
  } else {
    // 不支持自动更新，提示用户手动更新
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用自动更新功能，请升级到最新微信版本后重试。'
    });
  }
};

export default {
  checkUpdate
};
