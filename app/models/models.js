/**
 * Created by iyobo on 2016-07-11.
 */
const mongoose = require('mongoose');
const config= require('../config/configs').settings;
mongoose.connect(config.db.mongodb.url);

/**
 * Define models.
 * Add all future models to this object.
 */
var models = {
	issue: require('./issue'),
	comment: require('./comment'),
	user: require('./user')
}


//---Exports
module.exports.models = models;

/**
 * Optional initialization function to latch models to server instance
 * @param server
 * @returns {{issue, comment: *}}
 */
module.exports.init=function*(server){

	server.app.db = models;
	return models;
}
