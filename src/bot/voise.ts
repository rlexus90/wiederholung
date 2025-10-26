import { BOT_OPTIONS, reply_markup, TEXT } from '../const';
import { Imsg, IAntwort, languageLevel, IStats, IQuits } from '../types';
import { getQuits, getStats, saveQuits } from './DbHelper';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { sendMessage } from './sendMessage';
import { formatText } from './sendVerb';

dotenv.config();

const GPT_KEY = process.env.GPT_KEY || '';

const openai = new OpenAI({ apiKey: GPT_KEY });

export const quits = async (msg: Imsg) => {
  const {
    text,
    chat: { id },
  } = msg;

  console.log(' Quits ');

  try {
    const stats: IStats = await getStats(id);
    const quits: IQuits = await getQuits(id);

    const query = `
Ти — професійний викладач німецької мови, який допомагає україномовним учням тренувати розуміння німецької мови.

1. Згенеруй німецьку фразу (2–4 речення) рівня мови ${languageLevel.get(stats.level)}, та її переклад. 
Фраза має бути природною, побутовою або типовою для реального спілкування.

2. Створи 4 варіанти коротких пояснень українською мовою, про що йдеться у фразі:
- один варіант повинен бути повністю вірним,
- три інші мають бути логічно схожими, але невірними (не занадто очевидно помилковими).

3. Відповідь має бути строго у форматі JSON:
{
  "phrase": "згенерована німецька фраза",
	"translate": "переклад фрази украінською",
  "variant1": "українське пояснення варіанту 1",
  "variant2": "українське пояснення варіанту 2",
  "variant3": "українське пояснення варіанту 3",
  "variant4": "українське пояснення варіанту 4",
  "trueAntwort": "номер вірного варіанту (число)"
}

4. Якщо користувач передав масив попередніх фраз (${quits.phrase}), **не використовуй їх повторно**.

5. Перед формуванням остаточної відповіді перемішай порядок варіантів випадковим чином, щоб правильна відповідь
 рідко була першою.

 6. Укажи номер правильного варіанту після перемішування (число від 1 до 4).

Не додавай ніяких коментарів, лише JSON.
	`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      // temperature: 0.8,
      // max_tokens: 400,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: query,
        },
      ],
    });

    const antwort = completion.choices[0].message.content as string;
    const antwortObj: IQuits = JSON.parse(antwort);

    await saveQuits(antwortObj, id);

    await sendMessage(id, antwortObj.phrase);
    await sendMessage(id, antwortObj.variant1);
    await sendMessage(id, antwortObj.variant2);
    await sendMessage(id, antwortObj.variant3);
    await sendMessage(id, formatText(antwortObj.variant4), {
      ...BOT_OPTIONS,
      reply_markup,
    });

    console.log(antwortObj);
  } catch (e) {
    console.log(e);
    return {
      chatId: id,
      text: TEXT.ERROR,
    };
  }
};
