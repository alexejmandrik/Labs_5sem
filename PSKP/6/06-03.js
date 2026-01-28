const { send } = require('./m0603');

(async () => {
  try {
    let info = await send('Строка (параметр sensvsdvsdvsdd)');
    console.log('Письмо успешно отправлено!');
    console.log('Message ID:', info.messageId);
    console.log('Ссылка на просмотр письма (Ethereal):', info.previewUrl);
  } catch (err) {
    console.error('Ошибка:', err);
  }
})();
