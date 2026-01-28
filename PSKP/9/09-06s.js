const http = require("http");

const server = http.createServer((request, response) => 
{
    if(request.method === "POST" && request.url === "/6") 
    {
        let body = '';

        request.on('data', chunk => { body += chunk; });

        request.on('end', () => {
            console.log("Файл получен:\n", body);

            response.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
            response.end("Файл успешно получен!");
        });
    } 
    else {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8;" });
        response.end("Ошибка. Не найден");
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');

