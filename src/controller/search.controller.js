const { search } = require('../service/article.search.service')

class SearchController {
    async searchArticleList(ctx, next) {
        const { keyword } = ctx.params
        const res = await search({ keyword })
        ctx.body = {
            code: 200,
            articles: res
        }
    }
}

module.exports = new SearchController()