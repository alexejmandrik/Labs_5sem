var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./db');

var db = new data.DB();

db.on('GET', function(request, response)
{
    console.log('DB.GET');
    response.end(JSON.stringify(db.get()));
});

db.on('POST', function(request, response)
{
    console.log('DB.POST');
    request.on('data', data=>{
                                let r = JSON.parse(data)
                                db.post(r);
                                response.end(JSON.stringify(r));
                              });
});

db.on('PUT', function(request, response)
{
    console.log('DB.PUT');
    request.on('data', data=>{
                                let r = JSON.parse(data)
                                db.put(r.id, r);
                                response.end(JSON.stringify(r));
                              });
});


db.on('DELETE', function(request, response)
{
    console.log('DB.DELETE');
    request.on('data', data => {
                                let r = JSON.parse(data);
                                db.delete(r.id);
                                response.end(JSON.stringify(r));
                            });
});

http.createServer(function(request,response)
{
    if(url.parse(request.url).pathname === '/')
    {
        let html = fs.readFileSync('./04-01.html');
        response.writeHead(200, {'content-type': 'text/html; charset=utf-8'});
        response.end(html);
    }else if(url.parse(request.url).pathname === '/api/db')
    {
        db.emit(request.method, request, response);
    }
}).listen(5000);
console.log("Сервер запущен: http://localhost:5000/");