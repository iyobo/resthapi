'use strict';

const co = require('co')

/**
 * Using co to wrap the entire application for dependable ES6 behavior.
 */
var servergen= co.wrap(function*() {

	const Hapi = require('hapi');
	const config = require('./app/config/configs').settings;


	try {
		const server = new Hapi.Server();
		server.connection({
			host: config.server.host,
			port: config.server.port
		});

		//latch settings to server instance for easy access
		server.app.settings = config;

		//Configure the hapijs server instance
		yield require('./bootstrapper/init')(server);

		//Setup models
		yield require('./app/models/models').init(server);

		//Post-server-initialization init
		yield require('./bootstrapper/postinit')(server);

		//Setup routes
		yield require('./app/routes/routes')(server);

		//Run the server
		yield server.start();

		server.log('info', 'Server running at: ' + server.info.uri);
		if(module.parent)
			return server;

	}catch(e){

		console.error("[Uncaught Exception] The following error bubbled to the top. The server will now quit. " +
			"If you would like to prevent auto-quitting in the future, be sure to catch all " +
			"trivial exceptions generated in your application...");
		console.error(e.stack);
		process.exit();
	}

});

/**
	If this is being loaded as a module return it else run
 */
if(!module.parent)
	servergen()
else
	module.exports=servergen()