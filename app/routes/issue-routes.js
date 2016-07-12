'use strict'
/**
 * Created by iyobo on 2016-07-11.
 */
const co = require('co');
const Boom = require('boom');
const Joi = require('joi');

module.exports = function (server) {
	const Issue = server.app.db.issue;

	/**
	 * Create an Issue
	 */
	server.route({
		method: 'POST',
		path: '/api/issue',
		handler: co.wrap(function*(request, reply) {
			try {
				let payload = request.payload;

				//use currently logged in user as author
				payload.author=request.auth.credentials.id
				payload.authorName = request.auth.credentials.username

				let result = yield new Issue(payload).save()

				return reply(null, result).header("Authorization", request.headers.authorization);;
			} catch (e) {
				server.log('error', e.stack)
				return reply(e).header("Authorization", request.headers.authorization);
			}
		}),
		config: {
			validate: {
				payload: {
					title: Joi.string(),
					body: Joi.string()
				}
			}
		}
	});


	/**
	 * List all issues. With pagination.
	 */
	server.route({
		method: 'GET',
		path: '/api/issue',
		handler: co.wrap(function*(request, reply) {
			try {
				let page = request.query.page || 1
				let limit = request.query.limit || 10
				let sort = request.query.sort || ""

				let issues = yield Issue.paginate({}, {populate: 'author, username' ,page: page, limit: limit, sort: sort})

				return reply(null, issues);
			} catch (e) {
				server.log('error', e.stack)
				return reply(e)
			}
		})
	});

	/**
	 * Display a single Issue
	 */
	server.route({
		method: 'GET',
		path: '/api/issue/{id}',
		handler: co.wrap(function*(request, reply) {
			try {
				let issue = yield Issue.findById(request.params.id)

				if (issue) {
					return reply(null, issue);
				} else {
					return reply(Boom.notFound('No such issue: ' + request.params.id));
				}

			} catch (e) {
				server.log('error', e.stack)
				return reply(e)
			}
		}),
		config: {
			validate: {
				params: {
					id: Joi.string().length(24)
				}
			}
		}
	});

	/**
	 * Update issue (updates only needed fields)
	 * i.e To change the status of an issue, simply send {status: 'complete'} as PUT/PATCH payload
	 */
	server.route({
		method: ['PUT', 'PATCH'],
		path: '/api/issue/{id}',
		handler: co.wrap(function*(request, reply) {
			try {
				let query = {_id: request.params.id}
				let result = yield Issue.update(query, {$set: request.payload})

				return reply(null, result);
			} catch (e) {
				server.log('error', e.stack)
				return reply(e)
			}
		}),
		config: {
			validate: {
				params: {
					id: Joi.string().length(24),
				},
				payload: {
					title: Joi.string().optional(),
					author: Joi.string().optional(),
					body: Joi.string().optional(),
					status: Joi.string().optional()
				}
			}
		}
	});

	/**
	 * Removes an issue from the database
	 */
	server.route({
		method: 'DELETE',
		path: '/api/issue/{id}',
		handler: co.wrap(function*(request, reply) {
			try {
				let result = yield Issue.remove({_id: request.params.id})

				return reply(null, result);
			} catch (e) {
				server.log('error', e.stack)
				return reply(e)
			}
		}),
		config: {
			validate: {
				params: {
					id: Joi.string().length(24)
				}
			}
		}
	});


}