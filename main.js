import * as TreeBuilder from './treeView/builder.js'
import * as TreeView from './treeView/renderer.js'
import { createTreeObjects } from './treeView/treeNodes.js'
import { DbClient } from './dbClient.js'

const urls = document.getElementById('urls')
const url = document.getElementById('url')
export let rawData = ''


urls.addEventListener('change', () => {
   url.value = urls.value
   tree.innerHTML = ''
})

// when the getBtn is clicked, we first clear the treeView 
// then we fetch a fresh dataSet from the url
document.getElementById('getbtn').addEventListener('click', () => {
   // clear the tree
   const tree = document.getElementById('tree')
   const DBServiceURL = url.value
   tree.innerHTML = ''
   const thisDB = new DbClient(DBServiceURL)

   // Initialize our KvRPC SSE client
   thisDB.init().then((_result) => {
      let fetchStart = performance.now()
      thisDB.fetchQuerySet().then((data) => {
         rawData = data
         console.log(`RPC fetch from url: ${url.value} took ${(performance.now() - fetchStart).toFixed(1)}ms`)
         //console.log('rawData ', JSON.stringify(rawData))
         const treeObjects = createTreeObjects(rawData)
         //console.log('treeObjects ', JSON.stringify(treeObjects))
         const treeNodes = TreeBuilder.create(treeObjects.kv);
         //console.log(treeNodes)
         TreeView.render(treeNodes, tree);
      })
   })
})