import { TEXT } from '../const';
import { IAntwort, Imsg } from '../types';
import { addUser } from './addUser';
import { isHaveAccess } from './isHaveAccess';
import * as dotenv from 'dotenv';
import { listUsers } from './listUsers';
import { queryGPT } from './queryGPT';
import { DerDieDas } from './DerDieDas';
import {
  clearExpressionList,
  clearMistakeList,
  clearWordList,
  saveWort,
} from './DbHelper';
import { mistake } from './mistake';
import { formatText } from './sendVerb';
import { expression } from './expression';
import { quits } from './voise';
import { myStats } from './pruffAntwort';
import { prufVoice } from './prufVoice';

dotenv.config();

const ADMIN_ID = Number(process.env.ADMIN_ID) || 1;

export const msgHandler = async (msg: Imsg): Promise<void | IAntwort> => {
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
    if (msg.voice) return await prufVoice(msg);
  }

  switch (true) {
    case /\/add (.+)/.test(text):
      return await addUser(msg);
      break;
    case /\/list/.test(text):
      return await listUsers(msg);
      break;
    case /\/clear_word/.test(text):
      await clearWordList(chatId);
      return {
        chatId,
        text: 'Очищено',
      };
      break;
    case /\/clear_mistake/.test(text):
      await clearMistakeList(chatId);
      return {
        chatId,
        text: 'Очищено',
      };
    case /\/clear_redewendungen/.test(text):
      await clearExpressionList(chatId);
      return {
        chatId,
        text: 'Очищено',
      };
      break;
    case /10 Wörter/.test(text):
      return await DerDieDas(msg);
      break;
    case /Fehler/.test(text):
      return await mistake(msg);
      break;
    case /Redewendungen/.test(text):
      return await expression(msg);
      break;
    case /Voice/.test(text):
      return await quits(msg);
      break;
    case /\/info/.test(text):
      return { chatId, text: formatText(TEXT.INFO) };
      break;
    case /\/start/.test(text):
      return { chatId, text: 'Start' };
      break;
    case /\/stats/.test(text):
      return await myStats(chatId);
      break;
    default:
      return await queryGPT(msg);
  }
};
