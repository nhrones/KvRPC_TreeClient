// deno-lint-ignore-file
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/treeView/builder.ts
function create(kvData) {
  const rootNode = createNode({
    value: kvData,
    key: "Key-Prefix",
    type: getDataType(kvData)
  });
  createSubnode(kvData, rootNode);
  return rootNode;
}
__name(create, "create");
function createNode(opt = {}) {
  let value = opt["value"] ?? null;
  if (isEmptyObject(value))
    value = "{ }";
  if (opt.type === "string")
    value = `"${value}"`;
  return {
    key: opt.key || null,
    parent: opt.parent || null,
    value,
    isExpanded: opt.isExpanded || false,
    type: opt.type || null,
    children: opt.children || [],
    //el: opt.el || null,
    depth: opt.depth || 0,
    dispose: null
  };
}
__name(createNode, "createNode");
function createSubnode(data, node2) {
  if (typeof data === "object") {
    for (const key in data) {
      const child = createNode({
        value: data[key],
        key,
        depth: node2.depth + 1,
        type: getDataType(data[key]),
        parent: node2
      });
      node2.children.push(child);
      createSubnode(data[key], child);
    }
  }
}
__name(createSubnode, "createSubnode");
function getDataType(value) {
  if (Array.isArray(value))
    return "array";
  if (value === null)
    return "null";
  return typeof value;
}
__name(getDataType, "getDataType");
var isEmptyObject = /* @__PURE__ */ __name((value) => {
  return getDataType(value) === "object" && Object.keys(value).length === 0;
}, "isEmptyObject");

// src/treeView/templates.ts
function collapsedTemplate(params = {}) {
  const { key, value, type } = params;
  return `
     <div class="line">
       <div class="empty-icon"></div>
       <div class="json-key">${key}</div>
       <div class="json-separator">:</div>
       <div class="json-value json-${type}">${value}</div>
     </div>
   `;
}
__name(collapsedTemplate, "collapsedTemplate");
function expandedTemplate(params = {}) {
  const { key, size } = params;
  return `
     <div class="line">
       <div class="caret-icon"><i class="fas fa-caret-right"></i></div>
       <div class="json-key">${key}</div>
       <div class="json-size">${size}</div>
     </div>
   `;
}
__name(expandedTemplate, "expandedTemplate");
var Classes = {
  HIDDEN: "hidden",
  CARET_ICON: "caret-icon",
  CARET_RIGHT: "fa-caret-right",
  CARET_DOWN: "fa-caret-down",
  ICON: "fas"
};

// src/treeView/renderer.ts
var root = "";
function render(tree, targetElement) {
  const containerEl = document.createElement("div");
  containerEl.className = "elem-container";
  traverse(tree, function(node2) {
    node2.el = createNodeElement(node2);
    containerEl.appendChild(node2.el);
  });
  targetElement.appendChild(containerEl);
  toggleNode(root);
}
__name(render, "render");
function hideNodeChildren(node2) {
  node2.children.forEach((child) => {
    child.el.classList.add(Classes.HIDDEN);
    if (child.isExpanded) {
      hideNodeChildren(child);
    }
  });
}
__name(hideNodeChildren, "hideNodeChildren");
function showNodeChildren(node2) {
  node2.children.forEach((child) => {
    child.el.classList.remove(Classes.HIDDEN);
    if (child.isExpanded) {
      showNodeChildren(child);
    }
  });
}
__name(showNodeChildren, "showNodeChildren");
function setCaretIconDown(node2) {
  if (node2.children.length > 0) {
    const icon = node2.el.querySelector("." + Classes.ICON);
    if (icon) {
      icon.classList.replace(Classes.CARET_RIGHT, Classes.CARET_DOWN);
    }
  }
}
__name(setCaretIconDown, "setCaretIconDown");
function setCaretIconRight(node2) {
  if (node2.children.length > 0) {
    const icon = node2.el.querySelector("." + Classes.ICON);
    if (icon) {
      icon.classList.replace(Classes.CARET_DOWN, Classes.CARET_RIGHT);
    }
  }
}
__name(setCaretIconRight, "setCaretIconRight");
function createNodeElement(node2) {
  if (node2.parent === null)
    root = node2;
  const el = document.createElement("div");
  if (node2.children.length > 0) {
    el.innerHTML = expandedTemplate({
      key: node2.key,
      value: node2.value,
      size: getSizeString(node2)
    });
    const caretEl = el.querySelector("." + Classes.CARET_ICON);
    caretEl.addEventListener("click", () => toggleNode(node2));
    node2.dispose = caretEl.removeEventListener("click", () => toggleNode(node2));
  } else {
    el.innerHTML = collapsedTemplate({
      key: node2.key,
      value: node2.value,
      type: node2.value === "{}" ? "object" : typeof node2.value
    });
  }
  const keyEl = el.querySelector(".json-key");
  keyEl.addEventListener("click", () => {
    if (node2.value.raw) {
      document.getElementById("fullkey").textContent = JSON.stringify(rawData[node2.value.raw][0]);
    } else {
      document.getElementById("fullkey").textContent = "";
    }
  });
  const lineEl = el.children[0];
  if (node2.parent !== null) {
    lineEl.classList.add(Classes.HIDDEN);
  }
  lineEl.style = "margin-left: " + node2.depth * 18 + "px;";
  return lineEl;
}
__name(createNodeElement, "createNodeElement");
var getSizeString = /* @__PURE__ */ __name((node2) => {
  const len = node2.children.length;
  if (node2.type === "array")
    return `[${len}]`;
  if (node2.type === "object")
    return `{${len}}`;
  return null;
}, "getSizeString");
function toggleNode(node2) {
  if (node2.isExpanded) {
    node2.isExpanded = false;
    setCaretIconRight(node2);
    hideNodeChildren(node2);
  } else {
    node2.isExpanded = true;
    setCaretIconDown(node2);
    showNodeChildren(node2);
  }
}
__name(toggleNode, "toggleNode");
function traverse(node2, callback) {
  callback(node2);
  if (node2.children.length > 0) {
    node2.children.forEach((child) => {
      traverse(child, callback);
    });
  }
}
__name(traverse, "traverse");

// src/treeView/treeNodes.ts
function createTreeObjects(nodes) {
  const t = { kv: {} };
  for (let i = 0; i < nodes.length; i++) {
    processNode(t, i, nodes[i]);
  }
  return t;
}
__name(createTreeObjects, "createTreeObjects");
function processNode(t, _i, node2) {
  const k = node2[0];
  const v = node2[1];
  const keyLength = k.length;
  const k0 = `${k[0]}`;
  const k1 = `${k[1]}`;
  const k2 = `${k[2]}`;
  const k3 = `${k[3]}`;
  const k4 = `${k[4]}`;
  const k5 = `${k[5]}`;
  if (keyLength > 0) {
    t.kv[k0] = t.kv[k0] ? t.kv[k0] : keyLength === 1 ? v : {};
  }
  if (keyLength > 1) {
    t.kv[k0][k1] = t.kv[k0][k1] ? t.kv[k0][k1] : keyLength === 2 ? v : {};
  }
  if (keyLength > 2) {
    t.kv[k0][k1][k2] = t.kv[k0][k1][k2] ? t.kv[k0][k1][k2] : keyLength === 3 ? v : {};
  }
  if (keyLength > 3) {
    t.kv[k0][k1][k2][k3] = t.kv[k0][k1][k2][k3] ? t.kv[k0][k1][k2][k3] : keyLength === 4 ? v : {};
  }
  if (keyLength > 4) {
    t.kv[k0][k1][k2][k3][k4] = t.kv[k0][k1][k2][k3][k4] ? t.kv[k0][k1][k2][k3][k4] : keyLength === 5 ? v : {};
  }
  if (keyLength > 5) {
    t.kv[k0][k1][k2][k3][k4][k5] = t.kv[k0][k1][k2][k3][k4][k5] ? t.kv[k0][k1][k2][k3][k4][k5] : keyLength === 6 ? v : {};
  }
}
__name(processNode, "processNode");

// https://raw.githubusercontent.com/nhrones/BuenoRPC-Client/main/context.ts
var CTX = {
  DEBUG: false,
  DBServiceURL: "",
  registrationURL: "",
  requestURL: ""
};

// https://raw.githubusercontent.com/nhrones/BuenoRPC-Client/main/dbClient.ts
var { DBServiceURL, DEBUG, registrationURL, requestURL } = CTX;
var nextTxID = 0;
var transactions = /* @__PURE__ */ new Map();
var DbClient = class {
  /**
   * Creates a new DBClient instance
   * @param serviceURL - the url for the RPC service
   * @param serviceType - the type of service to register for
   */
  constructor(serviceURL, serviceType, client = "unknown") {
    this.querySet = [];
    DBServiceURL = serviceURL.endsWith("/") ? serviceURL : serviceURL += "/";
    switch (serviceType) {
      case "IO":
        registrationURL = DBServiceURL + `SSERPC/ioRegistration?client=${client}`, requestURL = DBServiceURL + "SSERPC/ioRequest";
        break;
      case "KV":
        registrationURL = DBServiceURL + `SSERPC/kvRegistration?client=${client}`, requestURL = DBServiceURL + "SSERPC/kvRequest";
        break;
      case "RELAY":
        registrationURL = DBServiceURL + `SSERPC/relayRegistration?client=${client}`, requestURL = DBServiceURL + "SSERPC/relayRequest";
        break;
      default:
        break;
    }
  }
  /** 
   * initialize our EventSource and fetch initial data 
   * */
  init() {
    return new Promise((resolve, reject) => {
      let connectAttemps = 0;
      console.log("CONNECTING");
      const eventSource = new EventSource(registrationURL);
      eventSource.onopen = () => {
        console.log("CONNECTED");
        resolve();
      };
      eventSource.onerror = (_e) => {
        switch (eventSource.readyState) {
          case EventSource.OPEN:
            console.log("CONNECTED");
            break;
          case EventSource.CONNECTING:
            console.log("CONNECTING");
            connectAttemps++;
            if (connectAttemps > 1) {
              eventSource.close();
              alert(`No Service!
Please start the DBservice!
See: readme.md.`);
            }
            console.log(`URL: ${window.location.href}`);
            break;
          case EventSource.CLOSED:
            console.log("DISCONNECTED");
            reject();
            break;
        }
      };
      eventSource.onmessage = (evt) => {
        if (DEBUG)
          console.info("events.onmessage - ", evt.data);
        const parsed = JSON.parse(evt.data);
        const { txID, error, result } = parsed;
        if (!transactions.has(txID))
          return;
        const transaction = transactions.get(txID);
        transactions.delete(txID);
        if (transaction)
          transaction(error, result);
      };
    });
  }
  /**
   * fetch a querySet      
   */
  fetchQuerySet() {
    return new Promise((resolve, _reject) => {
      rpcRequest("GETALL", {}).then((result) => {
        if (typeof result === "string") {
          resolve(JSON.parse(result));
        } else {
          console.log("Ooopppps: ", typeof result);
        }
      });
    });
  }
  /**
   * get row from key
   */
  get(key) {
    for (let index = 0; index < this.querySet.length; index++) {
      const element = this.querySet[index];
      if (element.id === key)
        return element;
    }
  }
  /** 
   * The `set` method mutates - will call the `persist` method. 
   */
  set(key, value) {
    console.log(`set call key = `, key);
    try {
      rpcRequest(
        "SET",
        {
          key,
          value,
          //@ts-ignore ?
          currentPage: this.currentPage,
          //@ts-ignore ?
          rowsPerPage: this.rowsPerPage
        }
      ).then((result) => {
        console.info("SET call returned ", result.querySet);
        this.querySet = result.querySet;
        return this.querySet;
      });
    } catch (e) {
      return { Error: e };
    }
  }
  /** 
   * The `delete` method mutates - will call the `persist` method. 
   */
  delete(key) {
    try {
      rpcRequest("DELETE", { key }).then((result) => {
        this.querySet = result.querySet;
        this.totalPages = result.totalPages;
        return this.querySet;
      });
    } catch (_e) {
      return { Error: _e };
    }
  }
  /** 
   * The `clearAll` method removes all records from the DB. 
   */
  async clearAll() {
    try {
      await rpcRequest("CLEARALL", { key: [""] });
    } catch (_e) {
      return { Error: _e };
    }
  }
};
__name(DbClient, "DbClient");
var rpcRequest = /* @__PURE__ */ __name((procedure, params) => {
  const thisID = nextTxID++;
  return new Promise((resolve, reject) => {
    transactions.set(thisID, (error, result) => {
      if (error)
        return reject(new Error(error));
      resolve(result);
    });
    fetch(requestURL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ txID: thisID, procedure, params })
    });
  });
}, "rpcRequest");

// src/main.ts
var urls = document.getElementById("urls");
var url = document.getElementById("url");
var rawData = "";
var getButton = document.getElementById("getbtn");
var treeView = document.getElementById("tree");
urls.addEventListener("change", () => {
  url.value = urls.value;
  treeView.innerHTML = "";
});
getButton.addEventListener("click", () => {
  const tree = document.getElementById("tree");
  const DBServiceURL2 = url.value;
  treeView.innerHTML = "";
  const thisDB = new DbClient(DBServiceURL2, "KV", "treeView");
  thisDB.init().then((_result) => {
    const fetchStart = performance.now();
    thisDB.fetchQuerySet().then((data) => {
      rawData = data;
      console.log(`RPC fetch from url: ${url.value} took ${(performance.now() - fetchStart).toFixed(1)}ms`);
      const treeObjects = createTreeObjects(rawData);
      const treeNodes = create(treeObjects.kv);
      render(treeNodes, tree);
    });
  });
});
export {
  rawData
};
