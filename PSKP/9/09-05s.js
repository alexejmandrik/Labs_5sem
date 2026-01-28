const http = require("http");
const url = require("url");

function parseBody(request, callback) {
    let body = "";
    request.on("data", chunk => body += chunk.toString());
    request.on("end", () => callback(body));
}

const server = http.createServer((request, response) => {

    const pathname = url.parse(request.url).pathname;

    if (pathname === "/xml" && request.method === "POST") {

        parseBody(request, body => {
            const idMatch = body.match(/<request\s+id="(\d+)"\s*>/);
            const requestId = idMatch ? idMatch[1] : "0";

            const xMatches = [...body.matchAll(/<x value="(\d+)"/g)];
            const sumX = xMatches.reduce((sum, m) => sum + Number(m[1]), 0);

            const mMatches = [...body.matchAll(/<m value="([^"]+)"/g)];
            const concatM = mMatches.map(m => m[1]).join("");

            const responseXML = 
                `<response id="33" request="${requestId}">` +
                    `<sum element="x" result="${sumX}"/>` +
                    `<concat element="m" result="${concatM}"/>` +
                `</response>`;

            response.writeHead(200, { "Content-Type": "application/xml; charset=utf-8" });
            response.end(responseXML);
        });

    }     
    else
    {
        response.writeHead(404, {'Content-type':'text/plain; charset=utf-8;'})
        response.end("Ошибка. Не найден");
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');

