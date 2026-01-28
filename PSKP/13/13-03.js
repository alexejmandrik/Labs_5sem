// server_13_03.js
const net = require('net');

let totalSum = 0;
const clients = [];

const server = net.createServer((socket) => {
    console.log("Клиент подключён");
    clients.push(socket);

    socket.on("data", (data) => {
        const number = data.readInt32LE(0);
        console.log("Получено число:", number);
        totalSum += number;
    });

    socket.on("error", (err) => {
        console.log("Ошибка сокета:", err.code);
    });


    socket.on("end", () => {
        console.log("Клиент отключён");
        const index = clients.indexOf(socket);
        if (index !== -1) clients.splice(index, 1);
    });
});

// Каждые 5 секунд отправляем сумму всем клиентам
setInterval(() => {
    if (clients.length === 0) return;

    const buf = Buffer.alloc(4);
    buf.writeInt32LE(totalSum, 0);

    console.log("Рассылка промежуточной суммы:", totalSum);

    clients.forEach((socket) => {
        socket.write(buf);
    });
}, 5000);

server.listen(4001, () => {
    console.log("TCP-сервер 13-03 запущен на порту 4001");
});
