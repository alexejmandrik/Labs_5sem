const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const pool = new sql.ConnectionPool({
    server: 'localhost',
    database: 'MAIDB',
    user: 'MAI',                     
    password: '1234',      
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
});

const poolConnect = pool.connect();

function sendJSON(res, status, data)
{
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

function getBody(req)
{
    return new Promise((resolve, reject) =>
    {
        let body = '';

        req.on('data', chunk =>
        {
            body += chunk;
        });

        req.on('end', () =>
        {
            try
            {
                resolve(body ? JSON.parse(body) : {});
            }
            catch (err)
            {
                reject(err);
            }
        });
    });
}

const server = http.createServer(async (req, res) =>
{
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    try
    {
        await poolConnect;
        const request = pool.request();

        if (req.method === 'GET')
        {
            if (pathname === '/')
            {
                const filePath = path.join(__dirname, 'index.html');

                fs.readFile(filePath, (err, data) =>
                {
                    if (err)
                    {
                        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end('Ошибка чтения файла');
                    }
                    else
                    {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(data);
                    }
                });

                return;
            }

            if (pathname === '/api/faculties')
            {
                const result = await request.query('SELECT * FROM dbo.FACULTY');
                return sendJSON(res, 200, result.recordset);
            }

            if (pathname === '/api/pulpits')
            {
                const result = await request.query('SELECT * FROM PULPIT');
                return sendJSON(res, 200, result.recordset);
            }

            if (pathname === '/api/subjects')
            {
                const result = await request.query('SELECT * FROM SUBJECT');
                return sendJSON(res, 200, result.recordset);
            }

            if (pathname === '/api/auditoriumstypes')
            {
                const result = await request.query('SELECT * FROM AUDITORIUM_TYPE');
                return sendJSON(res, 200, result.recordset);
            }

            if (pathname === '/api/auditoriums' || pathname === '/api/auditorims')
            {
                const result = await request.query('SELECT * FROM AUDITORIUM');
                return sendJSON(res, 200, result.recordset);
            }
        }

        if (req.method === 'POST')
        {
            const body = await getBody(req);

            if (pathname === '/api/faculties')
            {
                await request.query(
                    `INSERT INTO FACULTY VALUES ('${body.FACULTY}', N'${body.FACULTY_NAME}')`
                );
                return sendJSON(res, 200, body);
            }

            if (pathname === '/api/pulpits')
            {
                await request.query(
                    `INSERT INTO PULPIT VALUES ('${body.PULPIT}', N'${body.PULPIT_NAME}', '${body.FACULTY}')`
                );
                return sendJSON(res, 200, body);
            }

            if (pathname === '/api/subjects')
            {
                await request.query(
                    `INSERT INTO SUBJECT VALUES ('${body.SUBJECT}', N'${body.SUBJECT_NAME}', '${body.PULPIT}')`
                );
                return sendJSON(res, 200, body);
            }

            if (pathname === '/api/auditoriumstypes')
            {
                await request.query(
                    `INSERT INTO AUDITORIUM_TYPE VALUES ('${body.AUDITORIUM_TYPE}', N'${body.AUDITORIUM_TYPENAME}')`
                );
                return sendJSON(res, 200, body);
            }

            if (pathname === '/api/auditoriums' || pathname === '/api/auditorims')
            {
                await request.query(
                    `INSERT INTO AUDITORIUM VALUES ('${body.AUDITORIUM}', N'${body.AUDITORIUM_NAME}', '${body.AUDITORIUM_TYPE}')`
                );
                return sendJSON(res, 200, body);
            }
        }

        if (req.method === 'PUT')
        {
            const body = await getBody(req);

            if (pathname === '/api/faculties')
            {
                await request.query(
                    `UPDATE FACULTY SET FACULTY_NAME=N'${body.FACULTY_NAME}' WHERE FACULTY='${body.FACULTY}'`
                );
                return sendJSON(res, 200, body);
            }

            if (pathname === '/api/pulpits')
            {
                await request.query(
                    `UPDATE PULPIT SET PULPIT_NAME=N'${body.PULPIT_NAME}', FACULTY='${body.FACULTY}' WHERE PULPIT='${body.PULPIT}'`
                );
                return sendJSON(res, 200, body);
            }

            if (pathname === '/api/subjects')
            {
                await request.query(
                    `UPDATE SUBJECT SET SUBJECT_NAME=N'${body.SUBJECT_NAME}', PULPIT='${body.PULPIT}' WHERE SUBJECT='${body.SUBJECT}'`
                );
                return sendJSON(res, 200, body);
            }

            if (pathname === '/api/auditoriumstypes')
            {
                await request.query(
                    `UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME=N'${body.AUDITORIUM_TYPENAME}' WHERE AUDITORIUM_TYPE='${body.AUDITORIUM_TYPE}'`
                );
                return sendJSON(res, 200, body);
            }

            if (pathname === '/api/auditoriums' || pathname === '/api/auditorims')
            {
                await request.query(
                    `UPDATE AUDITORIUM SET AUDITORIUM_NAME=N'${body.AUDITORIUM_NAME}', AUDITORIUM_TYPE='${body.AUDITORIUM_TYPE}' WHERE AUDITORIUM='${body.AUDITORIUM}'`
                );
                return sendJSON(res, 200, body);
            }
        }

        if (req.method === 'DELETE') {
    const parts = pathname.split('/');

    if (parts[1] === 'api' && parts.length === 4) {
        const entity = parts[2];
        const id = decodeURIComponent(parts[3]); 

        try {
            if (entity === 'faculties') {
                await request.input('id', sql.NVarChar, id)
                             .query('DELETE FROM FACULTY WHERE FACULTY = @id');
                return sendJSON(res, 200, { deleted: id });
            }

            if (entity === 'pulpits') {
                await request.input('id', sql.NVarChar, id)
                             .query('DELETE FROM PULPIT WHERE PULPIT = @id');
                return sendJSON(res, 200, { deleted: id });
            }

            if (entity === 'subjects') {
                await request.input('id', sql.NVarChar, id)
                             .query('DELETE FROM SUBJECT WHERE SUBJECT = @id');
                return sendJSON(res, 200, { deleted: id });
            }

            if (entity === 'auditoriumtypes' || entity === 'auditoriumstypes') {
                await request.input('id', sql.NVarChar, id)
                             .query('DELETE FROM AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = @id');
                return sendJSON(res, 200, { deleted: id });
            }

            if (entity === 'auditoriums' || entity === 'auditorims') {
                await request.input('id', sql.NVarChar, id)
                             .query('DELETE FROM AUDITORIUM WHERE AUDITORIUM = @id');
                return sendJSON(res, 200, { deleted: id });
            }

            // если сущность не найдена
            return sendJSON(res, 404, { error: `Unknown entity: ${entity}` });
        } catch (err) {
            return sendJSON(res, 500, { error: err.message });
        }
    }
}


        sendJSON(res, 404, { error: 'Not found' });
    }
    catch (err)
    {
        sendJSON(res, 500, { error: err.message });
    }
});

server.listen(3000);
