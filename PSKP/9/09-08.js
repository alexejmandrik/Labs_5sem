const http = require("http");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "ClientDownload.png");

const options = 
{
    hostname: "localhost",
    port: 3000,
    path: "/download",
    method: "GET"
};

const request = http.request(options, response => 
{
    if(response.statusCode === 200) 
    {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on('finish', () => console.log("Файл сохранен"));
        fileStream.on('error', err => console.error("Ошибка при записи:", err));
    } 
    else 
    {
        let body = '';
        response.on('data', chunk => body += chunk.toString());
        response.on('end', () => {
            console.log("Ошибка:", response.statusCode, body);
        });
    }
}).end();
