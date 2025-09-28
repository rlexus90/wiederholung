import axios from 'axios';
import { IMessage, Imsg } from '../../types';

const token = process.env.TOKEN;
const admin = process.env.ADMIN_ID;

export const handler = async (event: IMessage) => {
  if (!event) {
    console.log('No Text');
    return;
  }

  const { chat_id, text } = event;

  try {
    if (text.length > 4000) {
      await sendLongMessage(+chat_id, text);
    } else {
      console.log('send');
      await axios.post(
        'https://api.telegram.org/bot' + token + '/sendMessage',
        {
          chat_id: chat_id,
          text: formatText(text),
          parse_mode: 'Markdown',
        }
      );
    }
  } catch (e) {
    console.log('Error when message processed');
    console.log(e);
  }

  return { statusCode: 200 };
};

const sendLongMessage = async (chatId: number, message: string) => {
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

const formatText = (text: string) => {
  return text
    .replace(/\*(.*?)\*/g, '_$1_')
    .replace(/\_\_(.*?)\_\_/g, '*$1*')
    .replace(/### (.+)/g, '*_$1_*');
};
