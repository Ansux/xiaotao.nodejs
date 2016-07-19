var mongoose = require('mongoose');
var OrderitemSchema = require('../schemas/orderItem');

var Orderitem = mongoose.model('Orderitem', OrderitemSchema);
module.exports = Orderitem;
