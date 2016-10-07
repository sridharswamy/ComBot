'use strict';

var request = require('request');
var fs = require("fs");
var Promise = require('bluebird');
var parse = require('parse-link-header');
var mongodb = require('mongodb')

const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const slack_token = process.env.SLACK_API_TOKEN;

// Initializing Github connection
var githubToken = "token " + process.env.GITHUB_API_TOKEN;
var userId = "akshaynayak";
var urlRoot = "https://api.github.com";
var commits = []

// Initializing MongoDB connection
var mongoClient = mongodb.MongoClient;
var mongoURL = 'mongodb://localhost:27017/slack_bot_db';
mongoClient.connect(mongoURL, function (err, db) {
  if (err) {
    console.log('Could not connect to MongoDB server! Error: ', err);
  } 
  else {
    console.log('Successfully connected to the MongoDB server!');
    var collection = db.collection('repo_files');

    let slack = new RtmClient(slack_token, {
      logLevel: 'error', 
      dataStore: new MemoryDataStore(),
      autoReconnect: true,
      autoMark: true 
    });

    slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() {
      let user = slack.dataStore.getUserById(slack.activeUserId);
      let team = slack.dataStore.getTeamById(slack.activeTeamId);
      console.log('Connected to ' + team.name + ' as ' + user.name);
    });

    slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
      console.log('Logged in as ' + rtmStartData.self.name + ' of team ' 
        + rtmStartData.team.name + ' but not yet connected to a channel!');
    });

    slack.on(RTM_EVENTS.MESSAGE, function(message) {
      let messageSender = slack.dataStore.getUserById(message.user);

      if(messageSender && messageSender.is_bot){
        return;
      }

      let channel = slack.dataStore.getChannelGroupOrDMById(message.channel);
      if(message.text) {
        let msgText = message.text.toLowerCase();
        if(/(hello|hi|hey) (bot|sridharbot)/g.test(msgText)) {
         slack.sendMessage('Hello to you too, ' + messageSender.name + '!', channel.id);
        }
      
        if(/fetch/g.test(msgText)) {
          let dm = slack.dataStore.getDMByName(messageSender.name);
          var re= /fetch <((https|http)\:\/\/)?((www.)?(github.com)){1}\/([\w+._]+)\/([\w+-._]+)>/g;
          var myString = msgText;
          var match = re.exec(myString);
          var repoName = "";
          var username = "";
          if(match == null) {
            slack.sendMessage('The URL you entered is invalid. Please enter valid GitHub URL!', channel.id);
          }
          else {
            username = match[6];
            repoName = match[7];
            slack.sendMessage("Fetching commit history from the repo *"+repoName+"*. I will notify you as soon as I'm done!", channel.id);
          }

          commits = getCommits('sridharswamy', 'Slack-Bot', commits);
          collection.insert({repoName:commits});
          //console.log("Commits: " + commits);         
          //slack.sendMessage('Commit: ' + commits, channel.id);
        }
      } 
    });

    // Start the login process
    slack.start();
    console.log("Insertion complete");
  }
});


function getCommits(userName, repoName, commits)
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
  commits = callRequest(options, commits, userName, repoName);
  return commits;
}

function callRequest(options, commits, userName, repoName) {
  // Send a http request to url and specify a callback that will be called upon its return.
  request(options, function (error, response, body) 
  {
    var obj = JSON.parse(body);
    commits.push(obj);
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
      callCommits(commitOptions);       
    }
  }); 
  return commits;
}

function callCommits(commitOptions) {
  request(commitOptions, function (error, response, body) 
  {
    var commitObj = JSON.parse(body);
    console.log("CommitOptions" +commitObj);
    for( var i = 0; i < commitObj.files.length; i++ ) {
      console.log(commitObj.commit.author.name + " " + commitObj.files[i].filename);
    }
  });
}
