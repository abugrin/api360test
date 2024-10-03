import { BotChatAPI, type Update, type UpdateRequest } from '@/y360api/bot';
import { obscene } from '@/y360api/bot/types/obscene';
import GPTAPI from '@/y360api/gpt/GPTAPI';
import { createMeeting } from '@/y360api/telemost/TelemostAPI';
import createTicket from '@/y360api/tracker/TrackerAPI';
import Redis from "ioredis";
import { menuMain, translate } from './bot';

const chatAPI = new BotChatAPI('OAuth ' + process.env.BOT_KEY);
const redis = new Redis(
  {
    host: process.env.REDIS_HOST,
    port: 6379,
    password: process.env.REDIS_PASS,
    db: 0,
  }
);

export const POST = async (req: Request): Promise<Response> => {
  const requestJson: UpdateRequest = await req.json();
  console.log('Post request recieved');

  console.log(await redis.ping());


  requestJson.updates.forEach(update => {
    console.log('Update: ', update);

    if (update.callback_data?.cmd) {
      processCommand(update.callback_data.cmd, update);
    } else if (update.text) {
      redis.get(update.from.id).then(res => {
        if (res) processTranslate(update);
        else processText(update);
      });
    }
  });

  return Response.json('OK');
};

const processCommand = (command: string, update: Update) => {
  if (command === '/hellobot') {
    chatAPI.sendMessage('Я всё вижу! \u{1F440}', update).then(
      () => {
        chatAPI.sendInlineKeyboard('Доступные команды', menuMain, update);
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
};

const processTranslate = (update: Update)=> {
    redis.del(update.from.id);
    translate(update).then(text => {
      chatAPI.sendMessage('Перевод ' + text, update).then(
        () => chatAPI.sendInlineKeyboard('Доступные команды', menuMain, update)
      );
    });
};


const processText = (update: Update) => {
  const message = update.text.toUpperCase();
  if (message === '/HELLOBOT') {
    chatAPI.sendInlineKeyboard('Доступные команды', menuMain, update);
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