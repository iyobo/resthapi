'use strict'
/**
 * Created by iyobo on 2016-07-12.
 */
const Issue = require('../models/models').models.issue;
const Comment = require('../models/models').models.Comment;
const config = require('../config/configs').settings;
const Boom = require('boom');

module.exports = {
	/**
	 * Create an Issue
	 * @param payload should contain author, authorName, title, and body
	 * @returns {*}
	 */
	createIssue: function*(payload) {
		return yield new Issue(payload).save()
	},
	/**
	 * Create a comment and assign it to an issue
	 * @param payload should contain author, authorName, title, and body
	 * @returns {*}
	 */
	createComment: function*(issueId, payload) {

		//also set comment id in comment array
		let issue = yield Issue.findById(request.params.issueId)
		if(!issue){
			//issue does not exist
			throw Boom.notFound('No such Issue to comment on. id:'+request.params.issueId,request.params.issueId)
		}

		//use currently referenced issueId as issue
		payload.issue = request.params.issueId;

		let result = yield new Comment(payload).save()

		issue.comments.push(result._id)
		yield issue.save()

		return result;
	},
}