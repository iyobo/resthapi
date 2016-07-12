'use strict'
/**
 * To keep server.js nice and light, do all bootstrapping actions here
 * that require models and other major initializations.
 */
const co = require('co');
const bcrypt = require('bcrypt-as-promised');
const bcryptc = require('bcrypt');
const userService = require('../app/services/userService')


module.exports = function*(server) {

	const User = server.app.db.user;
	const config = server.app.settings;

	/**
	 * Create initial users if they doesn't exist.
	 * Ideally, this should be a data migration
	 */
	userService.createUniqueUser('hapiadmin','password1');
	userService.createUniqueUser('cedric','password2');


	/**
	 * Setup JWT auth
	 */
	yield server.register(require('hapi-auth-basic'));
	server.auth.strategy('simple', 'basic',
		{
			validateFunc: userService.validateAuth
		});

	server.auth.default('simple');

}