'use strict'
/**
 * Created by iyobo on 2016-07-12.
 */
const User = require('../models/models').models.user;
const config = require('../config/configs').settings;
const bcrypt = require('bcrypt-as-promised');
const bcryptc = require('bcrypt');

module.exports = {
	createUser: function*(username, password) {

		let hashpassword = yield bcrypt.hash(password, config.crypto.saltrounds)
		return yield new User({username:username, password:hashpassword}).save()
	},
	createUniqueUser: function*(username,password){
		let exists = yield User.findOne({username: username})
		if (!exists) {
			return yield this.createUser(username,password);
		}else{
			return exists;
		}
	},
	validateAuth:function (request, username, password, callback) {
		// check if username exists in our db
		User.findOne({username: username}, function (err, foundUser) {

			if (err) {
				throw err;
			}

			if (foundUser) {
				bcryptc.compare(password, foundUser.password, function (err, valid) {
					if (err) {
						throw err;
					}
					return callback(null, valid, {id: foundUser._id, username: username});
				});
			}
			else {
				return callback(null, false);
			}
		});
	}
}