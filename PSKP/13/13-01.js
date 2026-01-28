const net = require('net');

const server = net.createServer((socket) => {
console.log('Клиент подключился');


socket.on('data', (data) => {
const message = data.toString();
console.log('Получено:', message);
socket.write(`ECHO: ${message}`);
});

socket.on('end', () => {
console.log('Клиент отключился');
});
});

server.listen(4000, () => {
console.log('TCP-сервер запущен на порту 4000');
});