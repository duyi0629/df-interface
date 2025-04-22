const mongoose = require("mongoose");
const autopopulate = require('mongoose-autopopulate');
const config = require('./config')

// 单例连接实例
let cachedConnection = null;

// 配置化参数（建议通过环境变量配置）
const DB_CONFIG = {
  HOST: config.MONGODB_HOST || '127.0.0.1',
  PORT: config.MONGODB_PORT || 27017,
  NAME: config.MONGODB_DATABASE || 'codehub',
  USER: config.MONGODB_USER,
  PASS: config.MONGODB_PASS,
  OPTIONS: {
    serverSelectionTimeoutMS: 5000,      // 服务器选择超时
    socketTimeoutMS: 45000,              // socket 超时
    maxPoolSize: 10,                     // 连接池大小
    minPoolSize: 2,                     // 最小保持连接数
    heartbeatFrequencyMS: 30000,        // 心跳检测间隔
    autoIndex: process.env.NODE_ENV!== 'production', // 生产环境关闭自动索引
    bufferCommands: false               // 禁用缓冲命令
  }
};

// 自动注册插件
mongoose.plugin(autopopulate);

class Database {
  constructor() {
    if (!cachedConnection) {
      this.connection = null;
      this.connect();
    }
    return cachedConnection;
  }

  async connect() {
    if (cachedConnection) {
      return cachedConnection;
    }

    try {
      // 构造连接字符串
      const auth = DB_CONFIG.USER? 
        `${encodeURIComponent(DB_CONFIG.USER)}:${encodeURIComponent(DB_CONFIG.PASS)}@` : '';
      const uri = `mongodb://${auth}${DB_CONFIG.HOST}:${DB_CONFIG.PORT}/${DB_CONFIG.NAME}`;

      console.log(auth, DB_CONFIG.USER, process.env.MONGODB_USER,  'uri')


      // 添加事件监听（确保只监听一次）
      if (!mongoose.connection.listenerCount('connected')) {
        mongoose.connection.on('connected', () => {
          console.log('MongoDB connected successfully');
        });

        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB connection lost');
        });

        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });
      }

      // 实际建立连接
      cachedConnection = await mongoose.connect(uri, DB_CONFIG.OPTIONS);
      
      // 添加关闭连接时的清理
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      });

      return cachedConnection;
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  // 添加健康检查方法
  async healthCheck() {
    try {
      await mongoose.connection.db.admin().ping();
      return {
        status: 'OK',
        dbVersion: await this.getServerVersion()
      };
    } catch (error) {
      return {
        status: 'DOWN',
        error: error.message
      };
    }
  }

  // 获取服务器信息
  async getServerVersion() {
    const buildInfo = await mongoose.connection.db.admin().buildInfo();
    return buildInfo.version;
  }
}

// 单例导出
module.exports = {
  instance: new Database(),
  mongoose,
  
  // 方便其他模块使用的快捷方法
  getConnection: () => mongoose.connection,
  isConnected: () => mongoose.connection.readyState === 1,
  
  // 直接导出重要属性
  Schema: mongoose.Schema,
  model: mongoose.model,
  Types: mongoose.Types
};