const Router = require('koa-router')
const { create, update, remove, list, getById, searchList  } = require('../controller/article.controller')
const { verifyAuth } = require('../middleware/auth.middleware')
const articleRouter = new Router({prefix: '/article'})


// 文章列表薪火集
articleRouter.get('/list', list)

// 创建文章
articleRouter.post('/', verifyAuth, create)

// 修改文章
articleRouter.post('/:articleId', verifyAuth, update)

// 删除文章
articleRouter.delete('/:articleId', verifyAuth, remove)

// 文章详情
articleRouter.get('/:articleId', getById)



module.exports = articleRouter