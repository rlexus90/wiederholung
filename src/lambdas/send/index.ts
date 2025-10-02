import axios from 'axios';
import { IGptAntwortVerb, IMessage, Imsg, MessageArr } from '../../types';

const token = process.env.TOKEN;

const parse_mode = 'MarkdownV2';

export const handler = async (input: IMessage) => {
  console.log(input);

  if (!input) {
    console.log('No Text');
    return;
  }

  const { chat_id, text } = input;

  const antwort: MessageArr = JSON.parse(text);

  try {
    for (const [index, str] of antwort.message.entries()) {
      await axios.post(
        'https://api.telegram.org/bot' + token + '/sendMessage',
        {
          chat_id,
          text: str,
          parse_mode,
          disable_notification: Boolean(index),
        }
      );
    }
  } catch (e) {
    console.log('Error when message processed');
    console.log(e);
    await axios.post('https://api.telegram.org/bot' + token + '/sendMessage', {
      chat_id,
      text: 'Помилка при обробці повідомлення',
      parse_mode,
    });
  }

  return { statusCode: 200 };
};
