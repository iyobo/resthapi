/**
 * Created by iyobo on 2016-07-11.
 */
const co = require('co');

module.exports = function (server) {

	server.route({
		method: 'GET',
		path: '/api/issue',
		handler: co.wrap(function*(request, reply) {

			Model.paginate({}, { offset: 20, limit: 10 })

			return reply({done: true});
		})
	});
}