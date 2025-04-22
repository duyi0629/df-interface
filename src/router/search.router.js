const Router = require('koa-router')

const { searchArticleList } = require('../controller/search.controller.js')

const searchRouter = new Router({prefix: '/search'})

// 文章搜索
searchRouter.get('/:keyword', searchArticleList)

module.exports = searchRouter