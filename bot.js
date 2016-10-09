'use strict';

const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const slack_token = process.env.SLACK_API_TOKEN;
var request = require('request');
var fs = require("fs");
var Promise = require('bluebird');
var parse = require('parse-link-header');

var githubToken = "token " + process.env.GITHUB_API_TOKEN;
var userId = "akshaynayak";
var urlRoot = "https://api.github.com";

class Bot {
  constructor(opts) {
	let slackToken = opts.token;
	let autoReconnect = opts.autoReconnect || true;
	let autoMark = opts.autoMark || true;

	this.slack = new RtmClient(slackToken, { 
	  logLevel: 'error', 
	  dataStore: new MemoryDataStore(),
	  autoReconnect: autoReconnect,
	  autoMark: autoMark
	});

	this.slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
	  let user = this.slack.dataStore.getUserById(this.slack.activeUserId)
	  let team = this.slack.dataStore.getTeamById(this.slack.activeTeamId);

	  this.name = user.name;

	  console.log(`Connected to ${team.name} as ${user.name}`);      
	});

	this.slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  		console.log('Logged in as ' + rtmStartData.self.name + ' of team ' 
    	+ rtmStartData.team.name + ' but not yet connected to a channel!');
	});


	this.keywords=new Map();
	this.slack.on(RTM_EVENTS.MESSAGE,(message)=>{
		let messageSender = this.slack.dataStore.getUserById(message.user);

	  if(messageSender && messageSender.is_bot){
	    return;
	  }

	  let channel = this.slack.dataStore.getChannelGroupOrDMById(message.channel);
	  if(message.text) {
	    let msgText = message.text.toLowerCase();
	    if(/(hello|hi|hey) (bot|sridharbot)/g.test(msgText)) {
	     this.slack.sendMessage('Hello to you too, ' + messageSender.name + '!', channel.id);
	    }
	  
	    if(/fetch/g.test(msgText)) {
	      let dm = this.slack.dataStore.getDMByName(messageSender.name);
	      var re= /fetch <((https|http)\:\/\/)?((www.)?(github.com)){1}\/([\w+._]+)\/([\w+-._]+)>/g;
	      var myString = msgText;
	      var match = re.exec(myString);
	      var repoName = "";
	      var username = "";
	      if(match == null) {
	        this.slack.sendMessage('The URL you entered is invalid. Please enter valid GitHub URL!', channel.id);
	      }
	      else {
	        username = match[6];
	        repoName = match[7];
	        this.slack.sendMessage("Fetching commit history from the repo *"+repoName+"*. I will notify you as soon as I'm done!", channel.id);
	      }
	      var commits = []
	      commits = this.getCommits(username, repoName, commits);
	      //console.log("Commits: " + commits);         
	      //slack.sendMessage('Commit: ' + commits, channel.id);
	    }
	  }	
	});


	this.slack.start();
  }

 //  respondTo(keyword,callback,start){

	// if(start){
	//   keyword='^'+keyword;
	// }

	// let regex=new RegExp(keyword,'i');
	// this.keywords.set(regex,callback);
 //  }

 //  send(message,channel,cb){

 //    this.slack.sendMessage(message,channel.id,()=>{
	// 	  if(cb){
	// 	    cb();
	// 		}
	//   });

 //  }


	getCommits(userName, repoName, commits)
	{
	  var options = {
	    url: urlRoot + '/repos/' + userName + '/' + repoName + '/commits',
	    method: 'GET',
	    headers: {        
	      "User-Agent": "EnableIssues",
	      "content-type": "application/json",
	      "Authorization": githubToken
	    }
	  };
	  commits = this.callRequest(options, commits, userName, repoName);
	  return commits;
	}

	callRequest(options, commits, userName, repoName) {
	  // Send a http request to url and specify a callback that will be called upon its return.
	  request(options, function (error, response, body) 
	  {
	    var obj = JSON.parse(body);
	    commits.push(obj);
	    //console.log(obj);
	    for( var i = 0; i < obj.length; i++ )
	    {
	      var sha = obj[i].sha;
	      var commitOptions = {
	        url: urlRoot + '/repos/' + userName + '/' + repoName + '/commits/' + sha,
	        method: 'GET',
	        headers: {        
	          "User-Agent": "EnableIssues",
	          "content-type": "application/json",
	          "Authorization": githubToken
	        }
	      };
				request(commitOptions, function (error, response, body) 
		  	{
		  	var commitObj = JSON.parse(body);
		    //console.log("CommitOptions" +commitObj);
		    for( var i = 0; i < commitObj.files.length; i++ ) {
		      console.log(commitObj.commit.author.name + " " + commitObj.files[i].filename);
		    }
		  });     
	    }
	  }); 
	  return commits;
	}


	

}


module.exports=Bot;