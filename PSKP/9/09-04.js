const http = require("http");

const PostData = 
{
    "__comment": "Запросю Лабораторная работа 8/10",
    "x": 1,
    "y": 2,
    "s": "Message",
    "m": ["a", "b", "c", "d"],
    "o":{"surname":"Мандрик", "name":"Алексей"}
};

const options = 
{
    hostname: "localhost",
    port: 3000,
    path: "/4",
    method: "POST",
    headers: {'Content-Type': 'application/json'}
}

const request = http.request(options, response => {
    let body = '';

    response.on('data', chunk => { body += chunk.toString()});

    response.on('end', () => {
        let parsed = JSON.parse(body);

        console.log("Статус ответа: ", response.statusCode);
        console.log("Тело ответа: ", parsed);
    })
});

request.write(JSON.stringify(PostData));
request.end();