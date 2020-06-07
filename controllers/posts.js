var Post = require('../models/Posts')

const DELETE_TIME = 2

exports.getFeed = async function(){
	return await Post.find({}).limit(18)
}
exports.findOne = async function(postId) {
	return await Post.findById(postId)
}

exports.findByUser = async function(userId) {
	return await Post.find({ userId })
}

exports.findManyByIds = async function(ids) {
	return await Post.find({ _id: { $in: ids } })
}

exports.add = async function(userId, title, content, images) {
	var post = new Post({ title, content, images, userId, timestamp: Date.now() })
	return await post.save()
}

exports.delete = async function(userId, postId) {
	return await Post.findOneAndRemove({ _id: postId, userId })
}

exports.clear = async function() {
	return await Post.deleteMany({ timestamp: { $lte: Date.now() + (1000 * 60 * DELETE_TIME) } })
}

exports.addLike = async function(postId) {
	var post = await Post.findById(postId);
	post.likes++;
	await post.save();
}