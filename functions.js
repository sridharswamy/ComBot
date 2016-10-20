'use strict';
var Promise = require("bluebird");
var githubToken = "token " + process.env.GITHUB_API_TOKEN;
var request = require("request");
var urlRoot = "https://api.github.com";

function getCommits(userName, repoName, lisOfCommits)
{	
	var shaList=[]
    var options = {
	    url: urlRoot + '/repos/' + userName + '/' + repoName + '/commits',
	    method: 'GET',
	    headers: {        
	      "User-Agent": "EnableIssues",
	      "content-type": "application/json",
	      "Authorization": githubToken
   		 }
  	};

   	return new Promise(function (resolve, reject) {
	 	request(options, function (error, response, body) 
	  	{
		    var obj = JSON.parse(body);
		    for(var i = 0; i < obj.length; i++)
		    {
		  	    var sha = obj[i].sha;
                shaList.push(sha);
			}
			resolve(shaList);
		});
	});		
}

function callRequest( userName, repoName,sha) {
  // Send a http request to url and specify a callback that will be called upon its return.
		  var commitOptions = {
			        url: urlRoot + '/repos/' + userName + '/' + repoName + '/commits/' + sha,
			        method: 'GET',
			        headers: {        
			          "User-Agent": "EnableIssues",
			          "content-type": "application/json",
			          "Authorization": githubToken
			       }
	};
  	return new Promise(function (resolve, reject) {
		request(commitOptions, function (error, response, body) {
			//console.log("BODY"+body);
			var commitObj = JSON.parse(body);
		    resolve(commitObj);
  		});
  	});
}

function getUsers(userName,repoName){
	var commitOptions = {
			        url: urlRoot + '/repos/' + userName + '/' + repoName + '/contributors',
			        method: 'GET',
			        headers: {        
			          "User-Agent": "EnableIssues",
			          "content-type": "application/json",
			          "Authorization": githubToken
			       }
	};
	console.log(urlRoot + '/repos/' + userName + '/' + repoName + '/contributors');
  	return new Promise(function (resolve, reject) {
		request(commitOptions, function (error, response, body) {
			//console.log("BODY"+body);
			var commitObj = JSON.parse(body);
			console.log(commitObj);
			//console.log(commitObj);
		    resolve(commitObj);
  		});
  	});


}

function getCompany(userName){
	var commitOptions = {
			        url: urlRoot + '/users/' + userName,
			        method: 'GET',
			        headers: {        
			          "User-Agent": "EnableIssues",
			          "content-type": "application/json",
			          "Authorization": githubToken
			       }
	};
	console.log(urlRoot + '/users/' + userName);
  	return new Promise(function (resolve, reject) {
		request(commitOptions, function (error, response, body) {
			//console.log("BODY"+body);
			var commitObj = JSON.parse(body);
			//console.log(commitObj);
		    resolve(commitObj.company);
  		});
  	});

}
exports.getCompany = getCompany;
exports.getUsers = getUsers;
exports.callRequest = callRequest;
exports.getCommits = getCommits;