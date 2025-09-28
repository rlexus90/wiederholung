import TelegramBot from 'node-telegram-bot-api';
import { msgHandler } from './bot/msgHandler';
import { Imsg } from './types';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const TEST_TOKEN = process.env.TOKEN || '';

const bot = new TelegramBot(TEST_TOKEN, { polling: true });

// bot.onText(/\/echo (.+)/, (msg, match) => {
//   console.log(msg);

//   const chatId = msg.chat.id;
//   if (!match) return;
//   const resp = match[1];

//   console.log(msg);

//   bot.sendMessage(chatId, resp);
// });

bot.on('message', async (msg) => {
  console.log(msg);
  try {
    const { chatId, text, additionalMSG } = await msgHandler(
      msg as unknown as Imsg
    );

    const formatText = text
      .replace(/\*(.*?)\*/g, '_$1_')
      .replace(/\_\_(.*?)\_\_/g, '*$1*')
      .replace(/### (.+)/g, '*$1*');

    if (additionalMSG) {
      const formatText = additionalMSG.text
        .replace(/\*(.*?)\*/g, '_$1_')
        .replace(/\_\_(.*?)\_\_/g, '*$1*')
        .replace(/### (.+)/g, '*$1*');

      bot.sendMessage(additionalMSG.chatId, formatText);
    }

    bot.sendMessage(chatId, formatText || '', {
      parse_mode: 'Markdown',
    });
  } catch {
    console.log('Error when message processed');
  }
});
