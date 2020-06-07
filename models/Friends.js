const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSchema = new Schema({
  	person1: String,
	person2: String,
});

const Friend = mongoose.model('friend', friendSchema);

module.exports = Friend;