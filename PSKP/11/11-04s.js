//JSON
const websocket = require('ws');
const wsserver = new websocket.Server({port: 4000, host: 'localhost'});

let k=0;

wsserver.on('connection', (ws)=>{
    ws.on('message', (data)=>{
        console.log('on message: ', JSON.parse(data));
        ws.send(JSON.stringify({server: ++k, client: JSON.parse(data).client, timestamp: new Date().toString()}))
    });
})