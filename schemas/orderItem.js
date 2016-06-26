var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var OrderitemSchema = new mongoose.Schema({
    oid: {
        type: ObjectId
        , ref: 'Order'
    }
    , product: {
        type: ObjectId
        , ref: 'Product'
    }
    , price: Number
    , number: Number
    , isCommet: {
        type: Boolean
        , default: false
    }
    , comment: String
    , isReply: {
        type: Boolean
        , default: false
    }
    , reply: String
});

OrderitemSchema.statics = {
    findByOid: function (oid, callback) {
        return this
            .find({
                oid: oid
            })
            .populate('product', {
                name: 1
                , oriImg: 1
            })
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

module.exports = OrderitemSchema;
