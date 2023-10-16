
let tree = null

/**
 * Build a set of treeNode objects
 * @param {*} nodes 
 * @returns an object tree
 */
export function getTreeObj(nodes) {
   const to = { kv: {} }
   for (let index = 0; index < nodes.length; index++) {
      processNode(to, nodes[index])
   }
   console.info(to)
   return to;
}

/**
 * Process a multipart Key to a treeNode object 
 * with a maximum key-part-depth of 6
 * @param to - an object to add this element to
 * @param node - the node to be processed -- a tuple of [k,v]
 */
function processNode(to, node) {

   const k = node[0]  // an array of keyParts
   const v = node[1]  // any valid kvValue
   const length = k.length // the length of the multipart key array

   if (length > 0) {
      to.kv[`${k[0]}`] = (to.kv[`${k[0]}`])
         ? to.kv[`${k[0]}`] 
         : (length === 1) ? v : {}
   }

   if (length > 1) {
      to.kv[`${k[0]}`][`${k[1]}`] = (to.kv[`${k[0]}`][`${k[1]}`])
         ? to.kv[`${k[0]}`][`${k[1]}`] 
         : (length === 2) ? v : {}
   }

   if (length > 2) {
      to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`] = 
         (to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`])
            ? to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`] 
            : (length === 3) ? v : {}
   }

   if (length > 3) {
      to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`][`${k[3]}`] = 
         (to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`][`${k[3]}`])
            ? to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`][`${k[3]}`] 
            : (length === 4) ? v : {}
   }
   
   if (length > 4) {
      to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`][`${k[3]}`][`${k[4]}`] = 
         (to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`][`${k[3]}`][`${k[4]}`])
            ? to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`][`${k[3]}`][`${k[4]}`] 
            : (length === 5) ? v : {}
   }
      
   if (length > 5) {
      to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`][`${k[3]}`][`${k[4]}`][`${k[5]}`] = 
         (to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`][`${k[3]}`][`${k[4]}`][`${k[5]}`])
            ? to.kv[`${k[0]}`][`${k[1]}`][`${k[2]}`][`${k[3]}`][`${k[4]}`][`${k[5]}`] 
            : (length === 6) ? v : {}
   }

}
