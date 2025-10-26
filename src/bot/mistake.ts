import { IAntwort, IMistake, Imsg } from '../types';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { schedule, TEXT } from '../const';
import { formatText } from './sendVerb';

import { getMistakeList, saveMistake } from './DbHelper';
import { sendWithDelay } from './sendWithDellay';

dotenv.config();

const GPT_KEY = process.env.GPT_KEY || '';

const openai = new OpenAI({ apiKey: GPT_KEY });

export const mistake = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  console.log(' Mistake ');

  try {
    console.log('Mistake list');
    const mistakeList = await getMistakeList(id);

    console.log(mistakeList);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: TEXT.QUERY_MISTAKE + mistakeList?.join(',\\n'),
        },
      ],
    });

    const antwort = completion.choices[0].message.content as string;
    const antwortObj: IMistake = JSON.parse(antwort);

    console.log(antwortObj);

    await saveMistake(antwortObj.error_name, id);

    const MsgArr = {
      message: [
        `${formatText(antwortObj.error_name)}
*Рівень:* ${formatText(antwortObj.level)}
*Категорія* ${formatText(antwortObj.category)}`,
        `*Невірно* ${formatText(antwortObj.wrong_example)}`,
        `*Правильний варіант* ${formatText(antwortObj.correct_example)}`,
        ...antwortObj.examples.map(
          (example) => `${formatText(example.de)}
_${formatText(example.ua)}_`
        ),
        ...antwortObj.tips.map((str) => formatText(str)),
      ],
    };

    await Promise.all([
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(MsgArr),
        delay: schedule.get(1) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(MsgArr),
        delay: schedule.get(2) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(MsgArr),
        delay: schedule.get(3) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(MsgArr),
        delay: schedule.get(4) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(MsgArr),
        delay: schedule.get(5) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(MsgArr),
        delay: schedule.get(6) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(MsgArr),
        delay: schedule.get(7) || 0,
      }),
    ]);

    return {
      chatId: id,
      text: 'Запит успішний',
    };
  } catch (e) {
    console.log(e);
    return {
      chatId: id,
      text: TEXT.ERROR,
    };
  }
};
