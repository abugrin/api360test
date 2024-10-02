import { BotChatAPI, type Update, type UpdateRequest } from '@/y360api/bot';
import { obscene } from '@/y360api/bot/types/obscene';
import GPTAPI from '@/y360api/gpt/GPTAPI';
import { createMeeting } from '@/y360api/telemost/TelemostAPI';
import createTicket from '@/y360api/tracker/TrackerAPI';
import { lang } from '@/y360api/translate';
import TranslateAPI from '@/y360api/translate/TranslateAPI';
import Redis from "ioredis";

const chatAPI = new BotChatAPI('OAuth ' + process.env.BOT_KEY);
const redis = new Redis(
  {
    host: process.env.REDIS_HOST,
    port: 6379,
    password: process.env.REDIS_PASS,
    db: 0,
  }
);


const main_menu = [
  {
    text: 'Приветствие',
    callback_data: { cmd: '/hellobot' }
  },
  {
    text: 'Перевод текста',
    callback_data: { cmd: '/translate' }
  },
  {
    text: 'Создать задачу в трекере',
    callback_data: { cmd: '/tracker' }
  },
  {
    text: 'Создать встречу в Телемосте',
    callback_data: { cmd: '/telemost' }
  },
  {
    text: 'Использовать YandexGPT',
    callback_data: { cmd: '/gpt' }
  }
];

export const POST = async (req: Request): Promise<Response> => {
  const requestJson: UpdateRequest = await req.json();
  console.log('Post request recieved');

  console.log(await redis.ping());


  requestJson.updates.forEach(update => {
    console.log('Update: ', update);

    if (update.callback_data?.cmd) {
      const command = update.callback_data.cmd;

      if (command === '/hellobot') {
        chatAPI.sendMessage('Я всё вижу! \u{1F440}', update).then(
          () => {
            chatAPI.sendInlineKeyboard('Доступные команды', main_menu, update);
          }
        );
      } else if (command === '/translate') {
        redis.set(update.from.id, update.from.login);
        chatAPI.sendMessage('Введите текст для перевода', update);
      } else if (command === '/help') {
        let helpText = "";
        helpText += 'Доступные команды:';
        helpText += '\n- /пропуск ФИО - создать задачу в трекере.';
        helpText += '\n- /встреча - создать встречу в Телемосте.';
        helpText += '\n- /gpt запрос - сгенерировать текст по теме запроса через YandexGPT.';
        helpText += '\n- /art запрос - сгенерировать изображение по теме запроса через YandexART.';
        chatAPI.sendMessage(helpText, update);
      }
    } else if (update.text) {
      let translate_requested = false;
      redis.get(update.from.id).then(res => {
        console.log('Redis response: ', res);
        if (res) translate_requested = true;
        console.log('Is translate requested: ', translate_requested);
        if (translate_requested) {
          redis.del(update.from.id);
          translate(update, lang.ru).then(() => chatAPI.sendInlineKeyboard('Доступные команды', main_menu, update));
          
        } else {
          const message = update.text.toUpperCase();
          if (message === '/HELLOBOT') {
            chatAPI.sendInlineKeyboard('Доступные команды', main_menu, update);
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
              res => {
                console.log("Requesting operation result");
                if (res.id) {
                  requestOperationResult(res.id, update, gptAPI, chatAPI);
                }
                else {
                  chatAPI.sendMessage('Не удалось выполнить операцию:\n' + res.message, update);
                }
              }
            );

          } else if (obscene.some(v => message.includes(v))) {
            chatAPI.deleteMessage(update);
            chatAPI.sendMessage('Сообщение пользователя ' + update.from.display_name + ' удалено.', update);
          }
        }
      });

    }
  });

  return Response.json('OK');
};

const translate = async (update: Update, language: lang) => {
  if (update.text) {
    console.log('Translating: ', update.text);
    const translateAPI = new TranslateAPI();
    translateAPI.translateText(update.text, language).then(
      respText => {
        console.log('Response Text ', respText);
        if (language === lang.ru) {
          chatAPI.sendMessage('Перевод ' + respText, update);
        } else if (language === lang.en) {
          chatAPI.sendMessage('Translateion ' + respText, update);
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