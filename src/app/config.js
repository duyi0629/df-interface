const dotenv = require("dotenv");
const fs = require('fs')
const path = require('path')

dotenv.config();

// const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key'));
// const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'))
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key'));
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'));

module.exports = {
  APP_HOST,
  APP_PORT,

  // mysql
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  // mongodb
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_DATABASE,
  MONGODB_USER,
  MONGODB_PASS,

  // 七牛云
  QINIU_ACCESS_KEY,
  QINIU_SECRET_KEY,
  QINIU_BUCKET
} = process.env;


module.exports.PRIVATE_KEY = PRIVATE_KEY
module.exports.PUBLIC_KEY = PUBLIC_KEY