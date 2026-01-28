const rpcws = require('rpc-websockets').Client;

function createClient(name, eventName) {
    const ws = new rpcws('ws://localhost:4000');

    ws.on('open', () => {
        console.log(`${name} connected`);
        ws.subscribe(eventName);

        ws.on(eventName, data => {
            console.log(`${name} on ${eventName}:`, data.toString());
        });
    });

    return ws;
}

const clientA = createClient('ClientA', 'A');
const clientB = createClient('ClientB', 'B');
const clientC = createClient('ClientC', 'C');
