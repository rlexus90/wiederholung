import axios from 'axios';

const token = process.env.TOKEN;

const url = 'https://api.telegram.org/bot' + token + '/sendMessage';
const voiceUrl = 'https://api.telegram.org/bot' + token + '/sendVoice';

export const sendMessage = async (
  chatId: number,
  message: string,
  options: object = {}
) => {
  await axios.post(url, {
    chat_id: chatId,
    text: message,
    ...options,
  });
};

export const sendVoice = async (formData: FormData) => {
  await axios.post(voiceUrl, formData);
};
