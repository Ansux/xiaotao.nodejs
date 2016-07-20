var mongoose = require('mongoose');
var ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  oriImg: String,
  thumbImg: String,
  sales: Number,
  isOnsale: Boolean,
  isDelete: Boolean,
  detail: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },
  meta: {
    createAt: Date,
    updateAt: Date
  }
});

ProductSchema.pre('save', function(next) {
  if (this.isNew) {
    this.isDelete = false;
    this.meta.createAt = this.meta.updateAt = Date.now();
    this.sales = 0;
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

ProductSchema.statics = {
  list: function(limit, page, callback) {
    return this
      .find()
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({
        'meta.createAt': -1
      })
      .exec(callback);
  },
  count: function (callback) {
    return this
      .find()
      .count()
      .exec(callback);
  },
  store: function(sid, callback) {
    return this
      .find({
        store: sid
      })
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
      .populate('store', {
        'avatar': 1,
        'name': 1
      })
      .exec(callback);
  }
};

module.exports = ProductSchema;
