const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    zh: { type: String, required: true },
    en: { type: String, required: true },
    ja: { type: String, required: true },
    vi: { type: String, required: true }
  },
  content: {
    zh: { type: String, required: true },
    en: { type: String, required: true },
    ja: { type: String, required: true },
    vi: { type: String, required: true }
  },
  category: {
    type: String,
    enum: ['company', 'industry', 'trends', 'cases'],
    required: true
  },
  excerpt: {
    zh: { type: String },
    en: { type: String },
    ja: { type: String },
    vi: { type: String }
  },
  image: {
    type: String,
    default: null
  },
  author: {
    type: String,
    default: '貝達國際貿易有限公司'
  },
  tags: [{
    type: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

newsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  if (this.isModified('title') && !this.excerpt) {
    Object.keys(this.title).forEach(lang => {
      this.excerpt[lang] = this.content[lang].substring(0, 150) + '...';
    });
  }
  
  next();
});

newsSchema.methods.getLocalizedContent = function(language = 'zh-TW') {
  const langMap = {
    'zh-TW': 'zh',
    'en': 'en',
    'ja': 'ja',
    'vi': 'vi'
  };
  
  const lang = langMap[language] || 'zh';
  
  return {
    _id: this._id,
    title: this.title[lang],
    content: this.content[lang],
    excerpt: this.excerpt[lang],
    category: this.category,
    image: this.image,
    author: this.author,
    tags: this.tags,
    isPublished: this.isPublished,
    isFeatured: this.isFeatured,
    publishedAt: this.publishedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

newsSchema.statics.getPublishedNews = function(language = 'zh-TW', limit = 10, skip = 0) {
  return this.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .skip(skip)
    .then(news => news.map(item => item.getLocalizedContent(language)));
};

newsSchema.statics.getFeaturedNews = function(language = 'zh-TW', limit = 3) {
  return this.find({ isPublished: true, isFeatured: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .then(news => news.map(item => item.getLocalizedContent(language)));
};

newsSchema.statics.getNewsByCategory = function(category, language = 'zh-TW', limit = 10) {
  return this.find({ isPublished: true, category })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .then(news => news.map(item => item.getLocalizedContent(language)));
};

module.exports = mongoose.model('News', newsSchema);
