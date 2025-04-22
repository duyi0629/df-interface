const db = require("../app/database-mongodb");
const Article = require("./models/article.model");

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

class ArticleSearchService {
    constructor() {
        this.connectPromise = db.instance.connect().catch((error) => {
            console.error("Database connection initialization error:", error);
            throw error;
        });
        this.search = this.search.bind(this);
    }

    async ensureConnected() {
        await this.connectPromise;
        if (!db.isConnected()) {
            throw new Error("Database connection failed");
        }
    }

    async search(searchParams) {
        await this.ensureConnected();
        const query = {};
        const { keyword, category } = searchParams;
        console.log(searchParams, 'searchParams')

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { content: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        try {
            const articles = await Article.find(query).sort({ createdAt: -1 });
            if (articles.length === 0) {
                return []
            }
            return articles;
        } catch (error) {
            console.error("Error during article search:", error);
            throw error;
        }
    }
}

module.exports = new ArticleSearchService();    