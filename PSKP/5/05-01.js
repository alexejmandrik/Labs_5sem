var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./db');

var db = new data.DB();

let stats = {
    collecting: false,
    start: null,
    end: null,
    requests: 0,
    commits: 0
};

db.on('GET', (req, res) => {
    if(stats.collecting) stats.requests++;
    res.end(JSON.stringify(db.get()));
});

db.on('POST', (req, res) => {
    if(stats.collecting) stats.requests++;
    req.on('data', data => {
        let r = JSON.parse(data);
        db.post(r);
        res.end(JSON.stringify(r));
    });
});

db.on('PUT', (req, res) => {
    if(stats.collecting) stats.requests++;
    req.on('data', data => {
        let r = JSON.parse(data);
        db.put(r.id, r);
        res.end(JSON.stringify(r));
    });
});

db.on('DELETE', (req, res) => {
    if(stats.collecting) stats.requests++;
    req.on('data', data => {
        let r = JSON.parse(data);
        db.delete(r.id);
        res.end(JSON.stringify(r));
    });
});

db.on('COMMIT', () => {
    if(stats.collecting) stats.commits++;
});

db.on('GET_SS', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        start: stats.start,
        end: stats.collecting ? null : stats.end,
        requests: stats.requests,
        commits: stats.commits
    }));
});

http.createServer((req, res) => {
    const path = url.parse(req.url).pathname;

    if(path === '/') {
        let html = fs.readFileSync('./05-01.html');
        res.writeHead(200, {'content-type': 'text/html; charset=utf-8'});
        res.end(html);
    } else if(path === '/api/db') {
        db.emit(req.method, req, res);
    } else if(path === '/api/ss') {
        db.emit('GET_SS', req, res);
    } else {
        res.writeHead(404);
        res.end("Not found");
    }

}).listen(5000);

console.log("Сервер запущен: http://localhost:5000/");

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

let sdTimer = null;
let scTimer = null;

rl.on('line', line => {
    const [cmd, param] = line.trim().split(' ');

    switch(cmd) {
        case 'sd': 
            if(sdTimer) clearTimeout(sdTimer);
            if(param) {
                sdTimer = setTimeout(() => process.exit(0), parseInt(param)*1000);
                sdTimer.unref();
                console.log(`Сервер остановится через ${param} секунд`);
            } else {
                console.log("Отмена остановки сервера");
            }
            break;

        case 'sc': 
            if(scTimer) clearInterval(scTimer);
            if(param) {
                scTimer = setInterval(() => db.commit(), parseInt(param)*1000);
                scTimer.unref();
                console.log(`Периодический commit каждые ${param} секунд`);
            } else {
                console.log("Остановка периодического commit");
            }
            break;

        case 'ss': 
            if(stats.collecting) {
                stats.collecting = false;
                stats.end = new Date();
                console.log("Сбор статистики остановлен");
            }
            if(param) {
                stats.collecting = true;
                stats.start = new Date();
                stats.end = null;
                stats.requests = 0;
                stats.commits = 0;
                setTimeout(() => {
                    stats.collecting = false;
                    stats.end = new Date();
                }, parseInt(param)*1000).unref();
                console.log(`Сбор статистики на ${param} секунд`);
            }
            break;

        default:
            console.log("Неизвестная команда");
    }
});
