'use strict';
let File = require('./file');

var jsonReader = require('jsonfile');
var path = 'mock.json';
var commit_data = jsonReader.readFileSync(path);

var fileMap = {};

var committer_email = commit_data.commit.committer.email;
var commit_date = commit_data.commit.committer.date;
var files = commit_data.files;

for (var i in files) {
	var fname = files[i].filename;
	if(!fileMap.hasOwnProperty(fname)){
		fileMap[fname] = new File(fname);
	}
	var fobj = fileMap[fname];
	fobj.addCommit(committer_email,commit_date);
}

for (var key in fileMap) {
	console.log(fileMap[key].getTopNCommitters(0));
}