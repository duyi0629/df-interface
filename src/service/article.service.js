const moment = require("moment");
const connectToDatabase = require("../app/database-mongodb");
const Article = require("./models/article.model");

class ArticleService {
  async create(data) {
    const { title, content } = data;
    await connectToDatabase();
    const now = moment();
    const formattedNow = now.format("YYYY-MM-DD HH:mm:ss");
    const newArticle = new Article({
      title,
      content,
      createdAt: formattedNow,
      updatedAt: formattedNow,
    });
    const result = await newArticle.save();
    return result;
  }

  async update(data) {
    try {
      const { articleId, title, content } = data;
      const now = moment();
      const formattedNow = now.format("YYYY-MM-DD HH:mm:ss");
      await connectToDatabase();
      const result = Article.findOneAndUpdate(
        { _id: articleId },
        { title, content, updatedAt: formattedNow }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(data) {
    try {
      const { articleId } = data;
      console.log(articleId, articleId, 'articleId')
      await connectToDatabase();
      const result = Article.deleteOne({ _id: articleId });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async list() {
    try {
      await connectToDatabase();
      const result = Article.find();
      return result;
    } catch (error) {}
  }
}

module.exports = new ArticleService();
