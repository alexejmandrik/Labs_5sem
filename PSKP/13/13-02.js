const net = require('net');

const client = new net.Socket();

client.connect(4000, '127.0.0.1', () => {
console.log('Подключено к серверу');
client.write('Hello server');
});

client.on('data', (data) => {
console.log('Ответ:', data.toString());
client.destroy();
});

client.on('close', () => {
console.log('Соединение закрыто');
});