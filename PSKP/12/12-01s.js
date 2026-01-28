const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_FILE = "StudentList.json";
const BACKUP_DIR = "backup";

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

let clients = []; 

function sendJSON(res, code, obj) {
    res.writeHead(code, { "Content-Type": "application/json" });
    res.end(JSON.stringify(obj, null, 2));
}

function readStudents() {
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeStudents(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
// отпр события
function notifyClients(message) {
    clients.forEach(client => {
        client.res.write(`data: ${JSON.stringify(message)}\n\n`);
    });
}


function subscribe(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache"
    });

    const client = { id: Date.now(), res };
    clients.push(client);

    const interval = setInterval(() => {
        res.write(":\n\n");
    }, 10000);

    req.on("close", () => {
        clearInterval(interval);
        clients = clients.filter(c => c.id !== client.id);
    });
}


const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");

    if (req.method === "GET" && url.pathname === "/subscribe") {
        return subscribe(req, res);
    }

    if (req.method === "GET" && url.pathname === "/") {
        const students = readStudents();
        return sendJSON(res, 200, students);
    }

    if (req.method === "GET" && /^\/\d+$/.test(url.pathname)) {
        const id = parseInt(url.pathname.substring(1));
        const students = readStudents();
        const student = students.find(s => s.id === id);

        if (!student)
            return sendJSON(res, 404, { error: "Студент не найден" });

        return sendJSON(res, 200, student);
    }

    if (req.method === "POST" && url.pathname === "/") {
        let body = "";

        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const newStudent = JSON.parse(body);
            const students = readStudents();

            if (students.some(s => s.id === newStudent.id))
                return sendJSON(res, 400, { error: "Студент с таким id уже существует" });

            students.push(newStudent);
            writeStudents(students);
            sendJSON(res, 200, newStudent);
        });

        return;
    }

    if (req.method === "PUT" && url.pathname === "/") {
        let body = "";

        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const studentNew = JSON.parse(body);
            const students = readStudents();
            const idx = students.findIndex(s => s.id === studentNew.id);

            if (idx === -1)
                return sendJSON(res, 404, { error: "Студент не найден" });

            students[idx] = studentNew;
            writeStudents(students);

            sendJSON(res, 200, studentNew);
        });

        return;
    }

    if (req.method === "DELETE" && /^\/\d+$/.test(url.pathname)) {
        const id = parseInt(url.pathname.substring(1));
        const students = readStudents();
        const idx = students.findIndex(s => s.id === id);

        if (idx === -1)
            return sendJSON(res, 404, { error: "Студент не найден" });

        const removed = students.splice(idx, 1)[0];
        writeStudents(students);
        return sendJSON(res, 200, removed);
    }

    if (req.method === "POST" && url.pathname === "/backup") {

        setTimeout(() => {
            const timestamp = new Date()
                .toISOString()
                .replace(/[^0-9]/g, "")
                .slice(0, 14);

            const backupName = `${timestamp}_StudentList.json`;
            const backupPath = path.join(BACKUP_DIR, backupName);

            fs.copyFileSync(DATA_FILE, backupPath);

            notifyClients({ event: "backup_created", file: backupName });

            sendJSON(res, 200, { backup: backupName });
        }, 2000);

        return;
    }

    if (req.method === "GET" && url.pathname === "/backup") {
        const files = fs.readdirSync(BACKUP_DIR);
        return sendJSON(res, 200, files);
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/backup/")) {
        let dateLimit = url.pathname.replace("/backup/", "");
        dateLimit = dateLimit.replace(/\D/g, '');

        const inputYear = dateLimit.substring(0, 4);
        const inputDay = dateLimit.substring(4, 6);
        const inputMonth = dateLimit.substring(6, 8);

        const limitDate = new Date(`${inputYear}-${inputMonth}-${inputDay}`);

        const files = fs.readdirSync(BACKUP_DIR);
        let removed = [];

        files.forEach(file => {
            const year = file.substring(0, 4);
            const month = file.substring(4, 6);
            const day = file.substring(6, 8);


            const fileDate = new Date(`${year}-${month}-${day}`);

            if (fileDate < limitDate) {
                fs.unlinkSync(path.join(BACKUP_DIR, file));
                removed.push(file);
                notifyClients({ event: "backup_removed", file });
            }
        });

        return sendJSON(res, 200, { removed });
    }

    sendJSON(res, 404, { error: "Unknown route" });
});

fs.watch(DATA_FILE, (event, filename) => {
    if (event === "change") {
        notifyClients({
            event: "main_file_changed",
            file: DATA_FILE
        });
    }
});

fs.watch(BACKUP_DIR, (event, filename) => {
    if (!filename) return;

    notifyClients({
        event: "backup_file_changed",
        file: filename,
        eventType: event
    });
});


server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});



// [
//     {"id":1, "name": "Воробьева Дарья", "bday": "2005-12-02", "specility": "ПОИТ"},
//     {"id":2, "name": "Гулецкий Прохор", "bday": "2005-12-02", "specility": "ПОИТ"},
//     {"id":3, "name": "Жамойдо Артем", "bday": "2005-12-02", "specility": "ПОИТ"},
//     {"id":4, "name": "Кавецкий Богдан", "bday": "2005-12-02", "specility": "ПОИТ"},
//     {"id":5, "name": "Кирпиченко Виктория", "bday": "2005-12-02", "specility": "ПОИТ"},
//     {"id":6, "name": "Мандрик Алексей", "bday": "2005-12-02", "specility": "ПОИТ"},
//     {"id":7, "name": "Редько Павел", "bday": "2005-12-02", "specility": "ПОИТ"},
//     {"id":8, "name": "Рублевская Маргарита", "bday": "2005-12-02", "specility": "ПОИТ"},
//     {"id":9, "name": "Самойлов Никита", "bday": "2005-12-02", "specility": "ПОИТ"},
//     {"id":10, "name": "Соленок Анастасия", "bday": "2005-12-02", "specility": "ПОИТ"},
//     {"id":11, "name": "Шевчик Антон", "bday": "2005-12-02", "specility": "ПОИТ"},
//     {"id":12, "name": "Ярохович Станислав", "bday": "2005-12-02", "specility": "ПОИТ"}
// ]