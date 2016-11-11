# ComBot

It is a slack bot that discovers relationships between source codes and developers by mining GitHub repositories. It uses repository contributions for creating file-to-developer mappings & facilitates quick communication via Slack.

The users can greet the bot by sending a message like `hi bot` on which the bot will respond with the set of command it supports.   
The users are initially expected to provide the bot with the link to the GitHub repository on which they wish they query. This can be
accomplished by sending the following command:
`fetch [link to Github repository]`
The bot will notify the user after fetching the repository information and creation of the file-to-developer mappings.
Following this message, the users can begin querying the repository for one or more use cases of our bot which are as follows:

##Use Cases
###Use Case 1 - Retrieving the top N contributors of a file  
**Flow**  
[S1] User provides the name of the file that he/she wishes to query using the following  command format:  
`file [filename] top [n]`  
[S2] Bot determines the number of commits by each contributor by performing a lookup on the file-to-developer mapping generated in the ‘fetch’ phase.  
[S3] Bot returns top N contributors for the specified file in descending order of number of commits.  

###Use Case 2: Retrieving the recent N contributors of a file
**Flow**  
[S1] User provides the name of the file that he/she wishes to query using the following  command format:    
`file [filename] recent [n]`  
[S2] Bot determines the most recent commit by each contributor by performing a lookup on the file-to-developer mapping generated in the ‘fetch’ phase.    
[S3] Bot returns the most recent N contributors of the specified file in descending order of commit times.    

###Use Case 3: Retrieving the company wise contribution count for an open source project repository  
**Flow**   
[S1] User provides the name of the file that he/she wishes to query using the following  command format:  
`orgContributors [filename]`  
[S2] Bot makes REST calls for each contributor for getting his company and generates a dictionary.  
[S3] Bot then iterates over the list of users for the company by using the FileMappings and then updates the count of contributions for his/her company.  
[S4] Bot then returns the company and its total contributions made to that file.    

## Task Tracking

##### Week 1

| Deliverable   | Item/Status   |  Issues/Tasks
| ------------- | ------------  |  ------------
| Use Case      | Get GitHub commit history | &nbsp;
| Subflow      | 0            |  Fetching Repository commits (Precondition)
| Bot Implementation| Complete    | Slack setup and bot interaction
|              | Complete    | Fetch commit history

#####Week 2
| Deliverable   | Item/Status   |  Issues/Tasks
| ------------- | ------------  |  ------------
| Use Case      | Get Top and Recent N committers | &nbsp;
| Subflow           | 1 / Complete     |  Get Top N committers
| Subflow           | 2 / In progress |  Get Recent N committers
| Bot Implementation| Complete    | Implementation of Bot and File classes
| | Complete    | Priority Queue implementation
| |  Bot interaction for file fetch | #1
| | Retrieving list of commits responses |#4

#####Week 3
| Deliverable   | Item/Status   |  Issues/Tasks
| ------------- | ------------  |  ------------
| Use Case      | Get company-wise contributors | &nbsp;
| Subflow      | 3 / Complete     | Make API calls based on login IDs   
| Bot Implementation | Complete   | Implemented File class
|  | Complete   | #2, #3
| Refactoring | Complete | Reorganized the code structure

## Screencast
[Slack Bot Screencast - SERVICE phase](https://youtu.be/M0Cck8CmSz4)
