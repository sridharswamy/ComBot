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
  	  }	
    });

    // Start the login process
    slack.start();
  }
});