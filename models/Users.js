const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  	username: { type: String, text: true },
	password: String,
	avatar: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;