const mongoose = require("mongoose");
const db = require("../app/database-mongodb");
const Article = require("./models/article.model");

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

class InvalidIdError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidIdError";
  }
}

class ArticleService {
  constructor() {
    this.connectPromise = db.instance.connect().catch((error) => {
      console.error("Database connection initialization error:", error);
      throw error;
    });

    // 绑定所有方法到实例
    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.list = this.list.bind(this);
  }

  async ensureConnected() {
    await this.connectPromise;
    if (!db.isConnected()) {
      throw new Error("Database connection failed");
    }
  }

  // 创建文章
  async create(articleData) {
    await this.ensureConnected();
    const timestamp = new Date().toISOString();
    const newArticle = new Article({
      ...articleData,
      createdAt: timestamp,
      updatedAt: timestamp,
    });


    return newArticle.save();
  }

  // 根据id查询文章
  async getById(articleId) {
    try {
      await this.ensureConnected();
      this.validateArticleId(articleId);
      const article = await Article.findById(articleId);
      if (!article) {
        throw new NotFoundError(`Article not found with ID: ${articleId}`);
      }
      return article;
    } catch (error) {
      console.log(this, "sss"); // 使用箭头函数，确保 this 指向正确
    }
  }

  // 更新文章
  async update(articleId, updateFields) {
    await this.ensureConnected();
    this.validateArticleId(articleId);
    const options = {
      new: true,
      runValidators: true,
    };
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      { ...updateFields, updatedAt: new Date().toISOString() },
      options
    );

    if (!updatedArticle) {
      throw new NotFoundError(`Article not found with ID: ${articleId}`);
    }
    return updatedArticle;
  }

  async remove(articleId) {
    await this.ensureConnected();
    this.validateArticleId(articleId);

    const result = await Article.deleteOne({ _id: articleId });
    if (result.deletedCount === 0) {
      throw new NotFoundError(`Article not found with ID: ${articleId}`);
    }
    return result;
  }

  async list(params) {
    // 解构赋值获取分页参数和关键词，设置默认值
    const { pageNum = 1, pageSize = 10, keyword = '' } = params;
    console.log(pageNum , pageSize, keyword, ' = 10')
    try {
        // 确保数据库连接
        await this.ensureConnected();
        // 计算跳过的记录数
        const skip = (pageNum - 1) * pageSize;
        // 构建查询条件
        const query = {};
        if (keyword) {
            // 假设文章标题包含关键词，可根据实际情况修改
            query.title = { $regex: keyword, $options: 'i' }; 
        }
        // 并行执行查询文章列表和统计文章总数的操作
        const [articles, totalCount] = await Promise.all([
            Article.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
            Article.countDocuments(query),
        ]);
        // 返回文章列表和分页信息
        return {
            articles,
            pageInfo: {
                pageNum: parseInt(pageNum),
                pageSize: parseInt(pageSize),
                totalCount
            },
        };
    } catch (error) {
        // 捕获并处理错误
        console.error('分页查询文章时出错:', error);
        throw error;
    }
}


  // 搜索
  async search(keyworld, page){
    
  }
  validateArticleId(articleId) {
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      throw new InvalidIdError(`Invalid article ID format: ${articleId}`);
    }
  }
}

module.exports = new ArticleService();
