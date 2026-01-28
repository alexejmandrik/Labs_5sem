const http = require("http");

const server = http.createServer((req, res) => {
    if(req.url === "/1" && req.method === "GET")
    {
        res.writeHead(200, {'Content-type':'text/plain; charset=utf-8;'})
        res.end("Ответ сервера");
    }
    else
    {
        res.writeHead(404, {'Content-type':'text/plain; charset=utf-8;'})
        res.end("Ошибка. Не найден.")
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');