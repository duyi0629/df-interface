const mongoose = require('mongoose')

// 定义文章Schema
const userSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    createdAt: { type: String },
    updatedAt: { type: String }
})

const Article = mongoose.model('articles', userSchema)
module.exports = Article