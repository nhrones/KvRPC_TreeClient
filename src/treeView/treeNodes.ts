// deno-lint-ignore-file no-explicit-any

/**
 * Build a set of treeNode objects
 * @param {*} nodes 
 * @returns an object tree
 */
export function createTreeObjects(nodes: any) {
   const t = { kv: {} }
   for (let i = 0; i < nodes.length; i++) {
      processNode(t, i, nodes[i])
   }
   //console.log(t.kv)
   return t;
}

/**
 * Process a multipart Key to a treeNode object 
 * with a maximum key-part-depth of 6
 * @param t - an object to add this element to
 * @param node - the node to be processed -- a tuple of [k,v]
 */
function processNode(t: any, _i: any, node: any) {

   const k = node[0]    // multipart-key-array
   const v = node[1]    // valid kvValue
   const keyLength = k.length // multipart-key-array length
   const k0 = `${k[0]}` // keypart-0
   const k1 = `${k[1]}` // keypart-1
   const k2 = `${k[2]}` // keypart-2
   const k3 = `${k[3]}` // keypart-3
   const k4 = `${k[4]}` // keypart-4
   const k5 = `${k[5]}` // keypart-5

   if (keyLength > 0) {
      t.kv[k0] = (t.kv[k0])
         ? t.kv[k0]
         : (keyLength === 1) ? v : {};
   }

   if (keyLength > 1) { 
      t.kv[k0][k1] = (t.kv[k0][k1])
         ? t.kv[k0][k1] 
         : (keyLength === 2) ? v : {};
   }

   if (keyLength > 2) { 
      t.kv[k0][k1][k2] = (t.kv[k0][k1][k2] )
         ? t.kv[k0][k1][k2] 
         : (keyLength === 3) ? v : {};
   }

   if (keyLength > 3) { 
      t.kv[k0][k1][k2][k3] = (t.kv[k0][k1][k2][k3])
         ? t.kv[k0][k1][k2][k3]
         : (keyLength === 4) ? v : {};
      }
   
   if (keyLength > 4) { 
      t.kv[k0][k1][k2][k3][k4] = (t.kv[k0][k1][k2][k3][k4])
         ? t.kv[k0][k1][k2][k3][k4] 
         : (keyLength === 5) ? v : {};
   }
      
   if (keyLength > 5) { 
      t.kv[k0][k1][k2][k3][k4][k5] = (t.kv[k0][k1][k2][k3][k4][k5])
         ? t.kv[k0][k1][k2][k3][k4][k5]
         : (keyLength === 6) ? v : {};       
   }
}
