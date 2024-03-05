import { BotChatAPI, type Update, type UpdateRequest } from '@/y360api/bot';
import { obscene } from '@/y360api/bot/types/obscene';
import GPTAPI from '@/y360api/gpt/GPTAPI';
import createTicket from '@/y360api/tracker/TrackerAPI';
import { lang } from '@/y360api/translate';
import TranslateAPI from '@/y360api/translate/TranslateAPI';

const chatAPI = new BotChatAPI('OAuth ' + process.env.BOT_KEY);

export const POST = async (req: Request): Promise<Response> => {
  const requestJson: UpdateRequest = await req.json();

  requestJson.updates.forEach(update => {
    console.log('Update: ', update);

    if (update.text) {
      const message = update.text.toUpperCase();

      if (message === '/HELLOBOT') {
        chatAPI.sendMessage('Я всё вижу! \u{1F440}', update);
      } else if (message === '/HELP') {
        chatAPI.sendMessage(
          'Доступные команды:\n- /hellobot - проверить работу бота.\n- /п в ответ на сообщение - перевод на русский.\n- /t в ответ на сообщение - перевод на английский. \n- /пропуск ФИО - создать задачу в трекере.'
          , update);
      } else if (message === '/П') {
        translate(update, lang.ru);
      } else if (message === '/T') {
        translate(update, lang.en);
      } else if (message.includes('/ПРОПУСК')) {
        createTicket(update).then(
          result => {
            console.log('Ticket created', result.id);
            chatAPI.sendMessage('Создана задача в трекере: https://tracker.yandex.ru/' + result.key, update);
          }
        );
      } else if (message.includes('/GPT')) {
        const gptAPI = new GPTAPI();
        gptAPI.generateText('Ты умный ассистент', update.text.substring(5)).then(
          res => {
            console.log(res.result.alternatives[0].message.text);
            chatAPI.sendMessage(res.result.alternatives[0].message.text, update);
          }
        );
      } else if (obscene.some(v => message.includes(v))) {
        chatAPI.deleteMessage(update);
        chatAPI.sendMessage('Сообщение пользователя ' + update.from.display_name + ' удалено.', update);
      }
    }
  });

  return Response.json('OK');
};


const translate = (update: Update, language: lang) => {
  if (update.reply_to_message) {
    console.log('Translating: ', update.reply_to_message.text);
    const translateAPI = new TranslateAPI();
    translateAPI.translateText(update.reply_to_message.text, language).then(
      respText => {
        console.log('Response Text ', respText);
        if (language === lang.ru) {
          chatAPI.sendMessage('Пользователь ' + update.reply_to_message?.from.display_name + ' написал: ' + respText, update);
        } else if (language === lang.en) {
          chatAPI.sendMessage('User ' + update.reply_to_message?.from.display_name + ' sent: ' + respText, update);
        }
      }
    );
  }
};
