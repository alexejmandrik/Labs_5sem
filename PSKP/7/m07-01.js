const fs = require('fs');
const path = require('path');

const mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'docx': 'application/msword',
    'json': 'application/json',
    'xml': 'application/xml',
    'mp4': 'video/mp4'
};

function handleStatic(staticDir, req, res) {
    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('405 Method Not Allowed');
        return;
    }

    let filePath = req.url === '/' ? '/index.html' : req.url;
    const ext = path.extname(filePath).substring(1); 
    const mimeType = mimeTypes[ext];

    if (!mimeType) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }

    const fullPath = path.join(__dirname, staticDir, decodeURIComponent(filePath));

    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 File Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(data);
        }
    });
}

module.exports = handleStatic;
