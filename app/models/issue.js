const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
/**
 * Created by iyobo on 2016-07-11.
 */
let schema = mongoose.Schema({
	title: String,
	author: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
	body: String,
	status: String,
	comments: [{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],

	dateCreated: Date,

});
schema.plugin(mongoosePaginate);

let Issue = mongoose.model('Issue', schema)

module.exports = Issue