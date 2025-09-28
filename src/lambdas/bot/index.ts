import { APIGatewayProxyEventV2 } from 'aws-lambda';
import axios from 'axios';
import { Imsg } from '../../types';
import { msgHandler } from '../../bot/msgHandler';

const token = process.env.TOKEN;
const admin = process.env.ADMIN_ID;

export const handler = async (event: APIGatewayProxyEventV2) => {
  if (!event.body) return;
  const msg: Imsg = JSON.parse(event.body).message;
  console.log(msg);
  console.log(admin);

  const { chatId, text, additionalMSG } = await msgHandler(msg);

  try {
    if (additionalMSG)
      await axios.post(
        'https://api.telegram.org/bot' + token + '/sendMessage',
        {
          chat_id: additionalMSG.chatId,
          text: formatText(additionalMSG.text),
          parse_mode: 'Markdown',
        }
      );

    if (text.length > 4000) {
      await sendLongMessage(chatId, text);
    } else {
      console.log('send');
      await axios.post(
        'https://api.telegram.org/bot' + token + '/sendMessage',
        {
          chat_id: chatId,
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
