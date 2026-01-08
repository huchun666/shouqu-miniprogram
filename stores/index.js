// stores/index.js - 状态管理入口
/**
 * 简单的状态管理实现
 * 生产环境可以使用mobx-miniprogram或类似的状态管理库
 */

class Store {
  constructor() {
    this.state = {};
    this.listeners = [];
  }

  /**
   * 设置状态
   */
  setState(newState) {
    this.state = {
      ...this.state,
      ...newState
    };
    this.notify();
  }

  /**
   * 获取状态
   */
  getState() {
    return this.state;
  }

  /**
   * 订阅状态变化
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * 通知所有监听器
   */
  notify() {
    this.listeners.forEach(listener => {
      listener(this.state);
    });
  }
}

/**
 * 初始化状态管理
 */
export const initStore = () => {
  console.log('Store initialized');
};

export { Store };
export default Store;
