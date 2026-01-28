const WebSocket = require('ws');

const wsServer = new WebSocket.Server({ port: 5000 });
console.log("Broadcast WS server started on port 5000");

wsServer.on('connection', ws => {
    console.log("Client connected");

    ws.on('message', msg => {
        console.log("Broadcasting:", msg.toString());

        wsServer.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send("Broadcast: " + msg);
            }
        });
    });
});
