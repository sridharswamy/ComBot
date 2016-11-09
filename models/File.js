'use strict';

const PriorityQueue = require('priorityqueue');


class File {
	constructor(name) {
	  this.name = name;
	  this.committerCounts = {};
	  this.committerTimes = {};
	  this.emailToUserName = {};
	}

	// Returns the name of the file
	getName() {
	    return this.name;
	}

	// Returns the user who have contributed to the file and their commit counts
	getCommitSummary(command, count) {
		var summary = "";
		if(command == "top") {
			summary = this.getTopNCommitters(count);
		}
		else {
			summary = this.getRecentNCommitters(count);
		}
		return summary;
	}

	// Adds a commit to the File
	addCommit(committer, commitTime, committer_username) {
		this.addCommitter(committer);
		this.addCommitTime(committer, commitTime);
		if(!this.emailToUserName[committer]) {
			this.emailToUserName[committer] = committer_username;
		}
	}

	// Adds committer details to the file commit list
	addCommitter(committer) {
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
		var result = "";
		result += 'Top ' + n + ' committers for the file ' + this.name + ' are as follows:\n';
		result += '========================================================================\n';

		let pq = new PriorityQueue({
   			comparator: (a, b)=>
     		a.commits !== b.commits ? a.commits - b.commits : a.name - b.name
		});

		for(var i in this.committerCounts) {
			pq.push(new UserCommitCount(i, this.committerCounts[i]));
		}

		var j = 0;
		while(pq.top() != undefined && j < n) {
			var user = pq.pop();
			result += user.name + ': ' + user.commits +' commits \n';
			j++;
		}
		return result;
	}

	// Prints out n most recent committers of the file
	getRecentNCommitters(n) {
		var result = "";
		result += 'Recent ' + n + ' committers for the file ' + this.name + ' are as follows:\n';
		result += '========================================================================\n';

		let pq = new PriorityQueue({
   			comparator: (a, b)=>
     		a.commitTime !== b.commitTime ? a.commitTime - b.commitTime : a.name - b.name
		});

		for(var i in this.committerTimes) {
			pq.push(new UserCommitTime(i, this.committerTimes[i]));
		}

		var j = 0;
		while(pq.top()!= undefined && j < n) {
			var user = pq.pop();
			result += user.name + ': ' + new Date(user.commitTime) + '\n';
			j++;
		}
		return result;
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

module.exports = File;
