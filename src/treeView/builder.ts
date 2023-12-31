// deno-lint-ignore-file no-explicit-any

/**
 * Create the Tree object with children
 * @param {object | string} kvData 
 * @return {object} a root node object with children
 */
export function create(kvData:object | string) {
   const rootNode = createNode({
      value: kvData,
      key: 'Key-Prefix',
      type: getDataType(kvData)
   });
   createSubnode(kvData, rootNode);
   return rootNode;
}

/**
 * Create node object
 * @param {object} opt options
 * @return {object} a tree object
 */
function createNode(opt: any = {}) {
   //@ts-ignore ?
   let value = opt['value'] ?? null;
   if (isEmptyObject(value)) value = "{ }"; 
   //console.info(`createNode type: ${opt.type} value: ${value} depth: ${opt.depth} fullKey ${opt.fullKey}`)
   
   if (opt.type === 'string') value = `"${value}"`
   return {
      key: opt.key || null,
      parent: opt.parent || null,
      value: value,
      isExpanded: opt.isExpanded || false,
      type: opt.type || null,
      children: opt.children || [],
      //el: opt.el || null,
      depth: opt.depth || 0,
      dispose: null
   }
}

/**
 * Create subnode for a node (recursive)
 * @param {object} data
 * @param {object} node
 */
function createSubnode(data: any, node: any) {
   if (typeof data === 'object') {
      for (const key in data) {
         const child = createNode({
            value: data[key],
            key: key,
            depth: node.depth + 1,
            type: getDataType(data[key]),
            parent: node,
         });
         // recurse
         node.children.push(child);
         createSubnode(data[key], child);
      }
   }
}

/** 
 * Get the data-type of the value 
 */
function getDataType(value: any) {
   if (Array.isArray(value)) return 'array';
   if (value === null) return 'null';
   return typeof value;
 }
 
 /** 
  * tests for an empty object 
  */
 const isEmptyObject = (value: any) => {
   return (
      getDataType(value) === 'object' &&
      Object.keys(value).length === 0
   )
}
