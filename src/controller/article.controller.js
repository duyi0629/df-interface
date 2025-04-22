const { create, getById, update, remove, list } = require("../service/article.service");

class ArticleController {
  async create(ctx, next) {
    const { title, content } = ctx.request.body;
    if (!title || !content) {
      ctx.status = 400;
      ctx.body = { message: "标题、内容和作者是必填项" };
      return;
    }
    const result = await create(ctx.request.body);
    ctx.body = {
      code: 200,
      data: "已发布",
    };
  }

  async getById(ctx, next) {
    const { articleId } = ctx.params;
    const result = await getById(articleId);
    ctx.body = {
      code: 200,
      message: "",
      data: result,
    };
  }

  async update(ctx, next) {
    const { articleId } = ctx.params;
    const { title, content } = ctx.request.body;
    const result = await update({ articleId, title, content });
    ctx.body = {
      code: 200,
      message: "已更新",
      data: result,
    };
  }

  async remove(ctx, next) {
    const { articleId } = ctx.params;
    const result = await remove({ articleId });
    ctx.body = {
      data: {
        code: 200,
        message: "已删除",
        data: "",
      },
    };
  }

  async list(ctx, next) {
    const { articles, pageInfo} = await list(ctx.request.body);
    ctx.body = {
      code: 200,
      data: articles,
      pageInfo
    };
  }
}

module.exports = new ArticleController();
