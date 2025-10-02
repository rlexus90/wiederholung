import { TEXT } from '../const';
import { IAntwort, Imsg } from '../types';
import { addUser } from './addUser';
import { isHaveAccess } from './isHaveAccess';
import * as dotenv from 'dotenv';
import { listUsers } from './listUsers';
import { queryGPT } from './queryGPT';

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

  switch (true) {
    case /\/add (.+)/.test(text):
      return await addUser(msg);
      break;
    case /\/list/.test(text):
      return await listUsers(msg);
      break;
    case /\/info/.test(text):
      return { chatId, text: TEXT.INFO };
      break;
    default:
      return await queryGPT(msg);
  }
};
