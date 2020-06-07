const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: String,
    content: String,
    images: Array,
    userId: String,
    timestamp: Number,
	likes: {type: Number, default: 0},
	comment: Array
});

const Post = mongoose.model('post', postSchema);
module.exports = Post;