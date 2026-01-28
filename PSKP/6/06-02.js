const http = require('http');
const fs = require('fs');
const url = require('url');
const { parse } = require('querystring');
const nodemailer = require('nodemailer');

const handler = async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  if (url.parse(req.url).pathname === '/' && req.method === 'GET') {
    const html = fs.readFileSync('./06-02.html');
    res.end(html);
  }

  else if (url.parse(req.url).pathname === '/' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      const params = parse(body);

      let testAccount = await nodemailer.createTestAccount();

      let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      let mailOptions = {
        from: params.sender,
        to: params.receiver,
        subject: 'Тестовое письмо из Nodemailer (Ethereal)',
        text: params.message,
        html: `<p>${params.message}</p>`
      };

      try {
        let info = await transporter.sendMail(mailOptions);
        res.end(`
          <h2>Письмо успешно отправлено!</h2>
          <p><strong>Message ID:</strong> ${info.messageId}</p>
          <p><a href="${nodemailer.getTestMessageUrl(info)}" target="_blank">Открыть письмо в Ethereal</a></p>
        `);
      } catch (err) {
        console.error(err);
        res.end(`<h3>Ошибка при отправке письма:</h3><pre>${err.message}</pre>`);
      }
    });
  }

  else {
    res.end('<h3>Not supported</h3>');
  }
};

http.createServer(handler).listen(3000, () => {
  console.log('Сервер запущен: http://localhost:3000/');
});
