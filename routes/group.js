var express = require('express');
var app = express.Router();
var groupController = require('../controllers/groups');
var userController = require('../controllers/users');
var postController = require('../controllers/posts');
var feedController = require('../controllers/feeds');
var shortid = require('shortid');

// gets the home page for the groups route
app.get("/group/:id", async function(req, res, next){
	var user = await userController.user(req.cookies.user);
	var group = await groupController.findOne(req.params.id)
	var posts = await postController.findManyByIds(group.posts)
	var users = await userController.findManyByIds(group.users)
	var feed = await feedController.make(posts)
    if (user) {
        res.render("home/viewGroup", { username: user.username, avatar: user.avatar, group, feed, users});
    } else {
        res.redirect('/login');
    }
});

app.get("/creategroup", async function(req, res, next){
	var user = await userController.user(req.cookies.user);
    if (user) {
        res.render('home/createGroup', { username: user.username, avatar: user.avatar });
    } else {
        res.redirect('/login');
    }
});

app.post("/creategroup", async function(req, res, next){
	var user = await userController.user(req.cookies.user);
    if (user) {
        var group = await groupController.add(user._id, req.body.title, req.body.description)
		res.redirect(`/groups/group/${group._id}`)
    } else {
        res.redirect('/login');
    }
});

app.get("/joingroup", async function(req, res, next){
	var user = await userController.user(req.cookies.user);
	var results = null;
    if (user) {
		var query = req.query.query;
		if (query) {
			results = await groupController.search(query)
		}
        res.render('home/joingroup', { username: user.username, avatar: user.avatar, results });
    } else {
        res.redirect('/login');
    }
});

app.post("/joingroup", async function(req, res, next){
	var user = await userController.user(req.cookies.user);
    if (user) {
		var groupId = req.body.groupId
		await groupController.addUser(user._id, groupId)
        res.redirect(`/groups/group/${groupId}`);
    } else {
        res.redirect('/login');
    }
});

module.exports = app;