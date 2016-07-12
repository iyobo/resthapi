const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
/**
 * Created by iyobo on 2016-07-11.
 *
 */
let schema = mongoose.Schema({
	username: String,
	password: String,

	dateCreated: { type: Date, default: Date.now },

});
schema.plugin(mongoosePaginate);

let User = mongoose.model('User', schema)

module.exports = User