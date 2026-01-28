const net = require('net');

if (process.argv.length < 3) {
    console.log("Использование: node client_13_06.js <X>");
    process.exit(1);
}

const X = parseInt(process.argv[2]);
if (isNaN(X)) {
    console.log("X должно быть числом!");
    process.exit(1);
}

const client = new net.Socket();

client.connect(4002, "127.0.0.1", () => {
    console.log(`Клиент запущен, отправляет число ${X} каждую секунду`);

    // Каждую секунду отправляем число X
    setInterval(() => {
        const buf = Buffer.alloc(4);
        buf.writeInt32LE(X, 0);
        client.write(buf);
        console.log(`Отправлено: ${X}`);
    }, 1000);
});

// Приём индивидуальных сумм
client.on("data", (data) => {
    const sum = data.readInt32LE(0);
    console.log(`Промежуточная сумма: ${sum}`);
});

client.on("error", (err) => {
    console.log("Ошибка:", err.code);
});
