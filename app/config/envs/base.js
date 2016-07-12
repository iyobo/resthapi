/**
 * Created by iyobo.
 */
module.exports = {
	env: 'development',
	server: {
		port: 8000,
		host: 'localhost',
	},

	db: {
		mongodb: {
			url: 'mongodb://localhost/resthapi',
		}
	},


	crypto: {
		saltrounds: 8, //WARNING: Changing this WILL screw up all your user passwords
	}

}

 