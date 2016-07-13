/**
 * Created by iyobo on 2016-07-11.
 */
var assert = require('chai').assert;
var expect = require('chai').expect;
var co = require('co');
var userService = require('../app/services/userService')
var issueService = require('../app/services/issueService')

var server;
var testUserId = '1111111111aaaaaaaaaa1234';
var testUserName = 'tester';

co.wrap(function*() {

	describe('Issue', co.wrap(function*() {

		before(co.wrap(function*() {
			//load server
			server = yield require('../server');

			//destroy collection of issues in test DB
			yield server.app.db.issue.remove({});
		}));

		describe('Creating Issues', co.wrap(function*() {

			it("should return status 401 due to missing credentials", co.wrap(function*() {

				var res = yield server.inject({method: 'POST', url: '/api/issue'})
				expect(res.statusCode).to.equal(401);

			}));
			it("should return status 400 due to missing body", co.wrap(function*() {

				var res = yield server.inject({
					method: 'POST',
					url: '/api/issue',
					credentials: {username: testUserName, id: testUserId}
				})
				expect(res.statusCode).to.equal(400);

			}));
			it("should return status 200", co.wrap(function*() {
				var res = yield server.inject({
					method: 'POST',
					url: '/api/issue',
					payload: {title: 'Test Issue', body: 'Issue created while running test'},
					credentials: {username: testUserName, id: testUserId}
				});
				expect(res.statusCode).to.equal(200);
			}));

		}));

		describe('Reading Issues', co.wrap(function*() {

			it("should return status 401 due to missing credentials", co.wrap(function*() {

				var res = yield server.inject({method: 'GET', url: '/api/issue'})
				expect(res.statusCode).to.equal(401);

			}));

			it("should return list of issues", co.wrap(function*() {

				//Create them
				yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue 2',
					body: 'issue text 2'
				})
				yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue 3',
					body: 'issue body 3'
				})

				var res = yield server.inject({
					method: 'GET',
					url: '/api/issue',
					credentials: {username: testUserName, id: testUserId}
				})
				expect(res.statusCode).to.equal(200);
				expect(res.result.docs.length).to.be.at.least(2);
			}));

			it("should show one issue from DB", co.wrap(function*() {

				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue single',
					body: 'issue text single'
				});

				expect(issue).to.not.equal(null);
				expect(issue._id).to.not.equal(null);

				//request comment just created
				var res = yield server.inject({
					method: 'GET',
					url: '/api/issue/'+issue._id,
					credentials: {username: testUserName, id: testUserId}
				});
				expect(res.statusCode).to.equal(200);
				expect(String(res.result._id)).to.equal(String(issue._id));

			}));

		}));

		describe('Updating Issues', co.wrap(function*() {

			it("should return status 401 due to missing credentials", co.wrap(function*() {
				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue 4',
					body: 'issue text 4'
				})

				var res = yield server.inject({method: 'PATCH', url: '/api/issue/'+issue._id})
				expect(res.statusCode).to.equal(401);
				res = yield server.inject({method: 'PUT', url: '/api/issue/'+issue._id})
				expect(res.statusCode).to.equal(401);

			}));
			it("should update issue's status only", co.wrap(function*() {

				//Create something to update
				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue 5',
					body: 'issue text 5'
				})
				expect(issue.status).to.equal('pending');

				var res = yield server.inject({
					method: 'PATCH',
					url: `/api/issue/${issue._id}`,
					credentials: {username: testUserName, id: testUserId},
					payload: {status: 'complete'},
				})
				expect(res.statusCode).to.equal(200);

				//Verify only specified values changed
				var sameIssue = yield server.app.db.issue.findById(issue._id)
				expect(sameIssue.status).to.equal('complete');
				expect(sameIssue.title).to.equal('Test Issue 5');
			}));

		}));
		describe('Deleting Issues', co.wrap(function*() {

			it("should return status 401 due to missing credentials", co.wrap(function*() {
				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue vv',
					body: 'issue text vv'
				});

				var res = yield server.inject({method: 'DELETE', url: '/api/issue/'+issue._id})
				expect(res.statusCode).to.equal(401);

			}));
			it("should delete issue from DB", co.wrap(function*() {

				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue del',
					body: 'issue text del'
				});
				expect(issue).to.not.equal(null);
				expect(issue._id).to.not.equal(null);

				var res = yield server.inject({
					method: 'DELETE',
					url: '/api/issue/'+issue._id,
					credentials: {username: testUserName, id: testUserId}
				});
				expect(res.statusCode).to.equal(200);
				expect(res.result.result.n).to.equal(1);

				var sameIssue= yield server.app.db.issue.findById(issue._id)
				expect(sameIssue).to.equal(null);
			}));

		}));

	}));
})();




