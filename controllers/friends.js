var Friend = require('../models/Friends')

exports.add = async function(person1, person2) {
	var friend = new Friend({ person1, person2 })
	return await friend.save()
}

exports.find = async function(userId) {
	return await Friend.find({ $or: [{ person1: userId}, {person2: userId }] })
}