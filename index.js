'use strict';

var request = require('request');
var fs = require("fs");
var Promise = require('bluebird');
var parse = require('parse-link-header');

const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const slack_token = process.env.SLACK_API_TOKEN;
const redis = require('redis');
const client = redis.createClient();

// Initializing Github connection
let Bot = require('./bot');

const bot = new Bot({
	token: process.env.SLACK_API_TOKEN,
	autoReconnect: true,
	autoMark: true
});

client.on('error',(err)=>{
	console.log('Error ' +err);
});

client.on('connect',()=>{
	console.log('Connected to Redis!');
});