var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	message: String,
	author: String,
	authorId: String
})

var postModel = mongoose.model('Post', PostSchema);

module.exports = postModel;