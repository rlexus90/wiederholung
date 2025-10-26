import { Imsg } from '../../types';
import { msgHandler } from '../../bot/msgHandler';
import { sendMessage } from '../../bot/sendMessage';
import { BOT_OPTIONS } from '../../const';

export const handler = async (msg: Imsg) => {
  console.log(msg);

  const result = await msgHandler(msg);

  if (!result) return;

  const { chatId, text, additionalMSG } = result;

  try {
    if (additionalMSG)
      await sendMessage(additionalMSG.chatId, additionalMSG.text, BOT_OPTIONS);

    if (text.length > 4000) {
      await sendLongMessage(chatId, text);
    } else {
      console.log('send');

      await sendMessage(chatId, text, BOT_OPTIONS);
    }
  } catch (e) {
    console.log('Error when message processed');
    console.log(e);
  }
};

export const sendLongMessage = async (chatId: number, message: string) => {
  const chunkSize = 4000; // Limit message in Telegram
  let startIndex = 0;

  while (startIndex < message.length) {
    const chunk = message.substring(startIndex, startIndex + chunkSize);
    await sendMessage(chatId, formatText(chunk), BOT_OPTIONS);
    startIndex += chunkSize;
  }
};

const formatText = (text: string) => {
  return text
    .replace(/\*(.*?)\*/g, '_$1_')
    .replace(/\_\_(.*?)\_\_/g, '*$1*')
    .replace(/### (.+)/g, '*_$1_*');
};
