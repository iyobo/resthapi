/**
 * To keep server.js nice and light, do all server bootstrapping/registering operations here
 * @param server
 */
const Good = require('good');


module.exports = function*(server) {

	//Logger
	yield server.register({
		register: Good,
		options: {
			reporters: {
				console: [{
					module: 'good-squeeze',
					name: 'Squeeze',
					args: [{
						response: '*',
						log: '*'
					}]
				}, {
					module: 'good-console'
				}, 'stdout']
			}
		}
	});

	//Document generator
	yield server.register([require('vision'), require('inert'), {register: require('lout')}]);


}