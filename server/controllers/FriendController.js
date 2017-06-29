var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: true}));

//patch request to /friends/id
router.patch('/:id', function(request, response) {
  console.log('patch request working')
  var activeUserId = request.params.id;
  var newFriendId = request.body.friendId;
  User.findById(activeUserId, function(error, user) {
    user.friends.push(newFriendId);
    user.save();
    response.send('request worked')
  })
})

module.exports = router;
