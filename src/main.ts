
/// <reference lib="dom" />
// deno-lint-ignore-file no-explicit-any

import * as TreeBuilder from './treeView/builder.ts'
import * as TreeView from './treeView/renderer.ts'
import { createTreeObjects } from './treeView/treeNodes.ts'
import { DbClient } from './deps.ts' //'./dbClient.ts'
const urls = document.getElementById('urls') as HTMLSelectElement
const url = document.getElementById('url') as HTMLInputElement
export let rawData = ''
const getButton = document.getElementById('getbtn') as HTMLButtonElement
const treeView = document.getElementById('tree') as HTMLDivElement

urls.addEventListener('change', () => {
   url.value = urls.value
   treeView.innerHTML = ''
})

// when the getBtn is clicked, we first clear the treeView 
// then we fetch a fresh dataSet from the url
getButton.addEventListener('click', () => {
   // clear the tree
   const tree = document.getElementById('tree')
   const DBServiceURL = url.value
   treeView.innerHTML = ''
   const thisDB = new DbClient(DBServiceURL, "KV")

   // Initialize our KvRPC SSE client
   thisDB.init().then((_result) => {
      const fetchStart = performance.now()
      //thisDB.clearAll().then(() => {
         thisDB.fetchQuerySet().then((data: any) => {
            rawData = data
            console.log(`RPC fetch from url: ${url.value} took ${(performance.now() - fetchStart).toFixed(1)}ms`)
            //console.log('rawData ', JSON.stringify(rawData))
            const treeObjects = createTreeObjects(rawData)
            //console.log('treeObjects ', JSON.stringify(treeObjects))
            const treeNodes = TreeBuilder.create(treeObjects.kv);
            //console.log(treeNodes)
            TreeView.render(treeNodes, tree);
         })
      //})
   })
})