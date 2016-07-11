'use strict';

const co = require('co')

/**
 * Using co to wrap the entire application for dependable ES6 behavior.
 */
co.wrap(function*() {

	const Hapi = require('hapi');
	const Good = require('good');
	const config = require('./app/config').settings;


	try {
		const server = new Hapi.Server();
		server.connection({
			host: config.server.host,
			port: config.server.port
		});

		//Attach and configure the hapijs server instance
		yield require('./bootstrapper')(server)

		//Run the server
		yield server.start();

		server.log('info', 'Server running at: ' + server.info.uri);

	}catch(e){
		console.error(e);
		console.error("[Uncaught Exception] Error bubbled to the top. The server will now quit. " +
			"If you would like to prevent auto-quitting in the future, be sure to catch all " +
			"trivial exceptions generated in your application");
		process.exit();
	}

})();