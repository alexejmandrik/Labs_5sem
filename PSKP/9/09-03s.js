const http = require("http");

const server = http.createServer((request, response) => {
    if (request.method === "POST" && request.url === "/calc") {
        let body = "";
        request.on("data", chunk => body += chunk.toString());

        request.on("end", () => {
            const params = new URLSearchParams(body);
            let x = Number(params.get("x"));
            let y = Number(params.get("y"));
            let s = params.get("s");
            let result;

            switch (s) {
                case "+":
                    result = x + y;
                    break;
                case "-":
                    result = x - y;
                    break;
                case "*":
                    result = x * y;
                    break;
                case "/":
                    result = y !== 0 ? x / y : "Ошибка: деление на 0";
                    break;
                default:
                    result = "Операция не распознана";
            }
            response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8;" });
            response.end(`Результат: ${result}`);
        });
    }
    else {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8;" });
        response.end("Ошибка. Не найден");
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');
