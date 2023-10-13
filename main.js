import * as TreeBuilder from './treeView/builder.js'
import * as TreeView from './treeView/renderer.js'
import { getTreeObj } from './treeView/treeNodes.js'
import { DbClient } from './dbClient.js'

export const thisDB = new DbClient()

// Initialize our KvRPC SSE client
thisDB.init().then ( (result) => {
   thisDB.fetchQuerySet().then ((data)=>{
      const to = getTreeObj(data)
      const tree = TreeBuilder.create(to.kv);
      TreeView.render(tree, document.querySelector('.root'));
   })
})
