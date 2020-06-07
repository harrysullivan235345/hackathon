var express = require('express');
var router = express.Router();
var userController = require('../controllers/users');
var postController = require('../controllers/posts');
var feedController = require('../controllers/feeds');
var friendController = require('../controllers/friends');
var shortid = require('shortid');


router.get('/logout', function(req, res, next) {
	res.clearCookie("user")
  	res.redirect('/');
});

router.get('/user/:id', async function(req, res, next) {
	var user = await userController.user(req.cookies.user);
	var searchedUser = await userController.user(req.params.id);
	var posts = await postController.findByUser(searchedUser._id)
	var userFeed = await feedController.make(posts)
	if (user) {
		res.render('home/viewUser', { username: user.username, avatar: user.avatar, userFeed, searchedUser })
	} else {
		res.redirect("/login");
	}
})

router.get("/findfriends", async function(req, res, next){
	var user = await userController.user(req.cookies.user);
	var results = null;
    if (user) {
		var query = req.query.query;
		if (query) {
			results = await userController.search(query)
		}
        res.render('home/findFriends', { username: user.username, avatar: user.avatar, results });
    } else {
        res.redirect('/login');
    }
});

router.post('/addFriend', async function(req, res, next) {
	var user = await userController.user(req.cookies.user);
	if (user) {
		var friendId = req.body.friendId;
		await friendController.add(user._id, friendId)
		res.redirect(`/users/user/${friendId}`)
	} else {
		res.redirect('/login');
	}
})


router.post('/login', async function(req, res) {
	var user = await userController.login(req.body.username, req.body.password)
	if (user) {
		res.cookie("user", user._id);
		res.redirect("/posts/posts")
	} else {
		res.clearCookie("user")
		res.redirect("/login");
	}
});

router.post('/signUp', async function(req, res) {
	var avatar = req.files.avatar;
	var avatarId = shortid.generate() + avatar.name;
	avatar.mv(`./storage/${avatarId}`, async function(err) {
		if (err)
      		return res.status(500).send(err);
		var user = await userController.signUp(req.body.username, req.body.password, avatarId)
		res.cookie("user", user._id);
		res.redirect("/posts/posts");
	});
});



module.exports = router;
