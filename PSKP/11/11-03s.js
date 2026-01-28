// broadcast + ping/pong
const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 4000,
    host: 'localhost',
});
let counter = 0;

wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', (data) => {
        ws.isAlive = true;
    //  console.log('on pong: ', data.toString());
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

setInterval(() => {
    counter++;

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`11-03-s: ${counter}`);
        }
    });
}, 15000); // message every 15 seconds

setInterval(() => {
    let aliveCount = 0;

    wss.clients.forEach(client => {
        if (client.isAlive) aliveCount++;
        client.isAlive = false;
        client.ping();
    });
    console.log('Alive connections:', aliveCount);
}, 5000); // ping-check every 5 seconds

console.log('WS server 11-03 running on ws://localhost:4000/');
