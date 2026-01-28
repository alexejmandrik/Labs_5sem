const http = require("http");

const options =
{
    hostname: 'localhost',
    port: 3000,
    path: '/1',
    method: 'GET'
}

const request = http.request(options, response => {
    let body = '';
    let ip = response.socket.remoteAddress;  
    response.on('data', chunk => { body += chunk.toString(); })

    response.on('end', () => {
        console.log('Статус: ', response.statusCode);
        console.log('Сообщение: ', response.statusMessage);
        console.log('IP: ', ip);
        console.log('Данные: ', body);
    });
}).end();