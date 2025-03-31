const { create, update, remove, list } = require("../service/article.service");

class ArticleController {
  async create(ctx, next) {
    const { title, content } = ctx.request.body;
    console.log(title, content);

    if (!title || !content) {
      ctx.status = 400;
      ctx.body = { message: "标题、内容和作者是必填项" };
      return;
    }
    const result = await create({ title, content });
    ctx.body = {
      code: 200,
      data: '已发布'
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
    const result = await list();
    ctx.body = {
      code: 200,
      data: result,
    };
  }
}

module.exports = new ArticleController();
