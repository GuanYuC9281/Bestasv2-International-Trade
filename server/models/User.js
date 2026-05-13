const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用戶名為必填項目'],
    unique: true,
    trim: true,
    minlength: [3, '用戶名至少需要3個字元'],
    maxlength: [50, '用戶名不能超過50個字元']
  },
  email: {
    type: String,
    required: [true, '電子郵件為必填項目'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '請輸入有效的電子郵件地址']
  },
  password: {
    type: String,
    required: [true, '密碼為必填項目'],
    minlength: [6, '密碼至少需要6個字元']
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff'],
    default: 'staff'
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, '名字不能超過50個字元']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, '姓氏不能超過50個字元']
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  permissions: [{
    type: String,
    enum: [
      'news:read', 'news:write', 'news:delete',
      'contact:read', 'contact:write', 'contact:delete',
      'product:read', 'product:write', 'product:delete',
      'service:read', 'service:write', 'service:delete',
      'analytics:read',
      'settings:read', 'settings:write'
    ]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getFullName = function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.username;
};

userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.role === 'admin';
};

userSchema.statics.getDefaultPermissions = function(role) {
  const permissions = {
    admin: [
      'news:read', 'news:write', 'news:delete',
      'contact:read', 'contact:write', 'contact:delete',
      'product:read', 'product:write', 'product:delete',
      'service:read', 'service:write', 'service:delete',
      'analytics:read',
      'settings:read', 'settings:write'
    ],
    manager: [
      'news:read', 'news:write', 'news:delete',
      'contact:read', 'contact:write',
      'product:read', 'product:write', 'product:delete',
      'service:read', 'service:write', 'service:delete',
      'analytics:read'
    ],
    staff: [
      'news:read', 'news:write',
      'contact:read', 'contact:write',
      'product:read', 'product:write',
      'service:read', 'service:write'
    ]
  };
  
  return permissions[role] || permissions.staff;
};

userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
