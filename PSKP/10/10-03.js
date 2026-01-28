const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5000');

ws.on('open', () => {
    console.log("Connected");
    ws.send("Hello from client");
});

ws.on('message', msg => console.log("Received:", msg.toString()));
