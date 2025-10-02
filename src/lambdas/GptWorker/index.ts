import axios from 'axios';
import { Imsg } from '../../types';
import { msgHandler } from '../../bot/msgHandler';

const token = process.env.TOKEN;

export const handler = async (msg: Imsg) => {
  console.log(msg);

  const { chatId, text, additionalMSG } = await msgHandler(msg);

  try {
    if (additionalMSG)
      await sendMessage(additionalMSG.chatId, additionalMSG.text);

    if (text.length > 4000) {
      await sendLongMessage(chatId, text);
    } else {
      console.log('send');

      await sendMessage(chatId, text);
    }
  } catch (e) {
    console.log('Error when message processed');
    console.log(e);
  }

  return { statusCode: 200 };
};

export const sendLongMessage = async (chatId: number, message: string) => {
  const chunkSize = 4000; // Limit message in Telegram
  let startIndex = 0;

  while (startIndex < message.length) {
    const chunk = message.substring(startIndex, startIndex + chunkSize);
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: formatText(chunk),
      parse_mode: 'Markdown',
    });
    startIndex += chunkSize;
  }
};

export const sendMessage = async (chatId: number, message: string) => {
  await axios.post('https://api.telegram.org/bot' + token + '/sendMessage', {
    chat_id: chatId,
    text: formatText(message),
    parse_mode: 'Markdown',
  });
};

const formatText = (text: string) => {
  return text
    .replace(/\*(.*?)\*/g, '_$1_')
    .replace(/\_\_(.*?)\_\_/g, '*$1*')
    .replace(/### (.+)/g, '*_$1_*');
};
