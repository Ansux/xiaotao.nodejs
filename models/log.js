var mongoose = require('mongoose');
var LogSchema = require('../schemas/log');

var Log = mongoose.model('Log', LogSchema);
module.exporsts = Log;