const http = require('http');
const fs = require('fs');
const path = require('path');

const httpServer = http.createServer(function(request, response)
{
    if (request.method === 'GET' && request.url === '/start') {
        const file = fs.readFileSync(path.join(__dirname, 'index.html'));
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(file);
    } else {
        response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Ошибка');
    }
}).listen(3000);
console.log('http://localhost:3000');



const WebSocket = require('ws');
let lastClientNumber = 0;
let serverMsgCounter = 1;

const wsServer = new WebSocket.Server({ port: 4000, host: "localhost" });

wsServer.on('connection', ws => {
    console.log('Клиент подключен ');

    ws.on('message', message => {
        console.log(`Received message: ${message}`);
        const parsed = message.toString().match(/(\d+)$/);
        if (parsed) lastClientNumber = Number(parsed[1]);
    });

    const interval = setInterval(() => {
        ws.send(`10-01-server: ${lastClientNumber}->${serverMsgCounter++}`);
    }, 5000);

    ws.on('close', () => {
        clearInterval(interval);
        console.log('Клиент отключен');
    });
});

console.log('WS фурычит');
