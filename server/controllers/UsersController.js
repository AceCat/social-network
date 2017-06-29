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
  response.render('edit', request.session)
})


router.get('/', function(request, response){
  User.find(function(error, users) {
    response.json(users)
  })
});

router.get('/logout', function(request, response) {
  console.log('working')
  request.session.loggedIn = false;
  response.redirect('/users/login');
})

router.get('/:id', function(request, response) {
  var id = request.params.id;
  var onOwnPage = "";
  if (id === request.session.sessionId) {
    onOwnPage = true
  } else {
    onOwnPage = false
  }

  // User.findById(authorId, function(err, user) {
  //   var postAuthor = user.profile.firstName + user.profile.lastName;
  // })

  User.findById(id).populate('posts').populate('friends').exec(function(err, user){
    var pageLoad = {
      ownPage: onOwnPage,
      user: user,
      session: request.session
    }
    response.render("profile", pageLoad)
  })
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
  User.findById(activeUserId, function(error, user) {
    var friendId = request.body.friendId;
    user.friends.push(friendId);
    user.save();
    response.json(user);
  })
});

module.exports = router;