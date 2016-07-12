'use strict'
/**
 * Created by iyobo on 2016-07-11.
 */
const co = require('co');
const Boom = require('boom');
const Joi = require('joi');

module.exports = function (server) {
	const Comment = server.app.db.comment;

	/**
	 * Create a Comment
	 */
	server.route({
		method: 'POST',
		path: '/api/issue/{issueId}/comment',
		handler: co.wrap(function*(request, reply) {
			try {
				let payload = request.payload;

				//use currently logged in user as author
				payload.author = request.auth.credentials.id;
				payload.authorName = request.auth.credentials.username

				//use currently reference issueId as issue
				payload.issue = request.params.issueId;

				let result = yield new Comment(payload).save()

				return reply(null, result).header("Authorization", request.headers.authorization);
				;
			} catch (e) {
				server.log('error', e.stack)
				return reply(e).header("Authorization", request.headers.authorization);
			}
		}),
		config: {
			validate: {
				params: {
					issueId: Joi.string().length(24)
				},
				payload: {
					title: Joi.string(),
					body: Joi.string()
				}
			},
			description: 'Creates a new Comment',
			notes: ["All comments link to the issueID provided in the path", "The currently authenticated user is assumed to be the author"],
			tags: ['api', 'comment','create']
		}
	});


	/**
	 * List all Comments for a given issue. With pagination.
	 */
	server.route({
		method: 'GET',
		path: '/api/issue/{issueId}/comments',
		handler: co.wrap(function*(request, reply) {
			try {
				let page = request.query.offset || 1
				let limit = request.query.limit || 10
				let sort = request.query.sort || ""

				let comments = yield Comment.paginate({}, {page: page, limit: limit, sort: sort})

				return reply(null, comments).header("Authorization", request.headers.authorization);
			} catch (e) {
				server.log('error', e.stack)
				return reply(e)
			}
		}),
		config:{
			validate: {
				query: {
					page: Joi.number().optional(),
					limit: Joi.number().optional(),
					sort: Joi.string().optional()
				}
			},
			description: 'List all Comments for a given issue.',
			notes: ["With pagination", "Defaults are page:1, limit: 10, and no sort"],
			tags: ['api', 'comment']
		}
	});

	/**
	 * Display a single Comment
	 */
	server.route({
		method: 'GET',
		path: '/api/comment/{id}',
		handler: co.wrap(function*(request, reply) {
			try {
				let result = yield Comment.findById(request.params.id)

				if (result) {
					return reply(null, result).header("Authorization", request.headers.authorization);
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
			},
			description: 'Gets details of a single comment',
			notes: ["Returns a 404 if it doesn't exist"],
			tags: ['api', 'comment']
		}
	});

	/**
	 * Removes a comment from the database
	 */
	server.route({
		method: 'DELETE',
		path: '/api/comment/{id}',
		handler: co.wrap(function*(request, reply) {
			try {
				let result = yield Comment.remove({_id: request.params.id})

				return reply(null, result).header("Authorization", request.headers.authorization);
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
			},
			description: 'Deletes a single comment',
			notes: ["Permanent Delete. be careful!"],
			tags: ['api', 'comment','delete']
		}
	});


}