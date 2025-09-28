import { IAntwort, Imsg } from '../types';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { TEXT } from '../const';

dotenv.config();

const GPT_KEY = process.env.GPT_KEY || '';

const openai = new OpenAI({ apiKey: GPT_KEY });

export const translateGpt = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  const query = text.replace('/пер', '');
  console.log('Translate');
  console.log(query);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        { role: 'system', content: TEXT.TRANSLATE_QUERY },
        {
          role: 'user',
          content: `${TEXT.TRANSLATE_QUERY} ${query} `,
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
  }

  return {
    chatId: id,
    text: TEXT.ERROR,
  };
};
