
export const POST = async (req: Request): Promise<Response> => {
  //const requestJson: UpdateRequest = await req.json();
  const reqJson = await req.json();
  console.log('Tracker request received: ' + reqJson);

  //requestJson.updates.forEach(update => {
    //console.log('Update: ', update);

/*     if (update.text) {
      const gptAPI = new GPTAPI();

      if (update.reply_to_message) {
        gptAPI.generateText('Ты умный ассистент', update.text, update.reply_to_message.text).then(
          res => {
            console.log(res.result.alternatives[0].message.text);
            chatAPI.sendMessage(res.result.alternatives[0].message.text, update);
          }
        );
      } else {
        gptAPI.generateText('Ты умный ассистент', update.text).then(
          res => {
            console.log(res.result.alternatives[0].message.text);
            chatAPI.sendMessage(res.result.alternatives[0].message.text, update);
          }
        );
      }


    } */
 // });

  return Response.json('OK');
};


