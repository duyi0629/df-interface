const mongoose = require('mongoose')

// 定义用户Schema

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    createdAt: { type: String },
    updatedAt: { type: String }
}, { 
    timestamps: true,  // 开启自动记录创建时间和更新时间
})

const User = mongoose.model('users', userSchema)
module.exports = User