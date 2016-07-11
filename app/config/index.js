'use strict'

/**
 * Manages Environment-based config.
 * NODE_ENV should be set as an environmental variable. If not, it assumes 'development'.
 * The NODE_ENV variable should match the name of a config file in ./env, which overwrites
 * ./env/base.js with it's own properties.
 * e.g. NODE_ENV production will overwrite base props with props in ./env/production.js
 */
class Env {

	constructor() {

		this.currentEnv = process.env.NODE_ENV || 'development';
		this.settings = {};

		//Load base
		try {
			this.settings = require('./envs/base.js');

			//load environment
			var envSettings = require("./envs/" + this.currentEnv);
			this.overwriteSettings(envSettings,this.settings);
			console.log('[Environment]',this.currentEnv,'settings loaded.')

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * overwrites settings in baseMap with EnvMap
	 * @param envMap
	 * @param baseMap
	 */
	overwriteSettings(envMap, baseMap) {
		for (let k in envMap) {
			var current = envMap[k];

			if (typeof current === 'object')
				this.overwriteSettings(current,baseMap[k])
			else
				baseMap[k] = current;
		}
	}

	/**
	 * @description get value of an existing key from
	 * env file
	 * @method get
	 * @param  {String} key
	 * @param  {Mixed} defaultValue
	 * @return {Mixed}
	 */
	get(key, defaultValue) {
		return this.settings[key] || defaultValue;
	}

	/**
	 * @description set value of an existing .env variable
	 * @method set
	 * @param  {String} key
	 * @param  {Mixed} value
	 * @public
	 */
	set(key, value) {
		this.settings[key] = value;
	}

}

//Export config Singleton
module.exports = new Env();
