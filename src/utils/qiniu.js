// utils/qiniu.js
const qiniu = require('qiniu');
const config = require("../app/config");

const accessKey = process.env.QINIU_ACCESS_KEY;
const secretKey = process.env.QINIU_SECRET_KEY;
const bucket = process.env.QINIU_BUCKET; // Bucket 名称
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// 生成上传 Token（有效期内可重复使用）
const generateUploadToken = () => {
    try {
        const options = {
            scope: bucket,
            expires: 7200 // 2小时有效期
        };
        const putPolicy = new qiniu.rs.PutPolicy(options);
        return putPolicy.uploadToken(mac);
    } catch (error) {
        console.error('生成七牛云上传 Token 时出错:', error);
        throw new Error('生成七牛云上传 Token 失败');
    }
};

// 获取七牛云配置
const getQiniuConfig = () => {
    const zone = qiniu.zone.Zone_z1; // 根据实际情况修改区域
    return new qiniu.conf.Config({ zone });
};

module.exports = { generateUploadToken, getQiniuConfig };