var http = require("http");
const url = require("url");

function factorial(n) {
  if (n < 0) return NaN;         
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);   
}

const server = http.createServer(function(request, response)
{
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const k = parseInt(parsedUrl.query.k);

    if (pathname === "/fact" && !isNaN(k) && request.method === "GET") {
        const result = {
        k: k,
        fact: factorial(k)
        };
        response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(result));
    }
    else
    {
        response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify("Ошибочка"));
    }

}).listen(5000);

console.log('Server running at http://localhost:5000');
