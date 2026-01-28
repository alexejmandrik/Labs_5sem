const http = require("http");

const postData = `x=10&y=5&s=/`;

const options = {
    hostname: "localhost",
    port: 3000,
    path: "/calc",
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData)
    }
};

const request = http.request(options, response => {
    let body = "";
    response.on("data", chunk => body += chunk.toString());

    response.on("end", () => {
        console.log("Статус:", response.statusCode);
        console.log("Тело:", body);
    });
});
request.write(postData);
request.end();
