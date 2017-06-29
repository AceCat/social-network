var createButton = $("#createAccount");
var deleteButton = $('.delete');
var createUser = $('#createUser');

createButton.click(function (){
	console.log('clicked')
	var firstName = $("#firstName").val();
	var lastName = $("#lastName").val();
	var title = $("#title").val();
	var affiliation = $("#affiliation").val();
	var image = $("#image").val();
	var newProfile = {
		firstName: firstName,
		lastName: lastName,
		title: title,
		image: image,
	};

	$.ajax({
		method: "POST",
		url: "http://localhost:3000/profiles",
		data: newProfile,
		success: function(response){
			var dataId = response
			window.location.href = ("http://localhost:3000/profiles/" + dataId);
		}
	})
});

createUser.click(function (){
	var email = $("#emailForm").val();
	var password = $('#passwordForm').val();
	var newUser = {
		email: email,
		password: password
	};
	$.ajax({
		method: "POST",
		url: "http://localhost:3000/users",
		data: newUser,
		success: function(response){
			var dataId = response;
			window.location.href = ("http://localhost:3000/users/" + dataId)
		}
	})
})

deleteButton.click(function() {
	console.log('clicked');
	var id = $(this).attr('id');
	
	$.ajax({
		method: "DELETE",
		url: "http://localhost:3000/wines/" + id,
		success: function(response){
			window.location.reload();
		}
	})	
})

//This block of code pertains to the edit profile page (/users/edit)
var addInterest = $('#addInterestField');
var submitButton = $('#submitEdit')

addInterest.click(function(){
	var newInterestField = $("<input placeholder='Put your interest here' class='interestField'>")
	$('#interestHolder').append(newInterestField);
})

submitButton.click(function(){
	console.log('clicked')
	var firstName = $("#firstNameField").val();
	var lastName = $("#lastNameField").val();
	var title = $("#titleField").val();
	var affiliation = $("#affiliationField").val();
	var image = $("#imageField").val();
	var interests = $(".interestField").val();
	var newProfileData = {
		firstName: firstName,
		lastName: lastName,
		title: title,
		affiliation: affiliation,
		image: image,
		interests: interests
	};
	var pageUrl = document.URL; // Get current url
	var urlArray = pageUrl.split('/') // Split the string into an array with / as separator
	var urlId = urlArray[urlArray.length-1];
	$.ajax({
		method: "PATCH",
		url: "http://localhost:3000/users/edit/" + urlId,
		data: newProfileData,
		success: function(response){
			window.location.href = ("http://localhost:3000/users/" + urlId);

		}
	})
})


