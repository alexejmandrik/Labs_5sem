const http = require("http");
const readline = require("readline");

const STATES = ["norm", "stop", "test", "idle"];
let currentState = "norm";

const server = http.createServer(function(request, response)
{
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(`
    <html>
      <body>
        <h1>${currentState}</h1>
      </body>
    </html>
  `);
});

server.listen(5000, () => {
  console.log("Server running at http://localhost:5000/");
  readln.setPrompt(`${currentState}->`);
  readln.prompt();
});

const readln = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

readln.on("line", (input) => {
  const command = input.trim().toLowerCase();

  if (command === "exit") {
    console.log(`${currentState}->exit`);
    readln.close();
    server.close();
    process.exit(0);
  }

  if (STATES.includes(command)) {
    console.log(`reg = ${currentState}--> ${command}`);
    currentState = command;
  } else {
    console.log(`Ошибочка: Состояие ${command} не существует`);
  }

  readln.setPrompt(`${currentState}->`);
  readln.prompt();
});