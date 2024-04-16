import { BotChatAPI, ChatType, type Update, type UpdateRequest } from '@/y360api/bot';
import { obscene } from '@/y360api/bot/types/obscene';
import GPTAPI from '@/y360api/gpt/GPTAPI';
import { DeleteMail, SearchMail } from '@/y360api/imap/ImapMethods';
import { createMeeting } from '@/y360api/telemost/TelemostAPI';
import createTicket from '@/y360api/tracker/TrackerAPI';
import { lang } from '@/y360api/translate';
import TranslateAPI from '@/y360api/translate/TranslateAPI';

const chatAPI = new BotChatAPI('OAuth ' + process.env.BOT_KEY);

export const POST = async (req: Request): Promise<Response> => {
  const requestJson: UpdateRequest = await req.json();
  console.log('Post request recieved');

  requestJson.updates.forEach(update => {
    console.log('Update: ', update);

    if (update.text) {
      const message = update.text.toUpperCase();

      if (message === '/HELLOBOT') {
        chatAPI.sendMessage('Я всё вижу! \u{1F440}', update);
      } else if (message === '/HELP') {
        let helpText = "";
        helpText += 'Доступные команды:';
        helpText += '\n- /hellobot - проверить работу бота.';
        helpText += '\n- /п в ответ на сообщение - перевод на русский.';
        helpText += '\n- /t в ответ на сообщение - перевод на английский.';
        helpText += '\n- /пропуск ФИО - создать задачу в трекере.';
        helpText += '\n- /встреча - создать встречу в Телемосте.';
        helpText += '\n- /gpt запрос - сгенерировать текст по теме запроса через YandexGPT.';
        helpText += '\n- /art запрос - сгенерировать изображение по теме запроса через YandexART.';
        chatAPI.sendMessage(helpText, update);
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
      } else if (message === '/ВСТРЕЧА') {
        createMeeting().then(
            result => {
              console.log('Meeting created', result);
              chatAPI.sendMessage('Создана встреча: ' + result, update);
            }
          );

      } else if (message.includes('/RECALL') && update.chat.type === ChatType.private) {
        const subject = update.text.substring(8);
        console.log('Trying to recall mimage: string, update: Updateessage from', update.from.login, 'with subject', subject);
        SearchMail(update.from.login, subject).then(toList => {
          console.log(toList);
          if (toList.length > 0) {
            toList.forEach(async to => {
              const res = await DeleteMail(to, subject, update.from.login);

              if (res) {
                console.log('Mail with subject', subject, 'deleted from', to, 'mailbox');
                chatAPI.sendMessage('Письмо для ' + to + ' - удалено', update);
              } else {
                console.log('Mail with subject', subject, 'not found in', to, 'mailbox');
                chatAPI.sendMessage('Письмо для ' + to + ' - ошибка удаления', update);
              }


            });
          } else {
            chatAPI.sendMessage('Письмо не найдено в отправленных.', update);
          }

        });


      } else if (message.includes('/GPT')) {
        const gptAPI = new GPTAPI();
        chatAPI.sendMessage('Принят запрос на генерацию текста.', update);
        gptAPI.generateText('Ты умный ассистент', update.text.substring(5)).then(
          res => {
            console.log(res.result.alternatives[0].message.text);
            chatAPI.sendMessage(res.result.alternatives[0].message.text, update);
          }
        );
      } else if (message.includes('/ART')) {
        const gptAPI = new GPTAPI();
        chatAPI.sendMessage('Принят запрос на генерацию картинки.', update);
        gptAPI.generateArt(update.text.substring(5)).then(
          operation_id => {
                console.log("Requesting operation result");
                requestOperationResult(operation_id, update, gptAPI, chatAPI);
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

const requestOperationResult = async (operation_id: string, update: Update, gptAPI: GPTAPI, chatAPI: BotChatAPI) => {
  const res = gptAPI.getArtOperation(operation_id);
  const timeOut = new Promise((resolve) => {
    setTimeout(resolve, 10000, 'Timeout done');
  });

  Promise.all([res, timeOut]).then(imageResponse => { 
    
    console.log("Wait for 10 secs + TTL");
    console.log("Operation complete: " + imageResponse[0].done);
    if (!imageResponse[0].done) {
      console.log("Retry get operation result");
      requestOperationResult(operation_id, update, gptAPI, chatAPI);
    } else {
     
      //fs.writeFileSync(`./public/generated/${operation_id}.jpg`, imageResponse[0].response.image, 'base64');
      //const hostName = process.env.HOST;
      //chatAPI.sendMessage(`${hostName}/generated/${operation_id}.jpg`, update);
      chatAPI.sendImage(imageResponse[0].response.image, update);
    }
  });
};