var User = require('../models/Users')

exports.findManyByIds = async function(ids) {
	return await User.find({ _id: { $in: ids } })
}

exports.login = async function(username, password) {
	var user = await User.findOne({ username, password })
	return user
}

exports.signUp = async function(username, password, avatar) {
	var user = new User({ username, password, avatar })
	return await user.save()
}

exports.user = async function(userId) {
	var user = await User.findById(userId)
	return user
}

exports.search = async function(query) {
	return await User.find( { $text: { $search: query } } );
}