const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    zh: { type: String, required: true },
    en: { type: String, required: true },
    ja: { type: String, required: true },
    vi: { type: String, required: true }
  },
  description: {
    zh: { type: String, required: true },
    en: { type: String, required: true },
    ja: { type: String, required: true },
    vi: { type: String, required: true }
  },
  category: {
    type: String,
    enum: ['hardware', 'machinery', 'construction', 'custom'],
    required: true
  },
  specifications: {
    zh: { type: String },
    en: { type: String },
    ja: { type: String },
    vi: { type: String }
  },
  images: [{
    type: String
  }],
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['TWD', 'USD', 'EUR', 'JPY'],
    default: 'TWD'
  },
  minOrderQuantity: {
    type: Number,
    default: 1
  },
  leadTime: {
    type: String,
    default: '30 days'
  },
  tags: [{
    type: String
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
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

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

productSchema.methods.getLocalizedContent = function(language = 'zh-TW') {
  const langMap = {
    'zh-TW': 'zh',
    'en': 'en',
    'ja': 'ja',
    'vi': 'vi'
  };
  
  const lang = langMap[language] || 'zh';
  
  return {
    _id: this._id,
    name: this.name[lang],
    description: this.description[lang],
    specifications: this.specifications ? this.specifications[lang] : null,
    category: this.category,
    images: this.images,
    price: this.price,
    currency: this.currency,
    minOrderQuantity: this.minOrderQuantity,
    leadTime: this.leadTime,
    tags: this.tags,
    isFeatured: this.isFeatured,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

productSchema.statics.getFeaturedProducts = function(language = 'zh-TW', limit = 6) {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .then(products => products.map(item => item.getLocalizedContent(language)));
};

productSchema.statics.getProductsByCategory = function(category, language = 'zh-TW', limit = 20) {
  return this.find({ isActive: true, category })
    .sort({ createdAt: -1 })
    .limit(limit)
    .then(products => products.map(item => item.getLocalizedContent(language)));
};

productSchema.statics.searchProducts = function(searchTerm, language = 'zh-TW', limit = 20) {
  const langMap = {
    'zh-TW': 'zh',
    'en': 'en',
    'ja': 'ja',
    'vi': 'vi'
  };
  
  const lang = langMap[language] || 'zh';
  
  return this.find({
    isActive: true,
    $or: [
      { [`name.${lang}`]: { $regex: searchTerm, $options: 'i' } },
      { [`description.${lang}`]: { $regex: searchTerm, $options: 'i' } },
      { [`specifications.${lang}`]: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .then(products => products.map(item => item.getLocalizedContent(language)));
};

module.exports = mongoose.model('Product', productSchema);
