var Post = require('../models/Posts')
var _ = require('lodash')

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const structure = [
	[
		{width: 13, chars: 268, img: false},
		{width: 30, chars: 94, img: true},
		{width: 20, chars: 190, img: true},
	],
	[
		{width: 46, chars: 94, img: true},
		{width: 18, chars: 382, img: true},
	],
	[
		{width: 22, chars: 94, img: true},
		{width: 22, chars: 502, img: true},
		{width: 18, chars: 159, img: true},
	],
]

exports.make = async function(posts) {
	var counter = 0;
	var layout = []
	
	posts = posts.reverse()
	
	while (true) {
		var rowId = getRandomInt(3)
		var row = _.cloneDeep(structure[rowId].sort((a, b) => (0.5 - Math.random()) ))
		
		if(counter >= posts.length) { break; }
		
		var filledRow = []
		
		for (var i = 0; i < row.length; i++) {
			if(posts[counter]) {	
				row[i].post = posts[counter]
				filledRow.push(row[i])
			}
			counter++;
		}
		
		layout.push(filledRow)
	}
	return layout
}