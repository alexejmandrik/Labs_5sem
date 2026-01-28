const http = require("http");

const xmlData = `
<request id="28">
    <x value="1"/>
    <x value="3"/>
    <m value="a"/>
    <m value="b"/>
    <m value="c"/>
    <m value="d"/>
</request>
`;

const options = {
    hostname: "localhost",
    port: 3000,
    path: "/xml",
    method: "POST",
    headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(xmlData)
    }
};

const request = http.request(options, response => {
    let body = "";

    response.on("data", chunk => body += chunk.toString());
    response.on("end", () => {
        console.log("Статус ответа:", response.statusCode);
        console.log("Ответ сервера:\n", body);
    });
});

request.write(xmlData);
request.end();
