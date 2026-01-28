const { send } = require('m06_mai');

(async () => {
  try {
    let info = await send('Строка (параметр send)');
    console.log('Письмо успешно отправлено!');
    console.log('Message ID:', info.messageId);
    console.log('Ссылка на просмотр письма (Ethereal):', info.previewUrl);
  } catch (err) {
    console.error('Ошибка:', err);
  }
})();
