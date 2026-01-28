const nodemailer = require('nodemailer');

const RECEIVER_EMAIL = 'alexej.nandrik.2005@gmail.com'; 

async function send(messageText) {
  try {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });

    let mailOptions = {
      from: `"NodeMailer Demo" <${testAccount.user}>`,
      to: RECEIVER_EMAIL,
      subject: 'Письмо от функции send',
      text: messageText,
      html: `<p>${messageText}</p>`
    };

    let info = await transporter.sendMail(mailOptions);

    return { messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (err) {
    console.error('Ошибка отправки письма:', err);
    throw err;
  }
}

module.exports = { send };
