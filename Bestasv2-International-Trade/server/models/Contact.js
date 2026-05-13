const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '姓名為必填項目'],
    trim: true,
    maxlength: [100, '姓名不能超過100個字元']
  },
  email: {
    type: String,
    required: [true, '電子郵件為必填項目'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '請輸入有效的電子郵件地址']
  },
  phone: {
    type: String,
    required: [true, '電話為必填項目'],
    trim: true
  },
  company: {
    type: String,
    trim: true,
    maxlength: [200, '公司名稱不能超過200個字元']
  },
  subject: {
    type: String,
    required: [true, '主題為必填項目'],
    trim: true,
    maxlength: [200, '主題不能超過200個字元']
  },
  message: {
    type: String,
    required: [true, '訊息內容為必填項目'],
    trim: true,
    maxlength: [2000, '訊息內容不能超過2000個字元']
  },
  category: {
    type: String,
    enum: ['general', 'procurement', 'partnership', 'support', 'other'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'responded', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: String,
    default: null
  },
  notes: [{
    content: String,
    author: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
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

contactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

contactSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

contactSchema.statics.getRecentContacts = function(limit = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit);
};

contactSchema.statics.getContactsByCategory = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);
};

contactSchema.methods.addNote = function(content, author) {
  this.notes.push({
    content,
    author,
    createdAt: new Date()
  });
  return this.save();
};

contactSchema.methods.updateStatus = function(status, assignedTo = null) {
  this.status = status;
  if (assignedTo) {
    this.assignedTo = assignedTo;
  }
  return this.save();
};

module.exports = mongoose.model('Contact', contactSchema);
