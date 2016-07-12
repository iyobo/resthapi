/**
 * Created by iyobo on 2016-07-11.
 */

/**
 * Define routes for this Rest Server here
 * @param server
 */
module.exports = function*(server) {

	server.route({
		method: 'GET',
		path: '/',
		handler: function*(request, reply) {
			return reply(`
				<h1>Welcome to RestHapi.</h1>
				<i>Created by Iyobo Eki</i>
				
				<p>For details/specs, see <a target="_blank" href="https://github.com/iyobo/resthapi">https://github.com/iyobo/resthapi</a></p>
			`);
		}
	});
	
	require('./issue-routes')(server);
	require('./comment-routes')(server);

}