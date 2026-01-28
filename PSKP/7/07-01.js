const http = require('http');
const handleStatic = require('./m07-01');

const STATIC_DIR = 'static';

const server = http.createServer((req, res) => {
    handleStatic(STATIC_DIR, req, res);
});

server.listen(3000, () => {
    console.log(`Сервер 07-01 запущен на http://localhost:3000/`);
});
