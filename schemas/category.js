var mongoose = require('mongoose');
var CategorySchema = new mongoose.Schema({
    name: String
    , intro: String
    , verify: Boolean
    , pid: {
        type: mongoose.Schema.Types.ObjectId
        , ref: 'Category'
    }
    , createAt: {
        type: Date
        , default: Date.now()
    }
});

CategorySchema.statics = {
    list: function (callback) {
        return this
            .find({})
            .sort('createAt')
            .exec(callback);
    }
    , findById: function (id, callback) {
        return this
            .findOne({
                _id: id
            })
            .exec(callback);
    }
};

module.exports = CategorySchema;