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
