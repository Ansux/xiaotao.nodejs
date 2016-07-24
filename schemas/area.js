var mongoose = require('mongoose');
var AreaSchema = new mongoose.Schema({
  name: String,
  createAt: {
    type: Date,
    default: Date.now()
  }
});

AreaSchema.statics = {
  list: function(callback) {
    return this
      .find({})
      .sort({
        'createAt': -1
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

module.exports = AreaSchema;
