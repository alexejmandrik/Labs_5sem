const http = require("http");

const options = {
    hostname: "localhost",
    port: 3000,
    path: "/subscribe",
    method: "GET",
    headers: {
        Accept: "text/event-stream"
    }
};

const req = http.request(options, (res) => {
    console.log("Подключено к SSE сервера...");

    res.setEncoding("utf8");
    let buffer = "";

    res.on("data", (chunk) => {
        buffer += chunk;

        let lines = buffer.split("\n\n"); 
        buffer = lines.pop();

        for (const line of lines) {
            const dataLine = line.split("\n").find(l => l.startsWith("data:"));
            if (dataLine) {
                const jsonStr = dataLine.replace(/^data:\s*/, "");
                try {
                    const data = JSON.parse(jsonStr);
                    console.log("Получено уведомление:", data);
                } catch (err) {
                    console.error("Ошибка парсинга SSE:", err);
                }
            }
        }
    });
});

req.on("error", (err) => {
    console.error("Ошибка соединения:", err);
});
req.end();
