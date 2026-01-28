const net = require('net');

// Список клиентов и их данных
const clients = new Map(); // socket → { sum }

const server = net.createServer((socket) => {
    console.log("Клиент подключён.");

    // Добавляем клиента со своей собственной суммой
    clients.set(socket, { sum: 0 });

    socket.on("data", (data) => {
        const number = data.readInt32LE(0);
        const clientData = clients.get(socket);
        clientData.sum += number;

        console.log(`[Клиент ${socket.remotePort}] Получено число: ${number}, его сумма = ${clientData.sum}`);
    });

    socket.on("end", () => {
        console.log(`Клиент ${socket.remotePort} отключён`);
        clients.delete(socket);
    });

    socket.on("error", (err) => {
        console.log(`Ошибка клиента ${socket.remotePort}:`, err.code);
        clients.delete(socket);
    });
});

// Каждые 5 сек отправляем КАЖДОМУ клиенту ЕГО индивидуальную сумму
setInterval(() => {
    clients.forEach((data, socket) => {
        const buf = Buffer.alloc(4);
        buf.writeInt32LE(data.sum, 0);
        socket.write(buf);

        console.log(`[Клиент ${socket.remotePort}] Отправлена сумма: ${data.sum}`);
    });
}, 5000);

server.listen(4002, () => {
    console.log("TCP-сервер 13-05 запущен на порту 4002");
});
