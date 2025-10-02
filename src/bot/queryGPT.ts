import { IAntwort, Imsg, IType } from '../types';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { TEXT } from '../const';
import { sendVerb } from './sendVerb';
import { sendNomen } from './sendNomen';
import { sendAdj } from './sendAdj';
import { sendMessage } from '../lambdas/GptWorker';

dotenv.config();

const GPT_KEY = process.env.GPT_KEY || '';

const openai = new OpenAI({ apiKey: GPT_KEY });

export const queryGPT = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  console.log('Basic function');

  try {
    if (text.split(' ').length > 1) {
      // const completion = await openai.chat.completions.create({
      //   model: 'gpt-4o-mini-2024-07-18',
      //   temperature: 0.3,
      //   messages: [
      //     { role: 'system', content: TEXT.SYSTEM_QUERY },
      //     { role: 'system', content: TEXT.QUERY_SATZ },
      //     {
      //       role: 'user',
      //       content: `${text}`,
      //     },
      //   ],
      // });
      // const antwort = completion.choices[0].message.content as string;
      // console.log(completion.choices[0].message.content);
      // return {
      //   chatId: id,
      //   text: `${antwort}`,
      // };
    } else {
      const parameters = await returnResult(text);
      const parametersObj: IType = JSON.parse(parameters);
      console.log(parametersObj);

      sendMessage(id, parameters);

      if (parametersObj.type === 'verb')
        await sendVerb(parametersObj, msg, openai);
      else {
        if (parametersObj.type === 'nomen')
          await sendNomen(parametersObj, msg, openai);
        else {
          if (parametersObj.type === 'adjektive')
            await sendAdj(parametersObj, msg, openai);
          else {
            return {
              chatId: id,
              text: 'Я не зміг визначити тип слова. Спробуйте ще раз.',
            };
          }
        }
      }

      return {
        chatId: id,
        text: 'Запит успішний',
      };
    }
  } catch (e) {
    console.log(e);
    return {
      chatId: id,
      text: TEXT.ERROR,
    };
  }

  return {
    chatId: id,
    text: TEXT.ERROR,
  };
};

const returnResult = async (msg: string) => {
  console.log('send message');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini-2024-07-18',
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: TEXT.QUERY_TYPE },
      {
        role: 'user',
        content: msg,
      },
    ],
  });

  const antwort = completion.choices[0].message.content as string;
  return antwort;
};
