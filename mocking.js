var nock = require("nock");
var bot = require("./bot.js");

// Load mock data
var listOfCommits = require("./mockListOfCommits.json");
var fileData = require("./mockFileData.json");
var contributors= require("./mockContributors.json");
var userOctocat=require("./mockUserOctocat.json");
var userSpaceGhost=require("./mockUserSpaceGhost.json");

function mock(){
	var mockServiceListCommits = nock("https://api.github.com")
	  .persist() // This will persist mock interception for lifetime of program.
	  .get("/repos/octocat/Hello-World/commits")
	  .reply(200, JSON.stringify(listOfCommits));

	var mockSha=listOfCommits[0].sha

	var mockServiceFileData = nock("https://api.github.com")
	  .persist() // This will persist mock interception for lifetime of program.
	  .get("/repos/octocat/Hello-World/commits/"+mockSha)
	  .reply(200, JSON.stringify(fileData));

	var mockContributions = nock("https://api.github.com")
	  .persist() // This will persist mock interception for lifetime of program.
	  .get("/repos/octocat/Hello-World/contributors")
	  .reply(200, JSON.stringify(contributors));

	var mockUserOctocat = nock("https://api.github.com")
	  .persist() // This will persist mock interception for lifetime of program.
	  .get("/users/octocat")
	  .reply(200, JSON.stringify(userOctocat));

	var mockUserSpaceGhost = nock("https://api.github.com")
	  .persist() // This will persist mock interception for lifetime of program.
	  .get("/users/Spaceghost")
	  .reply(200, JSON.stringify(userSpaceGhost)); 

} 

exports.mock = mock;