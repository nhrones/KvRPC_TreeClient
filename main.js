import * as TreeBuilder from './treeView/builder.js'
import * as TreeView from './treeView/renderer.js'
import { getTreeObj } from './treeView/treeNodes.js'
import { DbClient } from './dbClient.js'

// when the getBtn is clicked, we first clear the treeView 
// then we fetch a fresh dataSet from the url
document.getElementById('getbtn').addEventListener('click', () => {

   // clear the tree
   const tree = document.getElementById('tree')
   tree.innerHTML = ''

   const DBServiceURL = document.getElementById('url').value
   const thisDB = new DbClient(DBServiceURL)
   console.log(DBServiceURL)

   // Initialize our KvRPC SSE client
   thisDB.init().then((result) => {
      thisDB.fetchQuerySet().then((data) => {
         const to = getTreeObj(data)
         const treeNodes = TreeBuilder.create(to.kv);
         TreeView.render(treeNodes, tree);
      })
   })
})