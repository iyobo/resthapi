'use strict'
/**
 * Created by iyobo on 2016-07-11.
 */
const co = require('co');
const Boom = require('boom');
const Joi = require('joi');
const bcrypt = require('bcrypt-as-promised');
const userSerive = require('../services/userService')

module.exports = function (server) {


	/**
	 * Create a new User
	 */
	server.route({
		method: 'POST',
		path: '/api/user',
		handler: co.wrap(function*(request, reply) {
			try {
				let result = yield userSerive.createStrictUniqueUser(request.payload.username, request.payload.password);

				return reply(null, result).header("Authorization", request.headers.authorization);;
			} catch (e) {
				server.log('error', e.stack)
				return reply(e).header("Authorization", request.headers.authorization);
			}
		}),
		config: {
			validate: {
				payload: {
					username: Joi.string().min(3),
					password: Joi.string().min(6)
				}
			},
			auth: false,
			description: 'Creates a new User',
			notes: "Creates a new user with supplied username and password.",
			tags: ['api', 'user','create']
		}
	});


}