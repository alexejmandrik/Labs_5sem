//  broadcast + ping/pong
const WebSocket = require('ws');

function createClient(name) {
    const ws = new WebSocket('ws://localhost:4000/');

    ws.on('open', () => {
        console.log(`${name} connected`);
    });

    ws.on('message', (message) => {
        console.log(`${name} received: ${message}`);
    });

    // ws.on('ping', (data)=> {
    //     console.log(name ,' on ping: ', data.toString());
    // });

    ws.on('close', () => {
        console.log(`${name} disconnected`);
    });

    return ws;
}

const clientA = createClient('ClientA');
const clientB = createClient('ClientB');
const clientC = createClient('ClientC');

setTimeout(() => {
    clientA.close();
    clientB.close();
    clientC.close();
}, 30000);
