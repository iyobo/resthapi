'use strict'
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
/**
 * Created by iyobo on 2016-07-11.
 */
let schema = mongoose.Schema({
	title: String,
	author: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
	authorName: String,
	body: String,
	issue: {type:mongoose.Schema.Types.ObjectId, ref:'Issue'},

	dateCreated: { type: Date, default: Date.now },

});
schema.plugin(mongoosePaginate);

let Comment = mongoose.model('Comment', schema);

module.exports = Comment