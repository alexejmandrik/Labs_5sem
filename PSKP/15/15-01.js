const http = require('http');
const url = require('url');
const { ObjectId } = require('mongodb');
const DB = require('./15-01-db');

const db = new DB();

function send(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function readBody(req) {
    return new Promise(resolve => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => resolve(JSON.parse(body)));
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    try {
        if (req.method === 'GET') {
            if (pathname === '/api/faculties') {
                return send(res, 200,
                    await db.GetRecordsByTableName('faculty')
                );
            }

            if (pathname === '/api/pulpits') {
                return send(res, 200,
                    await db.GetRecordsByTableName('pulpit')
                );
            }
        }


            if (req.method === 'POST') {
            const body = await readBody(req);  // <-- нужно читать тело запроса

            if (pathname === '/api/faculties') {
                return send(res, 200,
                    await db.InsertRecords('faculty', 'faculty', body)
                );
            }

            if (pathname === '/api/pulpits') {
                // Проверяем существование факультета
                await db.GetRecord('faculty', { faculty: body.faculty })
                    .catch(() => { 
                        throw `Cannot insert pulpit: faculty ${body.faculty} does not exist`; 
                    });

                // Вставка кафедры
                return send(res, 200,
                    await db.InsertRecords('pulpit', 'pulpit', body)
                );
            }
        }


        if (req.method === 'PUT') {
            const body = await readBody(req);

            if (!body._id) {
                throw 'ID is required';
            }

            if (pathname === '/api/faculties') {
                return send(res, 200,
                    await db.UpdateRecords('faculty', body._id, body)
                );
            }

            if (pathname === '/api/pulpits') {
                return send(res, 200,
                    await db.UpdateRecords('pulpit', body._id, body)
                );
            }
        }

        if (req.method === 'DELETE') {
            const parts = pathname.split('/');
            const id = parts[3];

            if (parts[2] === 'faculties') {

                const faculty = await db.GetRecord(
                    'faculty',
                    { _id: new ObjectId(id) }
                );

                const dbConn = await db.connect();
                const count = await dbConn
                    .collection('pulpit')
                    .countDocuments({ faculty: faculty.faculty });

                if (count > 0) {
                    throw 'Cannot delete faculty: pulpits exist';
                }

                return send(res, 200,
                    await db.DeleteRecord('faculty', id)
                );
            }

            if (parts[2] === 'pulpits') {
                return send(res, 200,
                    await db.DeleteRecord('pulpit', id)
                );
            }
        }
        send(res, 404, { error: 'Invalid URL' });

    } catch (e) {
        send(res, 400, { error: e });
    }
});


server.listen(3000, () => {
    console.log('Server running on port 3000');
});
