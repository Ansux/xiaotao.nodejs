var mongoose = require('mongoose');
var StudentSchema = require('../schemas/student');
var Student = mongoose.model('Student', StudentSchema);

module.exports = Student;