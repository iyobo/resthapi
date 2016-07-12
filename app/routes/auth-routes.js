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
		path: '/api/user/',
		handler: co.wrap(function*(request, reply) {


			try {
				let result = yield userSerive.createUniqueUser(request.payload.username, request.payload.password);

				return reply(null, result).header("Authorization", request.headers.authorization);;
			} catch (e) {
				server.log('error', e.stack)
				return reply(e).header("Authorization", request.headers.authorization);
			}
		}),
		config: {
			validate: {
				payload: {
					username: Joi.string(),
					password: Joi.string()
				}
			}
		}
	});


}