var http = require('http');
var fs = require('fs');

http.createServer(function(request, response)
{
    if(request.url == '/png'  && request.method === 'GET')
    {
        const fname = './Belka.jpg';
        let jpg = null;

        fs.stat(fname, (err, stat)=> {
            if(err) {console.log('error:', err);}
            else {
                jpg = fs.readFileSync(fname);
                response.writeHead(200,{'Content-Type': 'image/jpeg', 'content-length':stat.size});
                response.end(jpg, 'binary');
            }
        });
    }
    else{
        response.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
        response.end('<h1> Ошибка </h1>');
    }
}).listen(5000);
   

console.log('Server running at http://localhost:5000/png');
