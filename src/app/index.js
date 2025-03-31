const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const cors = require('koa2-cors');
const useRoutes = require('../router')
const errorHandler = require('./error-handler')
const app = new Koa();

// 处理跨域
app.use(cors({
  origin: [ 'http://localhost:5173'], // 允许的源
  methods: ['GET', 'POST', 'PUT', 'DELETE'],        // 允许的方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],  // 允许的请求头
  credentials: true, // 允许携带凭证（如cookies）
  maxAge: 86400      // 预检请求缓存时间（秒）
})); 

// 参数解析
app.use(bodyparser())
app.useRoutes = useRoutes
app.useRoutes();


app.on('error', errorHandler)


module.exports = app