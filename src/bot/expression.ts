import { IAntwort, IExpression, Imsg } from '../types';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { schedule, TEXT } from '../const';
import { formatText } from './sendVerb';

import { getExpressionList, saveExpression } from './DbHelper';
import { sendWithDelay } from './sendWithDellay';

dotenv.config();

const GPT_KEY = process.env.GPT_KEY || '';

const openai = new OpenAI({ apiKey: GPT_KEY });

export const expression = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  console.log(' Expression ');

  try {
    console.log('Expession list');
    const expressionList = await getExpressionList(id);

    console.log(expressionList);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: TEXT.QUERY_EXPRESSION + expressionList?.join(',\\n'),
        },
      ],
    });

    const antwort = completion.choices[0].message.content as string;
    const antwortObj: IExpression = JSON.parse(antwort);

    console.log(antwortObj);

    await saveExpression(antwortObj.expression, id);

    const MsgArr = {
      message: [
        `${formatText(antwortObj.expression)}
*Пояснення DE:* ${formatText(antwortObj.meaning_de)}
*Пояснення UA* ${formatText(antwortObj.meaning_ua)}`,
        `*Порада* ${formatText(antwortObj.tip)}`,
        ...antwortObj.examples.map(
          (example) => `${formatText(example.sentence)}
_${formatText(example.translation)}_`
        ),
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
