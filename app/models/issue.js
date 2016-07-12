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
	status: {type:String, default:"pending"},
	comments: [{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],

	dateCreated: { type: Date, default: Date.now },
	dateUpdated: { type: Date, default: Date.now },

});
schema.plugin(mongoosePaginate);

let Issue = mongoose.model('Issue', schema)

module.exports = Issue