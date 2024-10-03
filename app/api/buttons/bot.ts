import { Update } from "@/y360api/bot";
import { lang } from "@/y360api/translate";
import TranslateAPI from "@/y360api/translate/TranslateAPI";

export const menuMain = [
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

  export const translate = async (update: Update) : Promise<string> => {

    console.log('Translating: ', update.text);
    const translateAPI = new TranslateAPI();
    const respText = await translateAPI.translateText(update.text, lang.ru);
    console.log('Translate API Response Text: ', respText);

    return respText;
};