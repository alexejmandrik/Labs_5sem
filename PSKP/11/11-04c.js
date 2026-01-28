// JSON
const WebSocket = require('ws');

const names = process.argv.slice(2);
if (names.length === 0) {
    console.log('Usage: node 11-04a.js A B C'); //  <--
    process.exit(0);
}

function createClient(name) {
    const ws = new WebSocket('ws://localhost:4000');

    ws.on('open', () => {
        console.log(`${name} connected`);

        ws.on('message', data => {
            console.log(`${name} on message:`, JSON.parse(data));
        });

        setInterval(() => {
            ws.send(JSON.stringify({
                client: name,
                timestamp: new Date().toISOString()
            }));
        }, 3000);
    });
}

names.forEach(n => createClient(n));
