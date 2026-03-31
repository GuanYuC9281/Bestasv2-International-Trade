const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
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
    enum: ['procurement', 'import-export', 'matching', 'quotation', 'coordination', 'tracking'],
    required: true
  },
  icon: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  features: {
    zh: [{ type: String }],
    en: [{ type: String }],
    ja: [{ type: String }],
    vi: [{ type: String }]
  },
  order: {
    type: Number,
    default: 0
  },
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

serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

serviceSchema.methods.getLocalizedContent = function(language = 'zh-TW') {
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
    description: this.description[lang],
    category: this.category,
    icon: this.icon,
    image: this.image,
    features: this.features ? this.features[lang] : [],
    order: this.order,
    isFeatured: this.isFeatured,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

serviceSchema.statics.getFeaturedServices = function(language = 'zh-TW', limit = 3) {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ order: 1 })
    .limit(limit)
    .then(services => services.map(item => item.getLocalizedContent(language)));
};

serviceSchema.statics.getServicesByCategory = function(category, language = 'zh-TW') {
  return this.find({ isActive: true, category })
    .sort({ order: 1 })
    .then(services => services.map(item => item.getLocalizedContent(language)));
};

module.exports = mongoose.model('Service', serviceSchema);
