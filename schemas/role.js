var mongoose = require('mongoose');
var RoleSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

RoleSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

RoleSchema.statics = {
  list: function(callback) {
    return this.find({})
      .sort('meta.createAt')
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

module.exports = RoleSchema;
