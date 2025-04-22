const mongoose = require("mongoose");

// 定义用户Schema

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "用户名不能为空"],
      unique: true,
      trim: true,
      minlength: [3, "用户名不能少于3个字符"],
      maxlength: [20, "用户名不能超过20个字符"],
      match: [/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"],
    },
    password: {
      type: String,
      required: [true, "密码不能为空"],
      minlength: [6, "密码不能少于6个字符"],
      select: true, // 默认不返回密码字段
    },
    createdAt: { type: String },
    updatedAt: { type: String },
  },
  {
    timestamps: true, // 开启自动记录创建时间和更新时间
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
