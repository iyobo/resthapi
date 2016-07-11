module.exports={
	/**
	 * Generates all routes needed to handle a resource
	 * @param resourceName Name of the resource
	 * @param server hapijs server instance
	 * @param C Create controller action
	 * @param R Read " "
	 * @param U Update " "
	 * @param D Delete " "
	 */
	generateResourceRoutes: function(resourceName,server,handlers){

		//CREATE
		server.route({
			method: 'POST',
			path: `/api/${resourceName}`,
			handler: handlers.post
		});

		//READ
		server.route({
			method: 'GET',
			path: `/api/${resourceName}`,
			handler: R
		});
		server.route({
			method: 'GET',
			path: `/api/${resourceName}/{id}`,
			handler: R
		});

		//UPDATE
		server.route({
			method: 'POST',
			path: `/api/${resourceName}`,
			handler: C
		});

	}
}