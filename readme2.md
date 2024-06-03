## 實作： NPM init 建立 package.json 檔案

- 安裝流程

1. 建立專案資料夾

2. 建立 `server.js` 檔案
```sh
console.log('test');
```

3. 建立 `package.json` 檔案
- 在 指令模式下輸入 `npm init`

---

## 實作：透過 createServer 開啟伺服器

4. 修改程式碼 `server.js` 

```sh
const http = require('http');

const requestListener = (req, res) => {
    console.log(req.url);
    console.log(req.method);

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write('Hello World\n');
    res.end();
};

const server = http.createServer(requestListener);
server.listen(3005, '127.0.0.1');
```

- 執行程式

```sh
nodemon server.js
```

---

##  知識：了解 request 物件裡面有什麼資訊
```
網址: http://127.0.0.1:3005/ 
req.url:  /
req.metod:  GET

網址: http://127.0.0.1:3005/todo
req.url:   /todo
req.metod:  GET
``` 

---

## 知識: [網頁狀態碼](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status)

HTTP 回應狀態碼表示特定的 [HTTP](https://developer.mozilla.org/zh-TW/docs/Web/HTTP) 請求是否已成功完成。回應分為五類：

- [資訊回應](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status#%E8%B3%87%E8%A8%8A%E5%9B%9E%E6%87%89)（100——199）
- [成功回應](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status#%E6%88%90%E5%8A%9F%E5%9B%9E%E6%87%89)（200——299）
- [重新導向訊息](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status#%E9%87%8D%E6%96%B0%E5%B0%8E%E5%90%91%E8%A8%8A%E6%81%AF)（300——399）
- [用戶端錯誤回應](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status#%E7%94%A8%E6%88%B6%E7%AB%AF%E9%8C%AF%E8%AA%A4%E5%9B%9E%E6%87%89)（400——499）
- [伺服器錯誤回應](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status#%E7%94%A8%E6%88%B6%E7%AB%AF%E9%8C%AF%E8%AA%A4%E5%9B%9E%E6%87%89)（500——599）
以下的狀態碼由 [RFC 9110](https://httpwg.org/specs/rfc9110.html#overview.of.status.codes) 定義。

---

## 實作：新增首頁測試網址與 404 頁面

- 修改程式碼 `server.js` 

```sh
const http = require('http');

const requestListener = (req, res) => {
    const headers = {
        'Content-Type': 'text/plain'
    }

    console.log(req.url);
    console.log(req.method);

    if (req.url == '/' && req.method == 'GET') {
        res.writeHead(200, headers);
        res.write('index');
        res.end();
    } else if (req.url == '/' && req.method == 'DELETE') {
        res.writeHead(200, headers);
        res.write('刪除成功');
        res.end();
    } else {
        res.writeHead(200, headers);
        res.write('not found 404');
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(3005, '127.0.0.1');
```

---

## 實作：調整 headers 表頭資訊，設置回傳 JSON 與 cors 資訊

- 修改程式碼 `server.js` 

```sh
const http = require('http');

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }

    if (req.url == '/' && req.method == 'GET') {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": [],
        }));
        res.end();
    } else if (req.url == '/' && req.method == 'DELETE') {
        res.writeHead(200, headers);
        res.write('刪除成功');
        res.end();
    } else {
        res.writeHead(200, headers);
        res.write('not found 404');
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(3005, '127.0.0.1');
```

---

## 知識：preflight options API 檢查機制
- [MDN：跨來源資源共用（CORS）](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS)

---

## 實作：設定 options API

- 修改程式碼 `server.js` 

```sh
const http = require('http');

const requestListener = (req, res)=>{
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    if (req.url=="/" && req.method == "GET"){
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": [],
        }));
        res.end();
    } else if(req.method == "OPTIONS"){
        res.writeHead(200,headers);
        res.end();
    } else{
        res.writeHead(404,headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }
}

const server = http.createServer(requestListener);
server.listen(3005);
```

---

## 知識： API 介紹

- RESTfulAPI 列表

|  METHOD |    ACTION      | URL                     |
| ------- | -------------- |-----------------------  |
| GET     | 取得所有代辦事項 | {{url}}/todo           |
| POST    | 新增代辦事項     | {{url}}/todos          |
| PATCH   | 編輯指定代辦事項 | {{url}}/todos/{{uuid}} |
| DELETE  | 刪除所有代辦事項 | {{url}}/todos/todos    |
| DELETE  | 刪除指定代辦事項 | {{url}}/todos/{{uuid}} |
  
---

## 實作：取得所有代辦、增加 UUID NPM

- 修改程式碼 `server.js` 

```sh
const http = require('http');
const {v4: uuidv4} = require('uuid');

const todos = [
    {
        "title": "今天要刷牙",
        "id": uuidv4(),
    },{
        "title": "今天要洗臉",
        "id": uuidv4(),
    }
];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    if (req.url == "/todos" && req.method == "GET") {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else if (req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }

}

const server = http.createServer(requestListener);
server.listen(3005);
```

---

## 實作：POST API router 環境建立

- 修改程式碼 `server.js` 

```sh
const http = require('http');
const {v4: uuidv4} = require('uuid');

const todos = [
    {
        "title": "今天要刷牙",
        "id": uuidv4(),
    },{
        "title": "今天要洗臉",
        "id": uuidv4(),
    }
];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    if (req.url == "/todos" && req.method == "GET") {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else if (req.url == "/todos" && req.method == "POST") {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": '1234',
        }));
        res.end();
    } else if (req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }

}

const server = http.createServer(requestListener);
server.listen(3005);
```

---

## 知識：POSTMAN 管理 API 列表

- RESTfulAPI 列表

|  METHOD |    ACTION      | URL                     |
| ------- | -------------- |-----------------------  |
| GET     | 取得所有代辦事項 | {{url}}/todo           |
| POST    | 新增代辦事項     | {{url}}/todos          |
| PATCH   | 編輯指定代辦事項 | {{url}}/todos/{{uuid}} |
| DELETE  | 刪除所有代辦事項 | {{url}}/todos/todos    |
| DELETE  | 刪除指定代辦事項 | {{url}}/todos/{{uuid}} |

---

## 知識：如何接收 POST API 的 body 資料？

- [Node.js 官網接收 buffer 教學](https://nodejs.org/api/stream.html#api-for-stream-consumers)
- [Node.js 開發者社群 - 各種原生與套件，接收 req.body 的方式](https://nodejs.dev/learn/get-http-request-body-data-using-nodejs)
- [TCP/IP Buffer 傳送示意圖](https://cacoo.com/diagrams/gSXxTWt8ystUlfIi/C5209)


- 在程式碼內加入下段
 
```sh
 // Readable streams emit 'data' events once a listener is added.
  req.on('data', (chunk) => {
    body += chunk;
  });

  // The 'end' event indicates that the entire body has been received.
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // Write back something interesting to the user:
      res.write(typeof data);
      res.end();
    } catch (er) {
      // uh oh! bad json!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
```

- 完整程式碼

```sh
const http = require('http');
const {v4: uuidv4} = require('uuid');

const todos = [
    {
        "title": "今天要刷牙",
        "id": uuidv4(),
    },{
        "title": "今天要洗臉",
        "id": uuidv4(),
    }
];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }

    let body = "";
    let num = 0;
    req.on('data', chunk =>{
        console.log(chunk);
        body += chunk;
        // num+=1;
        // console.log(num);
    })

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            // Write back something interesting to the user:
            res.write(typeof data);
            res.end();
        } catch (er) {
            // uh oh! bad json!
            res.statusCode = 400;
            return res.end(`error: ${er.message}`);
        }
    })

    if (req.url == "/todos" && req.method == "GET") {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else if (req.url == "/todos" && req.method == "POST") {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": '1234',
        }));
        res.end();
    } else if (req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }

}

const server = http.createServer(requestListener);
server.listen(3005);
```

---

## 實作：新增 todo POST API

- 在 `req.url == "/todos" && req.method == "POST"` 加入此段程式碼

```sh
// 2. 透過 req.on('end') 觸發
req.on('end', () => {
    try {
        const title = JSON.parse(body).title;
        const todo = {
            "title": title,
            "id": uuidv4()
        }
        todos.push(todo);
        console.log(todo);

        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } catch (er) {
        // uh oh! bad json!
        res.statusCode = 400;
        return res.end(`error: ${er.message}`);
    }
})
```

- 完整程式碼

```sh
const http = require('http');
const {v4: uuidv4} = require('uuid');

const todos = [
    {
        "title": "今天要刷牙",
        "id": uuidv4(),
    },{
        "title": "今天要洗臉",
        "id": uuidv4(),
    }
];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }

    let body = "";
    let num = 0;
    // 1. 等待 req.body 接收
    req.on('data', chunk =>{
        console.log(chunk);
        body += chunk;
        // num+=1;
        // console.log(num);
    })

    if (req.url == "/todos" && req.method == "GET") {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else if (req.url == "/todos" && req.method == "POST") {
        // 2. 透過 req.on('end') 觸發
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                const todo = {
                    "title": title,
                    "id": uuidv4()
                }
                todos.push(todo);
                console.log(todo);

                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    "status": "success",
                    "data": todos,
                }));
                res.end();
            } catch (er) {
                // uh oh! bad json!
                res.statusCode = 400;
                return res.end(`error: ${er.message}`);
            }
        })

    } else if (req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }

}

const server = http.createServer(requestListener);
server.listen(3005);
```

---

## 實作：新增 POST API 異常行為

```sh
try {
    const title = JSON.parse(body).title;
    const todo = {
        "title": title,
        "id": uuidv4()
    }
    todos.push(todo);
    res.writeHead(200, headers);
    res.write(JSON.stringify({
        "status": "success",
        "data": todos,
    }));
    res.end();
} catch(error) {
    console.log(error, '程式錯誤');
    res.end();
}
```



```sh
const http = require('http');
const {v4: uuidv4} = require('uuid');

const todos = [
    {
        "title": "今天要刷牙",
        "id": uuidv4(),
    },{
        "title": "今天要洗臉",
        "id": uuidv4(),
    }
];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }

    let body = "";
    let num = 0;
    // 1. 等待 req.body 接收
    req.on('data', chunk =>{
        console.log(chunk);
        body += chunk;
        // num+=1;
        // console.log(num);
    })

    if (req.url == "/todos" && req.method == "GET") {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else if (req.url == "/todos" && req.method == "POST") {
        // 2. 透過 req.on('end') 觸發
        req.on('end', () => {
            const title = JSON.parse(body).title;
            const todo = {
                "title": title,
                "id": uuidv4()
            }
            todos.push(todo);
            console.log(todo);

            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": "success",
                "data": todos,
            }));
            res.end();
        })
    } else if (req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }

}

const server = http.createServer(requestListener);
server.listen(3005);
```

---

## 實作：重構 POST API 異常行為


- 重構 `server.js` 程式碼

```sh
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require('./errorHandle');
const todos = [];

const requestListener = (req, res)=>{
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body = "";
    
    req.on('data', chunk=>{
        body+=chunk;
    })
    
    if(req.url=="/todos" && req.method == "GET"){
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    }else if(req.url=="/todos" && req.method == "POST"){
        req.on('end',()=>{
            try{
                const title = JSON.parse(body).title;
                if(title !== undefined){
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    };
                    todos.push(todo);
                    res.writeHead(200,headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos,
                    }));
                    res.end();
                }else{
                    // 錯誤處理函式
                    errHandle(res);
                }
            } catch(error){
                // 錯誤處理函式
                errHandle(res);
            }
            
        })
    }else if(req.method == "OPTIONS"){
        res.writeHead(200,headers);
        res.end();
    }else{
        res.writeHead(404,headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }
    
}

const server = http.createServer(requestListener);
server.listen(3005);
```

- 新增 `errorHandles.js` 程式碼
  
```sh
function errorHandles(res) {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }

    res.writeHead(400, headers);
    res.write(JSON.stringify({
        "status": "false",
        "message": "欄位未填寫正確，或無此 todo id",
    }));
    res.end();
}

module.exports = errorHandles;
```

---

## 實作：刪除所有代辦 API

- 在 `req.url == "/todos" && req.method == "DELETE"` 加入此段程式碼

```sh
 todos.length = 0; // 刪除陣列全部資料

        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
            "delete": "yes"
        }));
        res.end();
```

- 完整 `server.js` 程式碼

```sh
const http = require('http'); // 使用 node 內建的 http 模組
const {v4: uuidv4} = require('uuid'); // 使用外部的 uuid npm 模組
const errorHandles = require('./errorHandle'); // 自己寫的錯誤處理函式
const todos = [
    {
        "title": "今天要刷牙",
        "id": uuidv4(),
    },{
        "title": "今天要洗臉",
        "id": uuidv4(),
    }
];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }

    let body = "";
    let num = 0;
    // 1. 等待 req.body 接收
    req.on('data', chunk =>{
        console.log(chunk);
        body += chunk;
        // num+=1;
        // console.log(num);
    })

    if (req.url == "/todos" && req.method == "GET") {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else if (req.url == "/todos" && req.method == "POST") {
        // 2. 透過 req.on('end') 觸發
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if (title !== undefined) {
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    }
                    todos.push(todo);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos,
                    }));
                    res.end();
                } else {
                    // 錯誤處理函式
                   errorHandles(res);
                }
            } catch(error) {
                // 錯誤處理函式
                errorHandles(res);
            }
        })
    } else if (req.url == "/todos" && req.method == "DELETE") {
        todos.length = 0; // 刪除陣列全部資料

        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
            "delete": "yes"
        }));
        res.end();
    } else if (req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }
}

const server = http.createServer(requestListener);
server.listen(3005);
```

---

## 知識：陣列與字串處理操作：startsWith、pop、findIndex

- `startsWith` 
  
```sh
- "/todos/12233".startsWith("/todos")   
結果: true 
```

- `pop`

```sh
const id = "/todos/12233".split('/').pop();
結果: id = 12233
```

- `findIndex`

```sh
const ary = [0, 1, 2]
ary.findIndex(element => element == 2)
結果: 2
```

---

## 實作：刪除單筆代辦 API

- 在 `req.url.startsWith("/todos") && req.method == "DELETE"`  加入此段程式碼

```sh
if (req.url.startsWith("/todos") && req.method == "DELETE") {
    // 取出 URL 中的 id
    const id = req.url.split("/").pop();
    
    // id 與陣列資料比對如果有值才能做刪除 (無值會回傳 -1)
    const index = todos.findIndex(element => element.id == id);
    console.log(id, index);

    // 如果 id 存在才能做刪除動作
    if (index !== -1) {
        todos.splice(index, 1);
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
        }));
        res.end();
    } else {
        // 錯誤處理函式
        errorHandles(res);
    }
}
```

---

## 實作：編輯單筆代辦 API && POSTMAN 全部測試一次

- 在 `req.url.startsWith("/todos") && req.method == "PATCH"`  加入此段程式碼

```sh
if (req.url.startsWith("/todos") && req.method == "PATCH") {
    req.on('end', () => {
        try{

            // 取得輸入值
            const todo = JSON.parse(body).title;

            // 取出 URL 中的 id
            const id = req.url.split("/").pop();

            // id 與陣列資料比對如果有值才能做編輯 (無值會回傳 -1)
            const index = todos.findIndex(element => element.id == id);

            // 如果有輸入值，且id存在於資料陣列中，才能進行資料修改動作。
            if (todo !== undefined && index !== -1) {
                todos[index].title = todo;
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    "status": "success",
                    "data": todos,
                }));
                res.end();
            }
        } catch{
            errorHandles(res);
        }
    });
}
```

---

## 實作： Render 環境設置
- [Render 官網](https://render.com/)
- [Render 免費服務方案額度介紹](https://docs.render.com/free)

### 上傳前注意事項

1. 修改連接 PORT

```sh
server.listen(process.env.PORT || 3005);
```

> 加入 `process.env.PORT` ，上傳到雲服務上面會先看支援哪個 port, 本地端則使用 3005。

1. 檢查 `package.json` 檔案

```sh
"script" :{
    "start": "node server.js"
}
```

> 啟動指令，雲端主機預設 start 的指令是 `node server.js`

- 鎖住 node 版本號

```sh
"engines": {
    "node":"16.x"
  }
```

> 看開發階段是使用哪一個node版本開發，就輸入那個版本的號碼。

- git 指令
```sh
echo "# training-todolist-RESTful-Api-kata" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/shcopy/training-todolist-RESTful-Api-kata.git
git push -u origin main


git add .
git status
git commit -m "調整環境設定"
git push origin main
```

---

## 實作：Render 部署流程

