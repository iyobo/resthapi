'use strict';

const co = require('co')

/**
 * Using co to wrap the entire application for dependable ES6 behavior.
 */
co.wrap(function*() {

	const Hapi = require('hapi');
	const config = require('./app/config/configs').settings;


	try {
		const server = new Hapi.Server();
		server.connection({
			host: config.server.host,
			port: config.server.port
		});

		//Configure the hapijs server instance
		yield require('./bootstrapper')(server);

		//Setup controllers
		yield require('./app/routes/routes')(server);

		//Setup models
		yield require('./app/models/models').init(server);

		//Post-server-initialization init
		yield require('./app/init')(server);

		//Run the server
		yield server.start();

		server.log('info', 'Server running at: ' + server.info.uri);

	}catch(e){

		console.error("[Uncaught Exception] The following error bubbled to the top. The server will now quit. " +
			"If you would like to prevent auto-quitting in the future, be sure to catch all " +
			"trivial exceptions generated in your application...");
		console.error(e.stack);
		process.exit();
	}

})();