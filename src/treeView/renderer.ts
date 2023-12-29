// deno-lint-ignore-file no-explicit-any
import { rawData } from "../main.ts";
import { Classes, collapsedTemplate, expandedTemplate } from './templates.ts'

let root = ''
/**
 * Render the tree into DOM container
 * @param {object} tree
 * @param {htmlElement} targetElement
 */
export function render(tree: any, targetElement: any) {
   const containerEl = document.createElement('div');
   containerEl.className = 'elem-container';

   traverse(tree, function (node: any) {
      node.el = createNodeElement(node);
      containerEl.appendChild(node.el);
   });

   targetElement.appendChild(containerEl);
   // expand root node
   toggleNode(root)
}

function hideNodeChildren(node: any) {
   node.children.forEach((child: any) => {
      child.el.classList.add(Classes.HIDDEN);
      if (child.isExpanded) {
         hideNodeChildren(child);
      }
   });
}

function showNodeChildren(node: any) {
   node.children.forEach((child: any) => {
      child.el.classList.remove(Classes.HIDDEN);
      if (child.isExpanded) {
         showNodeChildren(child);
      }
   });
}

function setCaretIconDown(node: any) {
   if (node.children.length > 0) {
      const icon = node.el.querySelector('.' + Classes.ICON);
      if (icon) {
         icon.classList.replace(Classes.CARET_RIGHT, Classes.CARET_DOWN);
      }
   }
}

function setCaretIconRight(node: any) {
   if (node.children.length > 0) {
      const icon = node.el.querySelector('.' + Classes.ICON);
      if (icon) {
         icon.classList.replace(Classes.CARET_DOWN, Classes.CARET_RIGHT);
      }
   }
}

/**
 * Create node html element
 * @param {object} node 
 * @return html element
 */
function createNodeElement(node: any) {

   if (node.parent === null)  root = node;

   const el = document.createElement('div');
   
   if (node.children.length > 0) {
      el.innerHTML = expandedTemplate({
         key: node.key,
         value: node.value,
         size: getSizeString(node),
      })
      const caretEl = el.querySelector('.' + Classes.CARET_ICON) as HTMLElement;
      caretEl.addEventListener('click', () => toggleNode(node));
      node.dispose = caretEl.removeEventListener('click', () => toggleNode(node));

   } else { 
      el.innerHTML = collapsedTemplate({
         key: node.key,
         value: node.value,
         type: (node.value === '{}') 
            ? 'object' 
            : typeof node.value
      })
   }

   const keyEl = el.querySelector('.json-key') as HTMLElement;
   keyEl.addEventListener('click', () => {
      console.info('clicked node ', node)
   });

   const lineEl = el.children[0] as HTMLElement;

   // start the tree collapsed
   if (node.parent !== null) { 
      lineEl.classList.add(Classes.HIDDEN);
   }
  
   //@ts-ignore ?
   lineEl.style = 'margin-left: ' + node.depth * 18 + 'px;';

   return lineEl;
}

const getSizeString = (node: any) => {
   const len = node.children.length;
   if (node.type === 'array') return `[${len}]`;
   if (node.type === 'object') return `{${len}}`;
   return null;
}

// =============================
//            exports 
// =============================

export function toggleNode(node: any) {
   if (node.isExpanded) {
      node.isExpanded = false;
      setCaretIconRight(node);
      hideNodeChildren(node);
   } else {
      node.isExpanded = true;
      setCaretIconDown(node);
      showNodeChildren(node);
   }
}

/**
 * Recursively traverse Tree object
 * @param {Object} node
 * @param {Callback} callback
 */
export function traverse(node: any, callback: any) {
   callback(node);
   if (node.children.length > 0) {
      node.children.forEach((child: any) => {
         traverse(child, callback);
      });
   }
}

export function expand(node: any) {
   traverse(node, function (child: any) {
      child.el.classList.remove(Classes.HIDDEN);
      child.isExpanded = true;
      setCaretIconDown(child);
   });
}

export function collapse(node: any) {
   traverse(node, function (child: any) {
      child.isExpanded = false;
      if (child.depth > node.depth) child.el.classList.add(Classes.HIDDEN);
      setCaretIconRight(child);
   });
}

export function destroy(tree: any) {
   traverse(tree, (node: any) => {
      if (node.dispose) {
         node.dispose();
      }
   })
   //@ts-ignore ?
   tree.el.parentNode.parentNode.removeChild(node);
}
