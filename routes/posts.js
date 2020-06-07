var express = require('express');
var app = express.Router();
var userController = require('../controllers/users');
var postController = require('../controllers/posts');
var feedController = require('../controllers/feeds');
var groupController = require('../controllers/groups');
var friendController = require('../controllers/friends');
var _ = require('lodash')
var shortid = require('shortid');

app.get('/post/:id', async function(req, res, next) {
    var user = await userController.user(req.cookies.user);
	var post = await postController.findOne(req.params.id)
	var postUser = await userController.user(post.userId);
    if (user) {
        res.render('home/myposts', { user: user, avatar: user.avatar, post, postUser });
    } else {
        res.redirect('/login');
    }
});


/* GET home page. */
app.get('/posts', async function(req, res, next) {
    var user = await userController.user(req.cookies.user);
	var posts = await postController.findByUser(user._id)
	var groups = await groupController.findByUser(user._id)
	var friendsIds = _.flatten((await friendController.find(user._id)).map(c => [c.person1, c.person2]))
	var friends = await userController.findManyByIds(friendsIds)
	if (user) {
		res.render('home/posts', { username: user.username, avatar: user.avatar, posts, groups, friends, user });
	 } else {
        res.redirect('/login');
    }
});

app.get('/feed', async function(req, res, next) {
	var user = await userController.user(req.cookies.user);
	var posts = await postController.getFeed()
	var feed = await feedController.make(posts)
	if (user) {
	res.render('home/feed', { username: user.username, avatar: user.avatar, feed });
	} else {
        res.redirect('/login');
    }
});

app.get('/createpost', async function(req, res, next) {
    var user = await userController.user(req.cookies.user);
	var groupId = null
	if (req.query.group) {
		groupId = req.query.group
	}
    if (user) {
        res.render('home/postsform', { username: user.username, avatar: user.avatar, groupId });
    } else {
        res.redirect('/login');
    }
});

app.post('/createpost', async function(req, res, next) {
    var userId = req.cookies.user;
    if (userId) {
        var images = [].concat(req.files.images);

        var imageIdsExecution = images.map(async image => {
            var imageId = shortid.generate() + image.name;
			var execution = new Promise(resolve => {
				 image.mv(`./storage/${imageId}`, function(err) {
					if (err) return res.status(500).send(err);
					resolve();
				});
			})
			await execution
			return imageId
        });
		
		var imageIds = await Promise.all(imageIdsExecution)

        var post = await postController.add(userId, req.body.title, req.body.content, imageIds);
		
		var groupId = req.body.groupId
		
		if(groupId) {
			await groupController.addPost(groupId, post._id)
		}
		
        res.redirect(`/posts/post/${post._id}`);
    } else {
        res.redirect('/login');
    }
});

app.post('/deletepost', async function(req, res, next) {
	var userId = req.cookies.user;
	if (userId) {
		await postController.delete(userId, req.body.postId)
		res.redirect('/posts/feed')
	} else {
        res.redirect('/login');
    }
});

app.post('/likes', async function(req, res, next){
	var userId = req.cookies.user;
	if (userId) {
		await postController.addLike(req.body.postId);
		res.redirect('/posts/post/' + req.body.postId);
	} else {
        res.redirect('/login');
    }
});
module.exports = app;