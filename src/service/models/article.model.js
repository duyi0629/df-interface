const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SEOSchema = new Schema({
  meta_title: { type: String, maxlength: 60 },
  meta_description: { type: String, maxlength: 160 }, 
  keywords: [{ type: String }],
  canonical_url: { type: String }
}, { _id: false });

const AuthorInfoSchema = new Schema({
  bio: { type: String },
  avatar: { type: String },
  social_links: [{ 
    platform: { type: String, enum: ['twitter', 'linkedin', 'github'] },
    url: String 
  }]
}, { _id: false });

const StatsSchema = new Schema({
  views: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: {
    facebook: { type: Number, default: 0 },
    twitter: { type: Number, default: 0 },
    linkedin: { type: Number, default: 0 }
  }
}, { _id: false });

// 主Schema
const ArticleSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 120 
  },
  description: { type: String },
  authors: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  publish_date: { 
    type: Date, 
    default: Date.now 
  },
  last_modified: { 
    type: Date, 
    default: Date.now 
  },

  // SEO优化
  seo: SEOSchema,

  // 内容结构
  content: { 
    type: String, 
    required: true 
  },
  excerpt: { 
    type: String, 
    maxlength: 200 
  },
  cover_image: { type: String },
  media: [{
    type: { 
      type: String, 
      enum: ['image', 'video', 'audio'] 
    },
    url: String,
    caption: String
  }],
  toc: [{ 
    level: Number, 
    title: String, 
    anchor: String 
  }],

  // 分类与标签
  category: {
    main: { 
      type: String, 
      required: true,
      enum: ['星火集', '碎碎念'] 
    },
    sub: { type: String }
  },
  tags: [{ 
    type: String, 
    maxlength: 20 
  }],

  // 互动统计
  stats: StatsSchema,

  // 高级功能
  translations: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Article' 
  }],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived', 'private'],
    default: 'draft' 
  },
  password: { 
    type: String, 
    select: false // 默认查询时排除该字段
  },
  author_info: AuthorInfoSchema,
  article_source: { 
    type: String, 
    enum: ['original', 'repost', 'translation'] 
  },
  structured_data: Schema.Types.Mixed,
  related_articles: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Article' 
  }],
  custom_fields: Schema.Types.Mixed,

  // 其他实用字段
  version_history: [{
    timestamp: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    changes: String
  }],
  scheduled_publish: { type: Date },
  downloads: [{
    name: String,
    url: String,
    size: Number
  }]
}, { 
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at' 
  },
  toJSON: { virtuals: true } // 允许虚拟字段出现在JSON输出中
});

// 虚拟字段：自动计算阅读时间（约200字/分钟）
ArticleSchema.virtual('reading_time').get(function() {
  const wordCount = this.content ? this.content.split(/\s+/).length : 0;
  return Math.ceil(wordCount / 200);
});

// 中间件：保存时更新最后修改时间
ArticleSchema.pre('save', function(next) {
  this.last_modified = new Date();
  next();
});



// 创建索引
ArticleSchema.index({ title: 'text', content: 'text' }); // 全文搜索
ArticleSchema.index({ 'category.main': 1, tags: 1 });     // 分类标签查询优化

module.exports = mongoose.model('Article', ArticleSchema);