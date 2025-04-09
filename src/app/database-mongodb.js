const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
const autopopulate = require('mongoose-autopopulate');
mongoose.plugin(slug);
mongoose.plugin(autopopulate);

async function main() {
  // 这块用127.0.0.1 避免用localhost 可能会访问到ipv6的地址
  const uri = "mongodb://127.0.0.1:27017/codehub"; // 明确指定数据库名
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 5秒连接超时
    });
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // 退出进程（适用于启动时连接失败的情况）
  }
}

// 如果是应用入口文件，可以直接调用并处理错误
main().catch(console.error);

module.exports = main;