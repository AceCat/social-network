var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bodyParser = require('body-parser');
var path = require('path');
var bcrypt = require('bcrypt');


router.use(bodyParser.urlencoded({extended: true}));

router.get('/login', function(request, response) {
  response.render('login')
})

router.get('/register', function(request, response) {
  if (request.session.loggedIn === true) {
    response.render('home')
  } else {
  response.render('register')
  }
})

router.get('/edit/:id', function(request, response) {
  var id = request.params.id;
  User.findById(id, function(err, user){
    var sendOver = {user: user, session: request.session}
    console.log(sendOver);
    response.render('edit', sendOver)

  })
})


router.get('/', function(request, response){
  User.find(function(error, users) {
      var session = request.session;
      var allUsers = {allUsers: users, session: session};
    response.render('allUsers', allUsers);
  })
});

router.get('/logout', function(request, response) {
  console.log('working')
  request.session.loggedIn = false;
  response.redirect('/users/');
})

router.get('/:id', function(request, response) {
  var id = request.params.id;
  var onOwnPage = "";
  if (id === request.session.sessionId) {
    onOwnPage = true
  } else {
    onOwnPage = false
  }
  if (request.session.loggedIn === true) {
  User.findById(id).populate('posts').populate('friends').exec(function(err, user){
    var pageLoad = {
      ownPage: onOwnPage,
      user: user,
      session: request.session
    }
    response.render("profile", pageLoad)
  })
} else {
  response.redirect("/users/login")
}
});



//Post request to /users/login
router.post('/login', function(request, response){
  User.findOne({email: request.body.email}, function(error, user){
    if(user){
      bcrypt.compare(request.body.password, user.password, function(error, match){
        if (match === true) {
          request.session.loggedIn = true;
          request.session.sessionId = user.id;
          request.session.userName = user.profile.firstName + " " + user.profile.lastName;
          response.redirect("/users/" + user.id)
        } else {
          response.send("That's the wrong passwordy you scallywag")
        }
      })
    } else {
      response.send("Email not found you liar.")
    }
  })
})

//post request to /users/
router.post('/', function(request, response){
  bcrypt.hash(request.body.password, 10, function(error, hash){
    console.log(hash);
    var user = new User({
      email: request.body.email,
      password: hash,
      profile: {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        title: request.body.title,
        affiliation: request.body.affiliation,
        image: request.body.image
      }})
  user.save();
    request.session.loggedIn = true;
    request.session.sessionId = user.id;
    request.session.userName = user.profile.firstName + " " + user.profile.lastName;
  response.send(user.id)

  })
})

//patch request to users/
router.patch('/edit/:id', function(request, response){
  var id = request.params.id;
  User.findById(id, function(err, user){
    user.profile.firstName = request.body.firstName;
    user.profile.lastName = request.body.lastName;
    user.profile.title = request.body.title;
    user.profile.affiliation = request.body.affiliation;
    user.profile.image = request.body.image;
    user.profile.interests = request.body.interests;
    user.save();
    response.send(id);
  })
})

//This adds a new friend ID to the friend array
router.post('/friends/:id', function(request, response){
  var activeUserId = request.params.id;
  // var newFriendId = request.body.friendId;
  // console.log(newFriendId);
  User.update({_id: activeUserId}, {$addToSet: {friends: request.body.friendId}}, function(err, user) {
    response.redirect('/users/' + activeUserId);
  })
    // var friendId = request.body.friendId;
    // user.friends.push(friendId);
    // user.save();
    // response.json(user);
  })
// });

router.delete('/:id', function(request, response) {
  var id = request.params.id;
  User.findById(id, function(err, user){
    user.remove()
    response.json('item removed');
  })

})

module.exports = router;