'use strict';

const PriorityQueue = require('priorityqueue');

class File {
	constructor(name) {
	  this.name = name;
	  this.committerCounts = {};
	  this.committerTimes = {};
	}

	// Returns the name of the file
	getName() {
	    return this.name;
	}

	// Returns the user who have contributed to the file and their commit counts
	getCommitSummary() {
		return this.committerCounts;
	}

	// Adds a commit to the File
	addCommit(committer, commitTime) {
		this.addCommitter(committer);
		this.addCommitTime(committer, commitTime);	
	}

	// Adds committer details to the file commit list
	addCommitter(committer){
		if(!(committer in this.committerCounts))
			this.committerCounts[committer] = 1;
		else
			this.committerCounts[committer] += 1;
	}

	// Adds committer name and time to the map if this commit is a newer one
	addCommitTime(committer, committerTime) {
		// Current commit time converted to epoch
		var currentCommitTime = new Date(committerTime).valueOf();

		// If the committer info doesn't already exist or if it is a more recent commit, add the info to the map
		if(!this.committerTimes[committer] || currentCommitTime > this.committerTimes[committer])
			this.committerTimes[committer] = currentCommitTime;
	}

	// Prints out the n top committers of the file
	getTopNCommitters(n) {
		console.log();
		console.log('Top ' + n + ' committers for the file ' + this.name + ' are as follows:');
		console.log('===========================================================================');

		let pq = new PriorityQueue({
   			comparator: (a, b)=>
     		a.commits !== b.commits ? a.commits - b.commits : a.name - b.name
		});

		for(var i in this.committerCounts){
			pq.push(new UserCommitCount(i, this.committerCounts[i]));
		}

		var j = 0;
		while(pq.top() != undefined && j < n){
			var user = pq.pop();
			console.log(user.name + ': ' + user.commits +' commits');
			j++;
		}
		console.log();
	}

	// Prints out n most recent committers of the file
	getRecentNCommitters(n) {
		console.log();
		console.log('Recent ' + n + ' committers for the file ' + this.name + ' are as follows:');
		console.log('===========================================================================');

		let pq = new PriorityQueue({
   			comparator: (a, b)=>
     		a.commitTime !== b.commitTime ? a.commitTime - b.commitTime : a.name - b.name
		});

		for(var i in this.committerTimes){
			pq.push(new UserCommitTime(i, this.committerTimes[i]));
		}

		var j = 0;
		while(pq.top()!= undefined && j < n){
			var user = pq.pop();
			console.log(user.name + ': ' + new Date(user.commitTime));
			j++;
		}
		console.log();
	}

}


class UserCommitCount {
	constructor(name, commits){
		this.name = name;
		this.commits = commits;
	}
}


class UserCommitTime {
	constructor(name, commitTime){
		this.name = name;
		this.commitTime = commitTime;
	}
}


var v1 = new File('Bot.js');
var v2 = new File('File.js');

v1.addCommit('Sridhar','2016-10-06T16:45:56Z');
v1.addCommit('Sridhar','2016-10-06T17:23:12Z');
v1.addCommit('Sridhar','2016-10-08T17:26:33Z');

v1.addCommit('Akshay','2016-10-02T16:30:07Z');
v1.addCommit('Akshay','2016-10-02T17:45:49Z');
v1.addCommit('Akshay','2016-10-04T18:50:46Z');
v1.addCommit('Akshay','2016-10-05T19:30:33Z');
v1.addCommit('Akshay','2016-10-06T20:02:42Z');
v1.addCommit('Akshay','2016-10-11T23:10:12Z');
v1.addCommit('Akshay','2016-10-11T22:00:09Z');

v1.addCommit('Siddhant','2016-10-11T16:50:29Z');

v1.addCommit('Akash','2016-10-06T22:45:49Z');
v1.addCommit('Akash','2016-10-10T23:11:49Z');

v1.getTopNCommitters(4);
v1.getRecentNCommitters(4);