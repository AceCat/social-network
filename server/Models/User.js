var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	email: String,
	password: String,
	posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
	friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', friendName: String}],
	profile: {
		firstName: String,
		lastName: String,
		title: String,
		affiliation: String,
		image: String,
		interests: Array
	}
})

var userModel = mongoose.model('User', UserSchema);

module.exports = userModel;