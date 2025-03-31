const errorTypes = require('../constants/error-types')
const userService = require('../service/user.service')
const md5Password = require('../utils/password-handler')

const verifyUser = async (ctx, next) => {
    console.log('verifyUser中间件')
    // 获取用户名和密码
    const { username, password } = ctx.request.body
    console.log(username, password, 'name')

    // 2. 判断用户名, 密码是否为空
    if(!username || !password) {
        const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
        return ctx.app.emit('error', error, ctx)
    }

    // 3. 判断注册的用户是否注册过
    const result = await userService.getUserByname(username);
    if(result){
        const error = new Error(errorTypes.USER_ALREADY_EXISTS)
        return ctx.app.emit('error', error, ctx)
    }

    await next()
}


const handlePassword = async (ctx, next) => {
    const { password } = ctx.request.body;
    ctx.request.body.password = md5Password(password)
     await next()
}

module.exports = {
    verifyUser,
    handlePassword
}