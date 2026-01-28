const http = require("http");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "Test.txt");
const fileData = fs.readFileSync(filePath, "utf-8"); 

const options = {
    hostname: "localhost",
    port: 3000,
    path: "/6",
    method: "POST",
    headers: { 'Content-Type': 'text/plain' }
};

const request = http.request(options, response => 
{
    let body = '';

    response.on('data', chunk => { body += chunk.toString(); });

    response.on('end', () => {
        console.log("Статус:", response.statusCode);
        console.log("Ответ:", body);
    });
});
request.write(fileData);
request.end();
