var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	title: String,
	affiliation: String,
	image: String,
	interests: Array
})

var profileModel = mongoose.model('Profile', ProfileSchema);

module.exports = profileModel;