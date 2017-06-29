var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var User = require('../models/User');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));

// post request to /posts
router.post('/', function(request, response){
  console.log('hitting the route');
  var postMessage = request.body.message;
  var author = request.body.author;
  var authorId = request.body.authorId;
  var post = new Post({message: postMessage, author: author, authorId: authorId});
  post.save();
  // get the id of the user that recieved the post
  var userId = request.body.userId;
  // grab the user with that id
  User.findById(userId).populate('posts').exec(function (error, user){
    // get the mongoose id of the recently saved post
    var postId = post.id
    // push the post id in to the user posts array
    user.posts.push(postId);
    user.save();
    console.log(user)
  response.redirect(request.get('referer'));
  })
})

module.exports = router;
