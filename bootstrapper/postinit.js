'use strict'
/**
 * To keep server.js nice and light, do all bootstrapping actions here
 * that require models and other major initializations.
 */
const co = require('co');
const bcrypt = require('bcrypt-as-promised');
const bcryptc = require('bcrypt');


module.exports = function*(server) {

	const User = server.app.db.user;
	const config = server.app.settings;

	/**
	 * Create initial users if they doesn't exist.
	 * Ideally, this should be a data migration
	 */
	let admin = yield User.findOne({username: 'hapiadmin'})
	if (!admin) {
		yield new User({
			username: 'hapiadmin',
			password: yield bcrypt.hash('password1', config.crypto.saltrounds)
		}).save()
		server.log('info', 'Created initial hapiadmin user')
	}
	admin = yield User.findOne({username: 'cedric'})
	if (!admin) {
		yield new User({
			username: 'cedric',
			password: yield bcrypt.hash('password2', config.crypto.saltrounds)
		}).save()
		server.log('info', 'Created initial cedric user')
	}


	/**
	 * Setup JWT auth
	 */
	yield server.register(require('hapi-auth-basic'));
	server.auth.strategy('simple', 'basic',
		{
			validateFunc: function (request, username, password, callback) {
				// check if username exists in our db
				User.findOne({username: username}, function (err, foundUser) {

					if (err) {
						server.log('error',e.stack)
						throw err;
					}

					if (foundUser) {
						bcryptc.compare(password, foundUser.password, function (err, valid) {
							if (err) {
								server.log('error',e.stack)
								throw err;
							}
							return callback(null, valid,{id:foundUser._id,username: username});
						});
					}
					else {
						return callback(null, false);
					}
				});
			},
		});

	server.auth.default('simple');

}