import { rawData } from "../main.js";
import { Classes, collapsedTemplate, expandedTemplate } from './templates.js'

let root = ''
/**
 * Render the tree into DOM container
 * @param {object} tree
 * @param {htmlElement} targetElement
 */
export function render(tree, targetElement) {
   const containerEl = document.createElement('div');
   containerEl.className = 'elem-container';

   traverse(tree, function (node) {
      node.el = createNodeElement(node);
      containerEl.appendChild(node.el);
   });

   targetElement.appendChild(containerEl);
   // expand root node
   toggleNode(root)
}

function hideNodeChildren(node) {
   node.children.forEach((child) => {
      child.el.classList.add(Classes.HIDDEN);
      if (child.isExpanded) {
         hideNodeChildren(child);
      }
   });
}

function showNodeChildren(node) {
   node.children.forEach((child) => {
      child.el.classList.remove(Classes.HIDDEN);
      if (child.isExpanded) {
         showNodeChildren(child);
      }
   });
}

function setCaretIconDown(node) {
   if (node.children.length > 0) {
      const icon = node.el.querySelector('.' + Classes.ICON);
      if (icon) {
         icon.classList.replace(Classes.CARET_RIGHT, Classes.CARET_DOWN);
      }
   }
}

function setCaretIconRight(node) {
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
function createNodeElement(node) {

   if (node.parent === null)  root = node;

   const el = document.createElement('div');
   
   if (node.children.length > 0) {
      el.innerHTML = expandedTemplate({
         key: node.key,
         value: node.value,
         size: getSizeString(node),
      })
      const caretEl = el.querySelector('.' + Classes.CARET_ICON);
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

   const keyEl = el.querySelector('.json-key');
   keyEl.addEventListener('click', (evt) => {
      //console.info('clicked node ', node)
      if(node.value.raw) {
         document.getElementById('fullkey')
            .textContent = JSON.stringify(rawData[node.value.raw][0]);
      } else {
         document.getElementById('fullkey') .textContent = ""
      }

   });

   const lineEl = el.children[0];

   // start the tree collapsed
   if (node.parent !== null) { 
      lineEl.classList.add(Classes.HIDDEN);
   }
  

   lineEl.style = 'margin-left: ' + node.depth * 18 + 'px;';

   return lineEl;
}

const getSizeString = (node) => {
   const len = node.children.length;
   if (node.type === 'array') return `[${len}]`;
   if (node.type === 'object') return `{${len}}`;
   return null;
}

// =============================
//            exports 
// =============================

export function toggleNode(node) {
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
export function traverse(node, callback) {
   callback(node);
   if (node.children.length > 0) {
      node.children.forEach((child) => {
         traverse(child, callback);
      });
   }
}

export function expand(node) {
   traverse(node, function (child) {
      child.el.classList.remove(Classes.HIDDEN);
      child.isExpanded = true;
      setCaretIconDown(child);
   });
}

export function collapse(node) {
   traverse(node, function (child) {
      child.isExpanded = false;
      if (child.depth > node.depth) child.el.classList.add(Classes.HIDDEN);
      setCaretIconRight(child);
   });
}

export function destroy(tree) {
   traverse(tree, (node) => {
      if (node.dispose) {
         node.dispose();
      }
   })
   tree.el.parentNode.parentNode.removeChild(node);
}
