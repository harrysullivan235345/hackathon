const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  	title: { type: String, text: true },
	description: String,
	users: Array,
	posts: Array
});

const Group = mongoose.model('group', groupSchema);

module.exports = Group;