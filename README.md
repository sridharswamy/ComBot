##Bot Setup

###Prerequisites:

1) The bot requires Redis server to be installed. In order to install Redis server on an Ubuntu Machine, we need to follow the following commands:  
`wget http://download.redis.io/redis-stable.tar.gz`  
`tar xvzf redis-stable.tar.gz`  
`cd redis-stable`  
`make`

2) Run the redis server a another terminal with the command `redis-server`.   

3) Open a new terminal and export the GitHub and Slack API tokens.    
`export GITHUB_API_TOKEN= 'Enter Github API token here without quotes'`          
`export SLACK_API_TOKEN='Enter Slack API token here without quotes'`       
Run `node index.js`  

OR

Update api-keys.sh with your Github API token and Slack API token and run `./api-keys.sh`

4) Add 'ComBot' to your Slack channel.
