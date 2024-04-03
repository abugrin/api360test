Yandex API 360 Test Bot

Chat bot:
https://server_address/api/bot

Test commands:

> /help
> /hellobot

> Reply yo message
    > /п -> translate to russian
    > /t -> translate to english

> Supported direct chat with bots
> Supported replies to thread from bot

Required OAuth Keys:
Place in enviroment variables .env.local for example

TRACKER_KEY=Ключ OAuth для доступа к трекеру 
TRACKER_ORG=Org ID трекера //99999
TRACKER_QUEUE=Очередь в трекере //PROPUSK
BOT_KEY=OAuth ключ бота - получаем при создании бота в админке y360
TRANSLATE_FOLDER=folder в cloud организации // находим его в Yandex Cloud
TRANSLATE_API_KEY=API-Key для доступа к сервису перевода // https://cloud.yandex.ru/ru/docs/iam/operations/api-key/create
GPT_FOLDER=folder в cloud организации // находим его в Yandex Cloud. Обычно тот же, что и TRANSLATE
GPT_API_KEY=API-Key для доступа к сервису Yandex GPT
GPT_BOT_KEY=OAuth ключ бота - получаем при создании бота в админке y360
CLIENT_ID=Service App Client ID
CLIENT_SECRET=Service App Secret
