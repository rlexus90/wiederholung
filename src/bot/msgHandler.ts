import { TEXT } from '../const';
import { IAntwort, Imsg } from '../types';
import { addUser } from './addUser';
import { isHaveAccess } from './isHaveAccess';
import * as dotenv from 'dotenv';
import { listUsers } from './listUsers';
import { queryGPT } from './queryGPT';
import { voiceToText } from './voiceToText';
import { translateGpt } from './translate';
import { langHandler } from './languageHelp';
import { chatGPT } from './chatGPT';
import { photo } from './photo';
import { saveWort, wordList } from './saveWort';

dotenv.config();

const ADMIN_ID = Number(process.env.ADMIN_ID) || 1;

export const msgHandler = async (msg: Imsg): Promise<IAntwort> => {
  const chatId = msg.chat.id;
  const text = msg.text;

  const access = await isHaveAccess(msg as unknown as Imsg);
  if (!access) {
    const id = msg.chat.id;
    return {
      chatId: id,
      text: TEXT.NO_ACCESS,
      additionalMSG: {
        chatId: ADMIN_ID,
        text: `Користувач ${msg.from.username} з ID ${id} хоче доєднатися до чату. Щоб додати користувача використайте команду
		'/add'`,
      },
    };
  }

  if (!text) {
    if (msg.voice) return await voiceToText(msg);
    if (msg.photo) return await photo(msg);
  }

  // switch (true) {
  //   case /\/add (.+)/.test(text):
  //     return await addUser(msg);
  //     break;
  //   case /\/list/.test(text):
  //     return await listUsers(msg);
  //     break;
  //   case /\/lang/.test(text):
  //     return await langHandler(msg);
  //     break;
  //   case /\/info/.test(text):
  //     return { chatId, text: TEXT.INFO };
  //     break;
  //   case /\/пер (.+)/.test(text):
  //     return await translateGpt(msg);
  //     break;
  //   case /\/запит (.+)/.test(text):
  //     return await chatGPT(msg);
  //     break;
  //   case /\/save (.+)/.test(text):
  //     return await saveWort(msg);
  //     break;
  //   case /\/Save (.+)/.test(text):
  //     return await saveWort(msg);
  //     break;
  //   case /\/getlist/.test(text):
  //     return await wordList(msg);
  //     break;
  //   default:
  //     return await queryGPT(msg);
  // }

  return {
    chatId,
    text,
  };
};
