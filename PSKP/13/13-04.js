// client_13_04.js
const net = require('net');

const client = new net.Socket();

let counter = 1;

client.connect(4001, '127.0.0.1', () => {
    console.log('Подключено к серверу 13-03');

    // Отправка числа 1 раз в секунду
    const sendInterval = setInterval(() => {
        const buf = Buffer.alloc(4);
        buf.writeInt32LE(counter, 0);
        client.write(buf);
        console.log(`Отправлено число: ${counter}`);
        counter++;
    }, 1000);

    // Через 20 сек. — остановить клиента
    setTimeout(() => {
        console.log('20 секунд истекли. Отключение клиента...');
        clearInterval(sendInterval);
        client.end();
    }, 20000);
});

// Приём промежуточных сумм
client.on('data', (data) => {
    const sum = data.readInt32LE(0);
    console.log(`Получена сумма от сервера: ${sum}`);
});
