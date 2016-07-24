var mongoose = require('mongoose');
var LogSchema = new mongoose.Schema({
  type: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  user: String,
  remark: String,
  createAt: {
    type: Date,
    default: Date.now()
  }
});

LogSchema.statics = {
  list: function(callback) {
    return this
      .find({})
      .sort('createAt')
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

module.exports = LogSchema;
