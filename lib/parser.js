'use strict';
let File = require('../models/File');
var jsonReader = require('jsonfile');

function responseParser (filePath, callback) {
	var commit_data = filePath;
	var fileMap = {};

	for(var commit1 in commit_data) {
		var committer_email = commit_data[commit1].commit.committer.email;

		var committer_username;
		if(commit_data[commit1].committer != null)
			committer_username = commit_data[commit1].committer.login;
		var commit_date = commit_data[commit1].commit.committer.date;
		var files = commit_data[commit1].files;

		for (var i in files) {
			var fname = files[i].filename;

			if(!fileMap.hasOwnProperty(fname)) {
				fileMap[fname] = new File(fname);
			}

			var fobj = fileMap[fname];
			fobj.addCommit(committer_email, commit_date, committer_username);
		}
	}
	return callback(fileMap);
}

module.exports = {responseParser: responseParser}
