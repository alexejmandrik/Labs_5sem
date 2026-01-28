const http = require("http");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "foto.png");
const fileStream = fs.createReadStream(filePath);

const options = 
{
    hostname: "localhost",
    port: 3000,
    path: "/upload",
    method: "POST",
    headers: { 'Content-Type': 'application/octet-stream' }
};

const request = http.request(options, response => {
    let body = '';

    response.on('data', chunk => { body += chunk.toString(); });

    response.on('end', () => 
    {
        console.log("Статус:", response.statusCode);
        console.log("Ответ:", body);
    });
});

fileStream.pipe(request);


