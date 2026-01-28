const http = require("http");
const url = require("url");

function factorialAsync(n, callback) {
  if (n < 0) return callback(NaN);

  function calc(k, acc) {
    if (k <= 1) {
      return callback(acc);
    } else {
      process.nextTick(() => calc(k - 1, acc * k));
    }
  }

  calc(n, 1);
}

http.createServer(function(request, response) {
  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;
  const kParam = parsedUrl.query.k;

  if (pathname === "/" || pathname === "/html") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(`
      <!DOCTYPE html>
      <body>
          <div id="out"></div>

          <script>
              const out = document.getElementById('out');
              const start = performance.now();

              async function run() {
                  for (let k = 1; k <= 20; k++) {
                      const response = await fetch('/fact?k=' + k);
                      const data = await response.json();
                      const t = Math.round(performance.now() - start);
                      out.innerHTML += \`\${k}. Результат: \${t}-\${data.k}/\${data.fact}<br>\`;
                  }
                  const total = Math.round(performance.now() - start);
                  out.innerHTML += '<br><b>Общее время: ' + total + ' мс</b>';
              }

              run();
          </script>
      </body>
      </html>
    `);
    return;
  }

  else if (pathname === "/fact") {
    const k = parseInt(kParam);

    if (isNaN(k) || k < 0) {
      response.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Некорректное значение параметра k" }));
      return;
    }

    factorialAsync(k, (fact) => {
      const responseObj = { k, fact };
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify(responseObj));
    });
    return;
  }

  else {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("404 — Страница не найдена");
  }

}).listen(5000)

 console.log("Сервер запущен: http://localhost:5000/");
