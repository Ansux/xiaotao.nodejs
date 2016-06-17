var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var OrderSchema = new mongoose.Schema({
    amount: Number
    , status: Number
    , receiver: String
    , addr: String
    , phone: Number
    , store: {
        type: ObjectId
        , ref: 'Store'
    }
    , buyer: {
        type: ObjectId
        , ref: 'Student'
    }
    , meta: {
        createAt: Date
        , deliverAt: Date
        , finishAt: Date
    }
});

OrderSchema.statics = {
    stuOrders: function (student, callback) {
        return this
            .find({
                buyer: student
            })
            .sort('meta.createAt')
            .exec(callback);
    }
    , StoreOrders: function (store, callback) {
        return this
            .find({
                store: store
            })
            .sort('meta.createAt')
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

module.exports = OrderSchema;