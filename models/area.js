var mongoose = require('mongoose');
var AreaSchema = require('../schemas/area');
var Area = mongoose.model('Area', AreaSchema);

module.exports = Area;