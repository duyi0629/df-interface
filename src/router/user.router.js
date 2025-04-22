const Router = require('koa-router')
const { create, list } = require('../controller/user.controller')
const { verifyUser, handlePassword } = require('../middleware/user.middleware')
const { verifyAuth }  = require('../middleware/auth.middleware')
const userRouter = new Router({prefix: '/users'})

userRouter.post('/', verifyUser, handlePassword, create)

userRouter.get('/list', verifyAuth, list)

// userRouter.post('/',  create)

module.exports = userRouter