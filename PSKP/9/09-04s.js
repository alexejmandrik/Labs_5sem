const http = require("http");

const server = http.createServer((request, response) => {
    if(request.method === "POST" && request.url === "/4")
    {
        let body = '';
        request.on('data', chunk => {body += chunk});
        request.on('end', () => 
        {
            const data = JSON.parse(body); 
            const myResponse = 
            {
                "__comment": data.__comment,
                "x_plus_y": data.x + data.y,
                "Concatination_s_o": `${data.s}: ${data.o.surname}, ${data.o.name}`,
                "Length_m": data.m.length
            };

            response.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
            response.end(JSON.stringify(myResponse)); 
        });
    }
    else
    {
        response.writeHead(404, {'Content-type':'text/plain; charset=utf-8;'})
        response.end("Ошибка. Не найден");
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');
