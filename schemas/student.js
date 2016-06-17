var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var StudentSchema = new mongoose.Schema({
    email: {
        unique: true
        , type: String
    }
    , pwd: String
    , avatar: String
    , sex: String
    , phone: Number
    , verifyInfo: {
        sno: Number
        , sname: String
        , voucher: String
    }
    , verify: Boolean
    , status: Boolean
    , role: {
        type: mongoose.Schema.Types.ObjectId
        , ref: 'Role'
    }
    , meta: {
        createAt: {
            type: Date
            , dafault: Date.now()
        }
        , updateAt: {
            type: Date
            , defaut: Date.now()
        }
    }
});

StudentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.verify = false;
        this.status = true;
        this.meta.createAt = this.meta.updateAt = Date.now();
        this.pwd = bcrypt.hashSync(this.pwd);
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

StudentSchema.methods = {
    validPwd: function (pwd, callback) {
        bcrypt.compare(pwd, this.pwd, function (err, res) {
            callback(res);
        });
    }
};

StudentSchema.statics = {
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
    , signin: function (email, pwd, callback) {
        return this
            .findOne({
                email: email
                , pwd: pwd
            })
            .exec(callback);
    }
    , password: function (id, pwd, callback) {
        return this
            .findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    pwd: bcrypt.hashSync(pwd)
                }
            }, null, callback)
    }
};

module.exports = StudentSchema;