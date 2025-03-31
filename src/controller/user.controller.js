const userService  = require('../service/user.service')
class UserController {
    async create(ctx, next) {
        // 获取用户信息
        const user = ctx.request.body;
        // 查询数据
        const result = await userService.create(user);
        // 返回数据
        ctx.body = {
            code: 200,
            data: result,
            message: '',
        };
    }


    async list(ctx, next) {
        const result = await userService.getUserList()
         // 返回数据
         ctx.body = {
            code: 200,
            data: result,
            message: '',
        };
    }
}

module.exports = new UserController()