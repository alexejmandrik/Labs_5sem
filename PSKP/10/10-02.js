const WebSocket = require('ws');

let counter = 1;
let sendInterval;

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log("WS подключение создано");

    sendInterval = setInterval(() => {
        ws.send(`10-02-client: ${counter}`);
        console.log("Sent → 10-02-client:", counter);
        counter++;
    }, 3000);

    setTimeout(() => {
        clearInterval(sendInterval);
        ws.close();
        console.log("WS подлкючение разорвано");
    }, 25000);
});

ws.on('message', message => console.log("Received ←", message.toString()));
