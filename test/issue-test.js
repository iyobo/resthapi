/**
 * Created by iyobo on 2016-07-11.
 */
var assert = require('chai').assert;
var expect = require('chai').expect;
var co = require('co');

var server;
co.wrap(function*() {

	describe('Issue', co.wrap(function*() {

		before(co.wrap(function*() {
			//load server
			server = yield require('../server');

			//destroy collection of issues in test DB
			yield server.app.db.issue.remove({});
		}));

		describe('Creating Issues', co.wrap(function*() {

			it("should return status 401 due to missing body", co.wrap(function*() {

				var res = yield server.inject({method: 'POST', url: '/api/issue'})
				expect(res.statusCode).to.equal(401);

			}));
			it("should return status 200", co.wrap(function*() {
				var res = yield server.inject({
					method: 'POST',
					url: '/api/issue',
					payload: {title: 'Test Issue', body: 'Issue created while running test'},
					credentials: {username: 'test', id: '1111111111aaaaaaaaaa1234'}
				})
				expect(res.statusCode).to.equal(200);
			}));

		}));

		describe('Reading Issues', co.wrap(function*() {

			it("should return status 401 due to missing body", co.wrap(function*() {

				var res = yield server.inject({method: 'POST', url: '/api/issue'})
				expect(res.statusCode).to.equal(401);

			}));
			it("should return status 200", co.wrap(function*() {
				var res = yield server.inject({
					method: 'POST',
					url: '/api/issue',
					payload: {title: 'Test Issue', body: 'Issue created while running test'},
					credentials: {username: 'test', id: '1111111111aaaaaaaaaa1234'}
				})
				expect(res.statusCode).to.equal(200);
			}));

		}));

	}));
})();




