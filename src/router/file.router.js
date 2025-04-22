const Router = require("koa-router")
const fileRouter = new Router()
const multer = require('@koa/multer');
const upload = multer({ dest: 'tmp/' });
const qiniu = require('qiniu');
const { generateUploadToken, getQiniuConfig } = require('../utils/qiniu'); // 确保路径正确


// 设置七牛云域名的中间件
fileRouter.use((ctx, next) => {
  ctx.state.qiniuDomain = 'suhnxibtp.hb-bkt.clouddn.com'; // 替换为你的七牛云域名
  return next();
});

// 获取 Token 接口
fileRouter.get('/qiniu-token', (ctx) => {
  try {
    const token = generateUploadToken();
    ctx.body = { token };
  } catch (err) {
    ctx.throw(500, '生成 Token 失败', { error: err.message });
  }
});



// 上传到七牛云（后端代理模式，可选）
fileRouter.post('/upload', upload.single('image'), async (ctx) => {
 
    const file = ctx.file;
    const formatedName = `images/${Date.now()}_${file.originalname}`; // 重命名文件
    
    // 使用 SDK 上传到七牛云
    const config = getQiniuConfig(); // 根据 Bucket 区域设置
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    
    const response = await new Promise((resolve, reject) => {
      formUploader.putFile(
        generateUploadToken(), 
        formatedName, 
        file.path, 
        putExtra, 
        (err, respBody, respInfo) => {
          if (err) reject(err);
          resolve({ respBody, respInfo });
        }
      );
    });
    

      // 返回图片外链
      ctx.body = { 
        url: `http://${ctx.state.qiniuDomain}/${response.respBody.key}`
      };
    });


    module.exports = fileRouter