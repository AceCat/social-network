var express = require('express')
var router = express.Router();
var Profile = require('../models/Profile.js')
var	bodyParser = require('body-parser');
var path = require('path');


router.use(bodyParser.urlencoded({extended: true}));



router.get('/:id', function(request, response) {
	var id = request.params.id;
	Profile.findById(id, function(err, profile){
		response.render("profile", profile)
	})
})


// router.get('/:id', function(request, response) {
// 	console.log(request.query);
// 	var index = request.query.id;
// 	var person = database[index];
// 	response.render("profile", person);
// })

router.get('/', function(request, res) {
	var profiles = Profile.find(function(err, profiles) {
		res.json(profiles)
	})
});

router.patch('/:id', function(request, response){
	var id = request.params.id;
	Profile.findById(id, function(err, profile){
		profile.firstName = request.body.firstName;
		profile.lastName = request.body.lastName;
		profile.title = request.body.title;
		profile.affiliation = request.body.affiliation;
		profile.image = request.body.image;
		profile.interests = request.body.interests;
		profile.save();
		response.json(profile);
	})
})

router.post('/', function(request, response){
	var profile = new Profile({
		firstName: request.body.firstName,
		lastName: request.body.lastName,
		title: request.body.title,
		affiliation: request.body.affiliation,
		image: request.body.image,
		interests: request.body.interests
		// interests: request.body.image,
		// friends: request.body.friends
	});
	profile.save();
	response.send(profile.id);	
});

router.delete('/:id', function(request, response) {
	var id = request.params.id;
	Profile.findById(id, function(err, profile){
		profile.remove()
		response.json('item removed');
	})

})

module.exports = router;