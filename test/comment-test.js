/**
 * Created by iyobo on 2016-07-11.
 */
var assert = require('chai').assert;
var expect = require('chai').expect;
var co = require('co');
var userService = require('../app/services/userService')
var issueService = require('../app/services/issueService')

var server;
var testUserId = '1111111111aaaaaaaaaa12bb';
var testUserName = 'testerb';

co.wrap(function*() {

	describe('Comments', co.wrap(function*() {

		before(co.wrap(function*() {
			//load server
			server = yield require('../server');

			//destroy collection of issues in test DB
			yield server.app.db.comment.remove({});
		}));

		describe('Creating Comments', co.wrap(function*() {
			it("should return status 401 due to missing credentials", co.wrap(function*() {

				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue vv',
					body: 'issue text vv'
				});

				var res = yield server.inject({method: 'POST', url: `/api/issue/${issue._id}/comment`})
				expect(res.statusCode).to.equal(401);

			}));
			it("should return status 400 due to missing body", co.wrap(function*() {

				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue vv',
					body: 'issue text vv'
				});

				var res = yield server.inject({
					method: 'POST',
					url: `/api/issue/${issue._id}/comment`,
					credentials: {username: testUserName, id: testUserId}
				})
				expect(res.statusCode).to.equal(400);

			}));
			it("should return status 200", co.wrap(function*() {
				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue vv',
					body: 'issue text vv'
				});

				var res = yield server.inject({
					method: 'POST',
					url: `/api/issue/${issue._id}/comment`,
					payload: {title: 'Test Issue', body: 'Issue created while running test'},
					credentials: {username: testUserName, id: testUserId}
				});
				expect(res.statusCode).to.equal(200);
			}));

		}));

		describe('Reading Comments', co.wrap(function*() {

			it("should return status 401 due to missing credentials", co.wrap(function*() {
				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue vv2',
					body: 'issue text vv2'
				});

				var res = yield server.inject({method: 'GET', url:`/api/issue/${issue._id}/comments`})
				expect(res.statusCode).to.equal(401);

			}));
			it("should return list of Comments", co.wrap(function*() {

				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue vv3',
					body: 'issue text vv3'
				});

				//Create them
				yield issueService.createComment(issue._id,{
					author: testUserId,
					authorName: testUserName,
					title: 'Test comment 1',
					body: 'issue comment 2'
				});
				yield issueService.createComment(issue._id,{
					author: testUserId,
					authorName: testUserName,
					title: 'Test  3',
					body: 'issue  3'
				});

				var res = yield server.inject({
					method: 'GET',
					url:`/api/issue/${issue._id}/comments`,
					credentials: {username: testUserName, id: testUserId}
				})
				expect(res.statusCode).to.equal(200);
				expect(res.result.docs.length).to.be.at.least(2);
			}));

			it("should show one comment from DB", co.wrap(function*() {

				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue single',
					body: 'issue text single'
				});
				var comment= yield issueService.createComment(issue._id,{
					author: testUserId,
					authorName: testUserName,
					title: 'Test comment single',
					body: 'issue comment single'
				});

				expect(issue).to.not.equal(null);
				expect(issue._id).to.not.equal(null);
				expect(comment).to.not.equal(null);
				expect(comment._id).to.not.equal(null);

				//request comment just created
				var res = yield server.inject({
					method: 'GET',
					url: '/api/comment/'+comment._id,
					credentials: {username: testUserName, id: testUserId}
				});
				expect(res.statusCode).to.equal(200);
				expect(String(res.result._id)).to.equal(String(comment._id));

			}));

		}));

		describe('Deleting Comments', co.wrap(function*() {

			it("should return status 401 due to missing credentials", co.wrap(function*() {
				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue vv',
					body: 'issue text vv'
				});
				var comment= yield issueService.createComment(issue._id,{
					author: testUserId,
					authorName: testUserName,
					title: 'Test comment g',
					body: 'issue comment g'
				});

				var res = yield server.inject({method: 'DELETE', url: '/api/comment/'+comment._id})
				expect(res.statusCode).to.equal(401);

			}));
			it("should delete comment from DB", co.wrap(function*() {

				var issue = yield issueService.createIssue({
					author: testUserId,
					authorName: testUserName,
					title: 'Test Issue vv',
					body: 'issue text vv'
				});
				var comment= yield issueService.createComment(issue._id,{
					author: testUserId,
					authorName: testUserName,
					title: 'Test comment g',
					body: 'issue comment g'
				});

				expect(issue).to.not.equal(null);
				expect(issue._id).to.not.equal(null);
				expect(comment).to.not.equal(null);
				expect(comment._id).to.not.equal(null);

				var res = yield server.inject({
					method: 'DELETE',
					url: '/api/comment/'+comment._id,
					credentials: {username: testUserName, id: testUserId}
				});
				expect(res.statusCode).to.equal(200);
				expect(res.result.result.n).to.equal(1);

				var sameComment= yield server.app.db.comment.findById(comment._id)
				expect(sameComment).to.equal(null);
			}));

		}));

	}));
})();




