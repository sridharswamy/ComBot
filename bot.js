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
let functions = require('./lib/functions.js');
let mocking = require('./mock/mocking.js');
let parser = require('./lib/parser.js');

var githubToken = "token " + process.env.GITHUB_API_TOKEN;
var urlRoot = "https://api.github.com";
var fileMappings = {};
var companyMappings = {};

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
		  let user = this.slack.dataStore.getUserById(this.slack.activeUserId);
		  let team = this.slack.dataStore.getTeamById(this.slack.activeTeamId);
		  this.name = user.name;
		  console.log(`Connected to ${team.name} as ${user.name}`);
		});

		this.slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
			console.log('Logged in as ' + rtmStartData.self.name + ' of team '
				+ rtmStartData.team.name + ' but not yet connected to a channel!');
		});

		this.slack.on(RTM_EVENTS.MESSAGE,(message)=>{
		  this.messageHandler(message);
		});

		this.slack.start();
  	}

	messageHandler(message) {
		//Call this function only for mocking. To be commented out otherwise.
		//mocking.mock();
		let messageSender = this.slack.dataStore.getUserById(message.user);

		if(messageSender && messageSender.is_bot) {
		   return;
		}

		let channel = this.slack.dataStore.getChannelGroupOrDMById(message.channel);
		if (message.text) {
		    let msgText = message.text;
		    let msgTextLower = msgText.toLowerCase();
		    if (/(hello|hi|hey) (bot|combot)/g.test(msgTextLower)) {
		      this.slack.sendMessage('Hello to you too, ' + messageSender.name + '! How can I help you?\n I understand the following commands: \n 1. *fetch* [GitHub repository link] \n 2. *file* [Filename] [recent/top] [number] \n 3. *orgContributors* [Filename]', channel.id);
		    }

		    else if (/fetch/g.test(msgText)) {
			    let dm = this.slack.dataStore.getDMByName(messageSender.name);
		        var re = /fetch\s+<((https|http)\:\/\/)?((www.)?(github.com)){1}\/([\w+._]+)\/([\w+-._]+)>/g;
	  		    var match = re.exec(msgText);
			    var repoName = "";
				var username = "";
				if(match != null) {
					username = match[6];
					repoName = match[7];
					this.slack.sendMessage("Fetching commit history from the repo *"+repoName+"*. I will notify you as soon as I'm done!", channel.id);
					var users = [];
					functions.getUsers(username,repoName).then(function (obj) {
						for(var i in obj) {
							var name = obj[i].login;
							users.push(name);
						} 
						return users;
					}).then(function(users) {
						Promise.map(users,function(user) {
							functions.getCompany(user).then(function(company) {
								if(company) {
									companyMappings[user]=company;
								}
							});
						});
					});

					var listOfCommits = [];
					var finalresponse=[];
					functions.getCommits(username, repoName, listOfCommits).then(function (shaList) {
						Promise.map(shaList,function(sha) {
							return functions.callRequest(username,repoName,sha)
						}).then(function(finalresponse) {
							parser.responseParser(finalresponse,function(response){
								fileMappings = response;
							});
						});
					});
					this.slack.sendMessage("Fetching successfully completed!", channel.id);
				}
				else {
					this.slack.sendMessage('The URL you entered is invalid. Please enter valid GitHub URL!', channel.id);
				}

			}
			else if(/file/g.test(msgText)) {
				if(Object.keys(fileMappings).length === 0) {
					this.slack.sendMessage("You need to fetch a repository first!", channel.id);
				}
				else {
					var values = msgText.split(/\s+/);
					if(values.length != 4 || (values[2]!="top" && values[2]!="recent") || isNaN(values[3])) {
						this.slack.sendMessage("Invalid command format!", channel.id);
						return;
					}
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
			
			else if (/orgContributors/g.test(msgText)) {
				if (Object.keys(fileMappings).length === 0) {
					this.slack.sendMessage("You need to fetch a repository first!", channel.id);
				}
				else {
					var values = msgText.split(/\s+/);
					var fileName = values[1];
					var companyContributionsCount = {};
					if(fileMappings[fileName]) {
						var fileObj = fileMappings[fileName];
						for(var user_email in fileObj.committerCounts) {
							var count = fileObj.committerCounts[user_email];
							var username = fileObj.emailToUserName[user_email];
							var company = companyMappings[username];
							if(!companyContributionsCount[company]) {
								companyContributionsCount[company] = 0;
							}
							companyContributionsCount[company] += count;
						}
						var result = "The following are company-wise contributions for " + fileName + " \n";
						for(var company in companyContributionsCount) {
							result = result + company + ": " + companyContributionsCount[company] + "\n";
						}
						this.slack.sendMessage(result, channel.id);
					}
					else {
						this.slack.sendMessage("Sorry, I couldn't locate that file!",channel.id);
					}
				}
			}
		}
	}
}
module.exports=Bot;