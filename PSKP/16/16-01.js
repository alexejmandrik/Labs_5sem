const http = require('http');
const { graphql } = require('graphql');
const schema = require('./schema');
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

pool.connect();

function getBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', c => data += c);
    req.on('end', () => resolve(JSON.parse(data)));
  });
}

http.createServer(async (req, res) => {

  if (req.method === 'POST' && req.url === '/graphql') {
    const body = await getBody(req);

    const result = await graphql({
      schema,
      source: body.query,
      variableValues: body.variables,
      contextValue: { pool }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  res.writeHead(404);
  res.end('Not found');

}).listen(3000, () =>
  console.log('GraphQL server on http://localhost:3000/graphql')
);
