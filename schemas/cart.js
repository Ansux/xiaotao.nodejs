var mongoose = require('mongoose');
var CartSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  stores: [{
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store'
    },
    prolist: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      number: {
        type: Number,
        default: 1
      }
    }]
  }],
  meta: {
    createAt: Date,
    updateAt: Date
  }
});

CartSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

CartSchema.statics = {
  list: function(student, callback) {
    return this
      .findOne({
        student: student
      })
      .populate('stores.store', {
        'name': 1
      })
      .populate('stores.prolist.product', {
        'name': 1,
        'price': 1,
        'stock': 1,
        'oriImg': 1
      })
      .sort({
        'meta.createAt': -1
      })
      .exec(callback);
  },
};

module.exports = CartSchema;
