/**
 * Created by iyobo on 2016-07-11.
 */
const co = require('co');

module.exports = function (server) {

	/**
	 * List all issues
	 */
	server.route({
		method: 'GET',
		path: '/api/issue',
		handler: co.wrap(function*(request, reply) {
			try {
				let page = request.query.page || 1
				let limit = request.query.limit || 10
				let sort= request.query.sort || ""

				let issues = yield server.app.db.issue.paginate({}, {page: page, limit: limit, sort:sort})

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
				let issue = yield server.app.db.issue.findById(request.params.id)

				return reply(null, issue);
			} catch (e) {
				server.log('error', e.stack)
				return reply(e)
			}
		})
	});

	/**
	 * Create an Issue
	 */
	server.route({
		method: 'POST',
		path: '/api/issue',
		handler: co.wrap(function*(request, reply) {
			try {
				let result = yield new server.app.db.issue(request.payload).save()

				return reply(null, result);
			} catch (e) {
				server.log('error', e.stack)
				return reply(e)
			}
		})
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
				let query={id: request.query.id}
				let result = yield new server.app.db.issue.update(query,{$set:request.payload})

				return reply(null, result);
			} catch (e) {
				server.log('error', e.stack)
				return reply(e)
			}
		})
	});

	/**
	 * Removes an issue from the database
	 */
	server.route({
		method: 'DELETE',
		path: '/api/issue/{id}',
		handler: co.wrap(function*(request, reply) {
			try {
				let query={id: request.query.id}
				let result = yield new server.app.db.issue.remove(query)

				return reply(null, result);
			} catch (e) {
				server.log('error', e.stack)
				return reply(e)
			}
		})
	});


}