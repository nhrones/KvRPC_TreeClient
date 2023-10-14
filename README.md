# Kv-Viewer
This is an example application for examining DenoKv data in a TreeView.   
This app uses a simple SSE-RPC service to fetch all DenoKv-db-rows for    
viewing in a DOM Treeview. 
The SSE-RPC api must be installed in the target DB app.
This example defaults to a Deno Deploy test app with a DenoKv.

<br/>

![kv-tree](kv-tv.png)

## Note:
You can enter any URL that has implemented the minimal SSE-RPC api.   

## SSE-RPC
This simple SSE-RPC service is easy to use.    
  - A DB-Donner simply needs to implement the SSE-API    
  - Any client that implements the required client (see ./dbClient.js), can access any Donners DB
  - By design, any donner-db can support multiple clients.     

SEE: https://github.com/nhrones/KvRPC/blob/main/README.md


## WARNING: 
This is an unfinished work that was testing the concept of showing multipart-keys in a tree format.  Many features are yet to be implemented.  This work has now been rolled into another db project that has the ability to use many peristence layers. 

This simple client demonstrates a minimal transaction-based SSE-KV-RPC service.   

## Try It!
First, launch the Treeview Client from Github-Pages          
https://nhrones.github.io/KvRPC_TreeClient/    

Next, click the **Get Records** button.    

![Alt text](clickToFetch.png)    

Now, click the root node \<kv-prefix:\> to expand the tree

![Alt text](exspand.png)
