const http = require("http");
const { hostname } = require("os");

const path = `/param?x=${123}&y=${23}`;

const options =
{
    hostname: "localhost",
    port: 3000,
    path,
    method: "GET"
}

const request = http.request(options, response => {
    let body = '';

    response.on('data', chunk => {body += chunk.toString(); })

    response.on('end', () => {
        console.log('Статус: ', response.statusCode);
        console.log('Тело: ', body);
    })
    
}).end();