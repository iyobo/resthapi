'use strict'
/**
 * To keep server.js nice and light, do all bootstrapping actions here
 * that require models and other major initializations.
 */
const co = require('co');
const userService = require('../app/services/userService')


module.exports = function*(server) {

	const User = server.app.db.user;
	const config = server.app.settings;

	/**
	 * Create initial users if they doesn't exist.
	 * Ideally, this should be a data migration
	 */
	yield userService.createUserIfNotExist('hapiadmin','password1');
	yield userService.createUserIfNotExist('cedric','password2');


	/**
	 * Setup JWT auth
	 */
	yield server.register(require('hapi-auth-basic'));
	server.auth.strategy('simple', 'basic',
		{
			validateFunc: co.wrap(userService.validateAuth)
		});

	server.auth.default('simple');

}