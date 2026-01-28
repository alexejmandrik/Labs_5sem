const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((request, response) => 
{
    if(request.method === "POST" && request.url === "/upload") 
    {
        const filePath = path.join(__dirname, "SavedFile.png");
        const fileStream = fs.createWriteStream(filePath);

        request.pipe(fileStream); 

        request.on('end', () => 
        {
            response.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
            response.end("Файл сохранен");
        });

    } 
    else {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8;" });
        response.end("Ошибка. Не найден");
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');
