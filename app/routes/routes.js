'use strict';

/**
 * Define routes for this Rest Server here
 * @param server
 */
module.exports = function*(server) {

	server.route({
		method: 'GET',
		path: '/',
		config:{
			auth: false
		},
		handler: function(request, reply) {
			return reply(`
				<h1>Welcome to RestHapi.</h1>
				<i>Created by Iyobo Eki</i>
				
				<p>For details/specs/etc, see <a target="_blank" href="https://github.com/iyobo/resthapi">https://github.com/iyobo/resthapi</a></p>
				
			`);
		}
	});
	
	require('./issue-routes')(server);
	require('./comment-routes')(server);
	require('./auth-routes')(server);

}