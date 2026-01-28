var http = require("http");
var fs = require("fs");

http.createServer(function(request, response)
{
    const fname = './jquery.html';
    let date = null;
    if(request.url === "/jquery")
    {
        date = fs.readFileSync(fname);
        response.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
        response.end(date);
    }
    else if(request.url === "/api/name"){
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end('Мандрик Алексей Иванович');
    }
}).listen(5000);

console.log("Server running at http://localhost:5000/jquery");