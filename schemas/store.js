var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var StoreSchema = new mongoose.Schema({
  email: {
    unique: true,
    type: String
  },
  pwd: String,
  safePwd: String,
  avatar: String,
  name: String,
  intro: String,
  license: String,
  owner: String,
  ownerId: String,
  ownerIdCard: String,
  phone: String,
  verify: Boolean,
  status: Boolean,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  meta: {
    createAt: Date,
    updateAt: Date
  }
});

StoreSchema.pre('save', function(next) {
  if (this.isNew) {
    this.verify = false;
    this.status = true;
    this.meta.createAt = this.meta.updateAt = Date.now();
    this.pwd = bcrypt.hashSync(this.pwd);
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

StoreSchema.methods = {
  validPwd: function(pwd, callback) {
    bcrypt.compare(pwd, this.pwd, function(err, res) {
      callback(res);
    });
  },
  validSafePwd: function(pwd, callback) {
    bcrypt.compare(pwd, this.safePwd, function(err, res) {
      callback(res);
    });
  }
};

StoreSchema.statics = {
  list: function(callback) {
    return this
      .find({})
      .sort({
        'meta.createAt': -1
      })
      .exec(callback);
  },
  findById: function(id, callback) {
    return this
      .findOne({
        _id: id
      })
      .exec(callback);
  }
};

module.exports = StoreSchema;
