const jwt = require("jsonwebtoken");
const {PRIVATE_KEY} = require("../app/config");

class AuthController {
  async login(ctx, next) {
    try {
        const { id, username } = ctx.user;
        const token = jwt.sign({ id, username }, PRIVATE_KEY, {
            expiresIn: 60 * 60 * 24,
            algorithm: 'RS256'
          })
        ctx.body = {
          code: 200,
          data: { id, username, token },
          message: '',
      };
    } catch (error) {
        console.log(error, " id, error, token");
    
    }
  
  }
}

module.exports = new AuthController();
