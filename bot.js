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
var jsonReader = require('jsonfile');
var nock = require('nock');

let parser = require('./parser.js');

var githubToken = "token " + process.env.GITHUB_API_TOKEN;
var userId = "akshaynayak";
var urlRoot = "https://api.github.com";
var fileMappings = {};
var data = require('./mock0.json');
var data1 = require('./mock.json');

var githubapi = nock("https://api.github.com")

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


		this.keywords = new Map();

		this.slack.on(RTM_EVENTS.MESSAGE,(message)=>{
		  this.messageHandler(message);
		});

		this.slack.start();
  	}

	messageHandler(message) {
		let messageSender = this.slack.dataStore.getUserById(message.user);

		if(messageSender && messageSender.is_bot){
		   return;
		}

		let channel = this.slack.dataStore.getChannelGroupOrDMById(message.channel);
		if(message.text) {
		    let msgText = message.text.toLowerCase();

		    if(/(hello|hi|hey) (bot|sridharbot)/g.test(msgText)) {
		      this.slack.sendMessage('Hello to you too, ' + messageSender.name + '! How can I help you?\n I understand the following commands: \n 1. *fetch* [GitHub repository link] \n 2. *file* [Filename] [recent/top] [number]', channel.id);
		    }

		    if(/fetch/g.test(msgText)) {
			    let dm = this.slack.dataStore.getDMByName(messageSender.name);
		        var re = /fetch <((https|http)\:\/\/)?((www.)?(github.com)){1}\/([\w+._]+)\/([\w+-._]+)>/g;

	  		    var match = re.exec(msgText);
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

				var repocommits = githubapi.get('/repos/' + username + '/' + repoName + '/commits')
					.reply(200, JSON.stringify(data));

				var sha = data[0].sha;
			
				var commitresponse = githubapi.get('/repos/' + username + '/' + repoName + '/commits/' + sha)
						.reply(200, JSON.stringify(data1));

				getCommits(username, repoName, commits).then(function (response) {
					console.log("Printing response inside callback" +response);
					console.log(response);
					commits = response;
				});
				//slack.sendMessage('Commit: ' + commits, channel.id);
			}

			if(/file/g.test(msgText)) {
				if(Object.keys(fileMappings).length === 0) {
					this.slack.sendMessage("You need to fetch a repository first!", channel.id);
				}
				else {
					var values = msgText.split(" ");
					var fileName = values[1];
					var query = values[2];
					var count = values[3];
					if(fileMappings[fileName]) {
						this.slack.sendMessage(fileMappings[fileName].getCommitSummary(query, count), channel.id);
					}
					else {
						this.slack.sendMessage("Sorry, I couldn't locate that file!", channel.id);
					}
				}
			}
		}
	}
}

function getCommits(userName, repoName, commits)
{
	var listOfCommits = [];
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
		    	var commitOptions = {
			        url: urlRoot + '/repos/' + userName + '/' + repoName + '/commits/' + sha,
			        method: 'GET',
			        headers: {        
			          "User-Agent": "EnableIssues",
			          "content-type": "application/json",
			          "Authorization": githubToken
			        }
		      	};

		      	callRequest(commitOptions, userName, repoName).then(function (commitObj) {
		      		listOfCommits.push(commitObj);
   					console.log("LIST OF COMMITS AFTER PUSH" +listOfCommits);
					resolve(listOfCommits);
		      	});
			}
		});
	});		
}

function callRequest(commitOptions, userName, repoName) {
  // Send a http request to url and specify a callback that will be called upon its return.

  	return new Promise(function (resolve, reject) {
		request(commitOptions, function (error, response, body) {
			var commitObj = JSON.parse(body);
		    console.log("INSIDE PROMISE commit obj"+commitObj);
		    // for( var i = 0; i < commitObj.files.length; i++ ) {
		    //   console.log(commitObj.commit.author.name + " " + commitObj.files[i].filename);
		    //   console.log("Kota ki mkc");
		    // }
		    resolve(commitObj);
  		});
  	});
  	console.log("COMMITS INSIDE PROMISE"+commits);
    resolve(commits);




}

module.exports=Bot;