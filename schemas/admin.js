var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var AdminSchema = new mongoose.Schema({
  email: {
    unique: true,
    type: String
  },
  pwd: String,
  avatar: String,
  phone: String,
  verify: Boolean,
  status: Boolean,
  meta: {
    createAt: Date,
    updateAt: Date
  }
});

AdminSchema.pre('save', function(next) {
  if (this.isNew) {
    this.verify = false;
    this.status = false;
    this.meta.createAt = this.meta.updateAt = Date.now();
    this.pwd = bcrypt.hashSync(this.pwd);
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

AdminSchema.methods = {
  validPwd: function(pwd, callback) {
    bcrypt.compare(pwd, this.pwd, function(err, res) {
      callback(res);
    });
  }
};

AdminSchema.statics = {
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

module.exports = AdminSchema;
