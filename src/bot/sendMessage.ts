import axios from 'axios';

const token = process.env.TOKEN;

export const sendMessage = async (
  chatId: number,
  message: string,
  options: object = {}
) => {
  await axios.post('https://api.telegram.org/bot' + token + '/sendMessage', {
    chat_id: chatId,
    text: message,
    ...options,
  });
};

const formatText = (text: string) => {
  return text
    .replace(/\*(.*?)\*/g, '_$1_')
    .replace(/\_\_(.*?)\_\_/g, '*$1*')
    .replace(/### (.+)/g, '*_$1_*');
};

export const formatTextToV2 = (text: string) => {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
};
