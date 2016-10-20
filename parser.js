'use strict';
let File = require('./File');
var jsonReader = require('jsonfile');

function responseParser (filePath, callback){
  	//var path = filePath;
	var commit_data = filePath;//jsonReader.readFileSync(path);
	var fileMap = {};

	for(var commit1 in commit_data){
		var committer_email = commit_data[commit1].commit.committer.email;
		var commit_date = commit_data[commit1].commit.committer.date;
		var files = commit_data[commit1].files;
		console.log(committer_email);


		for (var i in files) {
			var fname = files[i].filename;
			console.log("Key:::::::::::"+fname);
			if(!fileMap.hasOwnProperty(fname)){
				fileMap[fname] = new File(fname);
			}

			var fobj = fileMap[fname];
			fobj.addCommit(committer_email, commit_date);
		}
	}
	return callback(fileMap);
}

module.exports = {responseParser: responseParser}
