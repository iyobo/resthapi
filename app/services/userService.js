'use strict'
/**
 * Created by iyobo on 2016-07-12.
 */
const User = require('../models/models').models.user;
const config = require('../config/configs').settings;
const bcrypt = require('bcrypt-as-promised');
const Boom = require('boom');

module.exports = {
	createUser: function*(username, password) {

		let hashpassword = yield bcrypt.hash(password, config.crypto.saltrounds)
		return yield new User({username:username, password:hashpassword}).save()
	},
	/**
	 * Attempts to create a user. If user exists, return existing user. Not to be exposed to the web
	 * @param username
	 * @param password
	 * @returns {*}
	 */
	createUniqueUser: function*(username,password){
		let exists = yield User.findOne({username: username})
		if (!exists) {
			return yield this.createUser(username,password);
		}else{
			return exists;
		}
	},
	/**
	 * Attempts to create a user. If username exists, throw exception.
	 * Use this for most user creation actions.
	 * @param username
	 * @param password
	 * @returns {*}
	 */
	createStrictUniqueUser: function*(username,password){
		let exists = yield User.findOne({username: username})
		if (!exists) {
			return yield this.createUser(username,password);
		}else{
			throw Boom.conflict('Username already exists: '+username,username)
		}
	},
	validateAuth:function* (request, username, password, callback) {
		// check if username exists in our db
		var foundUser = yield User.findOne({username: username});
		if (foundUser) {
			var valid = yield bcryptc.compare(password, foundUser.password);
			return callback(null, valid, {id: foundUser._id, username: username});
		}else {
			return callback(null, false);
		}
	}
}