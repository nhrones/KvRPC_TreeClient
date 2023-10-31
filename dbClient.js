
let LOCAL_DEV = false
//==========================================
//  uncomment below to run a local service
LOCAL_DEV = true
//  otherwise, run the Deno-Deploy service
//==========================================

let nextMsgID = 0;
let DBServiceURL = ''
const transactions = new Map();

/**
 * This db client communicates with an RPC service.    
 */
export class DbClient {

   querySet = []

   constructor(serviceURL) {
      //fix url ending
      DBServiceURL = (serviceURL.endsWith('/'))
      ? serviceURL
      : serviceURL += '/';
   }
   /** initialize our EventSource and fetch some data */
   async init() {
      return new Promise((resolve, reject) => {
         let connectAttemps = 0
         //console.log("CONNECTING");
         
         const eventSource = new EventSource(DBServiceURL + "SSERPC/sseRegistration");

         eventSource.addEventListener("open", () => {
            console.log("CONNECTED");
            resolve()
         });

         eventSource.addEventListener("error", (_e) => {
            switch (eventSource.readyState) {
               case EventSource.OPEN:
                  console.log("CONNECTED");
                  break;
               case EventSource.CONNECTING:
                  console.log("CONNECTING");
                  connectAttemps++
                  if (connectAttemps > 1) {
                     eventSource.close()
                     alert(`No Service!
Please start the DBservice!
See: readme.md.`)
                  }
                  console.log(`URL: ${window.location.href}`)
                  break;
               case EventSource.CLOSED:
                  console.log("DISCONNECTED");
                  reject()
                  break;
            }
         });

         /* 
         When we get a message from the service we expect 
         an object containing {msgID, error, and result}.
         We then find the transaction that was registered for this msgID, 
         and execute it with the error and result properities.
         This will resolve or reject the promise that was
         returned to the client when the transaction was created.
         */
         eventSource.addEventListener("message", (evt) => {
            const parsed = JSON.parse(evt.data);
            const { txID, error, result } = parsed;         // unpack
            if (!transactions.has(txID)) return             // check        
            const transaction = transactions.get(txID)      // fetch
            transactions.delete(txID)                       // clean up
            if (transaction) transaction(error, result)     // execute
         })
      })
   }

   /**
    * fetch a querySet      
    */
   async fetchQuerySet() {
      return new Promise((resolve, reject) => {
      Call("GETALL", {})
         .then((result) => {
            if (typeof result === "string") {
               resolve (JSON.parse(result))
            } else {
               console.log('Ooopppps: ', typeof result)
            }
         })
      })
   }

   /**
    * get row from key
    */
   get(key) {
      for (let index = 0; index < this.querySet.length; index++) {
         const element = this.querySet[index];
         if (element.id === key) return element
      }

   }

   /** 
    * The `set` method mutates - will call the `persist` method. 
    */
   set(key, value) {
      console.log(`set call key = `, key)
      try {
         // persist single record to the service
         Call("SET",
            {
               key: key,
               value: value,
               currentPage: this.currentPage,
               rowsPerPage: this.rowsPerPage
            })
            .then((result) => {
               console.info('SET call returned ', result.querySet)
               this.querySet = result.querySet
               return this.querySet
            })
      } catch (e) {
         return { Error: e }
      }
   }

   /** 
    * The `delete` method mutates - will call the `persist` method. 
    */
   delete(key) {
      try {
         Call("DELETE", { key: key })
            .then((result) => {
               this.querySet = result.querySet
               this.totalPages = result.totalPages
               return this.querySet
            })
      } catch (_e) {
         return { Error: _e }
      }
   }

} // End class

/** 
 * Make an Asynchronous Remote Proceedure Call
 *  
 * @param {key extends keyof TypedProcedures} procedure - the name of the remote procedure to be called
 * @param {TypedProcedures[key]} params - appropriately typed parameters for this procedure
 * 
 * @returns {Promise} - Promise object has a transaction that is stored by ID    
 *   in a transactions Set.   
 *   When this promise resolves or rejects, the transaction is retrieved by ID    
 *   and executed by the promise. 
 */
export const Call = (procedure, params) => {

   const txID = nextMsgID++;

   //console.log(`RPC msg ${txID} called ${procedure} with ${JSON.stringify(params)}`);

   return new Promise((resolve, reject) => {
      transactions.set(txID, (error, result) => {
         if (error)
            return reject(new Error(error));
         resolve(result);
      });
      fetch(DBServiceURL+'SSERPC/rpcRequests', {
         method: "POST",
         mode: 'cors',
         body: JSON.stringify({ txID, procedure, params })
      });
   });
};
