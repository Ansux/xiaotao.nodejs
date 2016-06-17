var mongoose = require('mongoose');
var AddressSchema = new mongoose.Schema({
    area: {
        type: mongoose.Schema.Types.ObjectId
        , ref: 'Area'
    }
    , receiver: String
    , addr: String
    , phone: Number
    , remark: String
    , isDefault: Boolean
    , student: {
        type: mongoose.Schema.Types.ObjectId
        , ref: 'Student'
    }
    , meta: {
        createAt: Date
        , updateAt: Date
    }
});

AddressSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

AddressSchema.statics = {
    list: function (callback) {
        return this
            .find({})
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

module.exports = AddressSchema;