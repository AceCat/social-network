var fs = require('fs');
var express = require('express');
var path = require('path');
var app = express();
var session = require('express-session');
var server = require('http').createServer(app);

app.use(session({
	secret: "I'm very secretive",
	resave: false,
	saveUnitialized: true,
	cookie: {secure: false}
}));

	require('./db/db.js')
	var UsersController = require('./controllers/UsersController.js')
	var PostController = require('./controllers/PostController.js')
	var FriendsController = require('./controllers/FriendController.js')

	// var ProfilesController = require('./controllers/ProfilesController.js')



//This instructs the server to check and upload static paths first
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/profiles', ProfilesController);
app.use('/friends', FriendsController);
app.use('/users', UsersController);
app.use('/posts', PostController);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.get('/home', function (req, res) {
	res.render('home')
})

app.get('/friends', function (req, res) {
	res.render('friends')
})

server.listen(3000, function () {
	console.log("listening on port 3000")
})