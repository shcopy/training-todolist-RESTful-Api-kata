const http = require('http'); // 使用 node 內建的 http 模組
const {
    v4: uuidv4
} = require('uuid'); // 使用外部的 uuid npm 模組
const errorHandles = require('./errorHandle'); // 自己寫的錯誤處理函式
const todos = [];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
        'Content-Type': 'application/json'
    }

    let body = "";
    let num = 0;
    // STEP1: 等待 req.body 接收
    req.on('data', chunk => {
        console.log(chunk);
        body += chunk;
        // num+=1;
        // console.log(num);
    })
    // 動作: 取得所有代辦事項
    if (req.url == "/todos" && req.method == "GET") {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos
        }));
        res.end();
        // 新增代辦事項
    } else if (req.url == "/todos" && req.method == "POST") { // STEP2: 透過 req.on('end') 觸發
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
                        "data": todos
                    }));
                    res.end();
                } else {
                    errorHandles(res); // 錯誤處理函式
                }
            } catch (error) {
                errorHandles(res); // 錯誤處理函式
            }
        })
        // 動作: 刪除所有代辦事項
    } else if (req.url == "/todos" && req.method == "DELETE") {
        todos.length = 0; // 刪除陣列全部資料
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
            "delete": "yes"
        }));
        res.end();
        // 動作: 刪除指定代辦事項
    } else if (req.url.startsWith("/todos") && req.method == "DELETE") { 
        
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
                "data": todos
            }));
            res.end();
        } else {
            errorHandles(res); // 錯誤處理函式
        }
        // 動作: 編輯指定代辦事項
    } else if (req.url.startsWith("/todos") && req.method == "PATCH") {
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
server.listen(process.env.PORT || 3005);