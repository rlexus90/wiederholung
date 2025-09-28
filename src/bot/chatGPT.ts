import { IAntwort, Imsg } from '../types';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { TEXT } from '../const';

dotenv.config();

const GPT_KEY = process.env.GPT_KEY || '';

const openai = new OpenAI({ apiKey: GPT_KEY });

export const chatGPT = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  console.log('Chat GPT');

  const query = text.replace('/запит', '');
  console.log(query);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        {
          role: 'user',
          content: `${query} `,
        },
      ],
    });

    const antwort = completion.choices[0].message.content as string;
    console.log(completion.choices[0].message.content);
    return {
      chatId: id,
      text: antwort,
    };
  } catch (e) {
    console.log(e);
    return {
      chatId: id,
      text: TEXT.ERROR,
    };
  }
};
