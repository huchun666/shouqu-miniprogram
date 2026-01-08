// utils/logger.js - 日志系统
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const LOG_LEVEL = LOG_LEVELS.INFO; // 生产环境可以设置为WARN或ERROR

/**
 * 日志类
 */
class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100; // 最多保存100条日志
  }

  /**
   * 格式化日志
   */
  formatLog(level, message, data) {
    const timestamp = new Date().toISOString();
    return {
      level,
      timestamp,
      message,
      data: data || {}
    };
  }

  /**
   * 保存日志
   */
  saveLog(log) {
    this.logs.push(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Debug日志
   */
  debug(message, data) {
    if (LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      const log = this.formatLog('DEBUG', message, data);
      console.log(`[DEBUG] ${message}`, data);
      this.saveLog(log);
    }
  }

  /**
   * Info日志
   */
  info(message, data) {
    if (LOG_LEVEL <= LOG_LEVELS.INFO) {
      const log = this.formatLog('INFO', message, data);
      console.log(`[INFO] ${message}`, data);
      this.saveLog(log);
    }
  }

  /**
   * Warn日志
   */
  warn(message, data) {
    if (LOG_LEVEL <= LOG_LEVELS.WARN) {
      const log = this.formatLog('WARN', message, data);
      console.warn(`[WARN] ${message}`, data);
      this.saveLog(log);
    }
  }

  /**
   * Error日志
   */
  error(message, error) {
    if (LOG_LEVEL <= LOG_LEVELS.ERROR) {
      const log = this.formatLog('ERROR', message, {
        error: error?.message || error,
        stack: error?.stack
      });
      console.error(`[ERROR] ${message}`, error);
      this.saveLog(log);
      
      // 错误上报
      this.reportError(log);
    }
  }

  /**
   * 错误上报
   */
  reportError(log) {
    // TODO: 实现错误上报到服务器
    // 可以上报到监控平台如Sentry等
  }

  /**
   * 获取日志
   */
  getLogs(level = null) {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return this.logs;
  }

  /**
   * 清空日志
   */
  clearLogs() {
    this.logs = [];
  }
}

// 创建单例
const logger = new Logger();

/**
 * 初始化日志系统
 */
export const initLogger = () => {
  console.log('Logger initialized');
};

export { logger };
export default logger;
