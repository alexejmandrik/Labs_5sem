const http = require("http");
const url = require("url");

const server = http.createServer((request, response) => {
    const ParsedUrl = url.parse(request.url, true);

    if(request.method === "GET" && ParsedUrl.pathname === "/param")
    {
        let { x, y } = ParsedUrl.query;
        response.writeHead(200, { 'Content-type':'text/plain; charset=utf-8;' });
        response.end(`Параметр x: ${x}; Параметр y: ${y}`);
    }
    else
    {
        response.writeHead(404, {'Content-type':'text/plain; charset=utf-8;'})
        response.end("Ошибка. Не найден.")
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');