const Router = require('koa-router')
const { create, update, remove, list  } = require('../controller/article.controller')
const { verifyAuth } = require('../middleware/auth.middleware')
const articleRouter = new Router({prefix: '/article'})

// 创建文章
articleRouter.post('/', verifyAuth, create)

// 修改文章
articleRouter.post('/:articleId', verifyAuth, update)

// 删除文章
articleRouter.delete('/:articleId', verifyAuth, remove)

// 文章列表
articleRouter.get('/', list)

module.exports = articleRouter