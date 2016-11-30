##Bot Deployment

We have fully provisioned and configured an EC2 instance for deploymnet of our slack bot using ansible

Reference: http://tomoconnor.eu/blogish/part-3-ansible-and-amazon-web-services/#.WD332KIrLwf

###Prerequisites:

1) Ansible
To install ansible on your machine
```
sudo pip install ansible
```

2) Boto
To install ansible on your machine
```
sudo pip install boto
```

3) AWS account

Get your Access Key ID, Secret Access Key and download SSH keypairs for EC2 instance

Also create a security group that allows TCP ports 22, 80 and 443, and all ICMP traffic through the firewall


###Steps

1) Set up environment vairables

```
export AWS_ACCESS_KEY=<Your Access Key ID>

export AWS_SECRET_KEY=<Your Secret Access Key>

export ANSIBLE_HOST_KEY_CHECKING=False
```

2) Copy the downloaded SSH key pairs from AWS account to  ```~/.ssh/``` on your computer

3) Download the ```deployment/deploy.yml``` 

4) Open ```deploy.yml``` and update ```GITHUB_API_TOKEN``` and ```SLACK_API_TOKEN``` in 

```
    environment:
      GITHUB_API_TOKEN: <Your Github API Token>
      SLACK_API_TOKEN: <Your Slack API Token>
```

Also be sure that you correctly assign values to the variables
```
vars:
      instance_type: <Instance type>
      security_group: <Security group you created>
      image: <Image>
      region: <Region>
      keypair: <Name of key file downloaded from AWS>
```

5) Create a new file ```hosts``` in the same directory of ```deploy.yml``` on your machine as

```
[launched]

```

6) If you want to run the bot for the first time, then you have to create and configure EC2 instance. To do so run the following in the terminal

```
ansible-playbook -i hosts deploy.yml
```

If you have already provisioned EC2 instance before and only want to configure the environment, then you can run the following in the terminal

```
ansible-playbook -i hosts deploy.yml --skip-tags ec2provisioning
```



Following is the screencast for Deployment https://youtu.be/ceo18id6RDI

## Instructions for Acceptance Testing

####List of commands (Preconditions + Use Cases)
1) <b> hi bot </b>    
This command is used to view the set of commands that are supported by the bot.   
Example usages:    
1) HI BOT    
2) hi bot    

2) <b> fetch &lt;github repository link&gt; </b>    
This command is used to fetch the contents of the repository you wish to query.    
Example usages:    
1) fetch https://github.com/sridharswamy/ComBot    
2) fetch http://github.com/sridharswamy/ComBot

======
###Commands for use cases
<b> Use case 1 </b>    
<b> file &lt;filename&gt; top &lt;n&gt; </b>    
This command will retrieve the top n contributors to a file based on the number of commits.     
Example usages:     
  1) file bot.js top 3    
  2) file lib/functions.js top 2

<b> Use case 2 </b>    
<b> file &lt;filename&gt; recent &lt;n&gt; </b>   
This command will retrieve the recent n contributors to a file based on the commit times.    
Example usages:     
  1) file bot.js recent 3    
  2) file lib/functions.js recent 2

<b> Use case 3 </b>    
<b> orgContributors &lt;filename&gt; </b>    
This command will fetch the contributions by various organizations to the file in descending order. (Useful in open-source projects)      
Example usages:     
  1) orgContributors bot.js      
  2) orgContributors lib/functions.js
  
  
### Example of a possible flow
1. hi bot
2. fetch https://github.com/sridharswamy/ComBot
3. file bot.js top 3
4. file index.js recent 3
5. orgContributors README.md


## Task Tracking

##### Week 1
| Deliverable	| Item/Status	| Issues/Tasks
| ------------- | ------------  |  ------------
| Use Case Testing |	Complete	|Testing against non-static github repositories
| Acceptance Testing| 	In Progress	|Verifying result correctness
|	Bug found 	| Limit for commits | 30
		
#####Week 2
| Deliverable	|Item/Status	|Issues/Tasks
| ------------- | ------------  |  ------------
| Acceptance Testing 	Complete	|Fixed issue
| Provision EC2 instance	Complete |	Automating instance provision with Ansible
| Configure EC2 instance	| In Progress	| Incompatible Node js and Npm versions
		
#####Week 3
| Deliverable |	Item/Status	| Issues/Tasks
| ------------- | ------------  |  ------------
| Configure EC2 instance	| Complete	| Generating scripts for handling npm and nodejs versions
