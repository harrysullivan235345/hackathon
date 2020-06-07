var Group = require('../models/Groups')

exports.findOne = async function(groupId) {
	return await Group.findById(groupId)
}

exports.findByUser = async function(userId) {
	return await Group.find({ users: userId })
}

exports.add = async function(userId, title, description) {
	var group = new Group({ title, description, users: [userId], posts: [] })
	return await group.save()
}

exports.addPost = async function(groupId, postId) {
	var group = await Group.findById(groupId)
	group.posts.push(postId)
	await group.save()
}

exports.addUser = async function(userId, groupId) {
	var group = await Group.findById(groupId)
	group.users.push(userId)
	await group.save()
}

exports.search = async function(query) {
	return await Group.find( { $text: { $search: query } } );
}