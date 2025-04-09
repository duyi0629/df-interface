const jwt = require("jsonwebtoken");
const errorTypes = require("../constants/error-types");
const userService = require("../service/user.service");
const md5Password = require("../utils/password-handler");
const { PUBLIC_KEY } = require("../app/config");

const verifyLogin = async (ctx, next) => {
  console.log("verifyLogin", "验证登录的中间件");
  // 获取用户名和密码
  const { username, password } = ctx.request.body;

  // 2. 判断用户名, 密码是否为空
  if (!username || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error", error, ctx);
  }

  // 3. 判断用户是否存在
  const user = await userService.getUserByname(username);
  if (!user) {
    const error = new Error(errorTypes.USER_IS_NOT_EXISTS);
    return ctx.app.emit("error", error, ctx);
  }

  // 4. 判断密码是否与数据库中的一致
  if (md5Password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);
    return ctx.app.emit("error", error, ctx);
  }
  ctx.user = user;
  await next();
};

const verifyAuth = async (ctx, next) => {
  console.log("校验授权的中间件");
  // 1. 获取token
  const authorization = ctx.header.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit("error", error, ctx);
  }
  
  const token = authorization.replace("Bearer ", "");
  // 2. 验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit("error", error, ctx);
  }
};

const verifyPermission = async (ctx, next) => {
    console.log("验证权限的中间件~");

    
}



module.exports = {
  verifyLogin,
  verifyAuth
};
