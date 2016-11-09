var nock = require("nock");
var bot = require("../bot.js");

// Load mock data
var listOfCommits = require("./data/listOfCommits.json");
var fileData = require("./data/fileData.json");
var contributors = require("./data/contributors.json");
var userOctocat = require("./data/userOctocat.json");
var userSpaceGhost = require("./data/userSpaceGhost.json");
options = {allowUnmocked: true};

function mock() {
	var mockServiceListCommits = nock("https://api.github.com",options)
	  .persist()
	  .get("/repos/test/Hello-World/commits")
	  .reply(200, JSON.stringify(listOfCommits));

	var mockSha = listOfCommits[0].sha

	var mockServiceFileData = nock("https://api.github.com",options)
	  .persist()
	  .get("/repos/test/Hello-World/commits/"+mockSha)
	  .reply(200, JSON.stringify(fileData));

	var mockContributions = nock("https://api.github.com",options)
	  .persist()
	  .get("/repos/test/Hello-World/contributors")
	  .reply(200, JSON.stringify(contributors));

	var mockUserOctocat = nock("https://api.github.com",options)
	  .persist()
	  .get("/users/test")
	  .reply(200, JSON.stringify(userOctocat));

	var mockUserSpaceGhost = nock("https://api.github.com",options)
	  .persist()
	  .get("/users/Spaceghost")
	  .reply(200, JSON.stringify(userSpaceGhost)); 
} 

exports.mock = mock;