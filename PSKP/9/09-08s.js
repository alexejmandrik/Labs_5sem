const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((request, response) => 
{
    if(request.method === "GET" && request.url === "/download") 
    {
        const filePath = path.join(__dirname, "foto.png");

        fs.access(filePath, fs.constants.F_OK, (err) => 
        {
            if(err) 
            {
                response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
                response.end("Ошибка. Файл не найден");
            } 
            else 
            {
                response.writeHead(200, 
                {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment; filename="foto.png"'
                });
                const fileStream = fs.createReadStream(filePath);
                fileStream.pipe(response);
                fileStream.on('end', () => console.log("Файл отправлен"));
            }
        });
    } 
    else {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8;" });
        response.end("Ошибка. Не найден");
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');
