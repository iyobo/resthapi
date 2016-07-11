/**
 * Created by iyobo on 2016-07-11.
 */

/**
 * Define routes for this Rest Server here
 * @param server
 */
modules.export=function(server){

	server.route({
		method: 'GET',
		path: '/',
		handler: function(request, reply){
			return reply("All systems are go")
		}
	});


}