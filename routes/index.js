var express = require('express');
var app = express.Router();
var userController = require('../controllers/users')

/* GET home page. */
app.get('/', async function(req, res, next) {
	var user = await userController.user(req.cookies.user)
	if(user) {
		 res.render('index',  {loggedIn: true, avatar: user.avatar, username: null});
	} else {
		 res.render('index', {loggedIn: false, avatar: null, username: null});
	}
 
});

app.get("/login", function(req, res, next){
	res.render("login");
});

app.get("/signUp", function(req, res, next){
	res.render("signUp");
});


module.exports = app;
