import {
  BOT_OPTIONS,
  intonation,
  languageLevel,
  reply_markup,
  TEXT,
} from '../const';
import { Imsg, IStats, IQuits } from '../types';
import { getQuits, getStats, saveQuits } from './DbHelper';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { sendMessage, sendVoice } from './sendMessage';
import { formatText } from './sendVerb';
import { writeFileSync } from 'node:fs';

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
Ти — професійний викладач німецької мови для україномовних учнів, який тренує розуміння німецької мови на слух і читання.

1. Згенеруй **німецьку фразу (2–4 речення)** рівня мови ${languageLevel.get(stats.level)} та її **точний переклад українською**. 
   Фраза має бути **природною, побутовою або типовою для реального спілкування**, може включати **складну лексику або специфіку робочого середовища**. 
   Фраза повинна бути **живою і реалістичною**, як у реальному мовленні.

2. Створи **4 варіанти коротких пояснень українською**, що описують зміст фрази:
   - **1 варіант повністю вірний**,
   - **3 інші логічно схожі, але невірні**, не надто очевидні, щоб користувач мав вибір.
   
3. Якщо користувач передав масив попередніх фраз (${quits.phrase}), **не використовуй їх повторно**.

4. **Перемішай порядок варіантів випадковим чином**. 
Правильний варіант не повинен частіше потрапляти на перше місце ніж на інші. 
Укажи **номер правильного варіанту** після перемішування (число від 1 до 4).

5. **Відповідь повинна бути строго у форматі JSON**:
{
  "phrase": "згенерована німецька фраза",
  "translate": "переклад фрази українською",
  "variant1": "українське пояснення варіанту 1",
  "variant2": "українське пояснення варіанту 2",
  "variant3": "українське пояснення варіанту 3",
  "variant4": "українське пояснення варіанту 4",
  "trueAntwort": "номер вірного варіанту (число)"
}

6. **Не додавай ніяких коментарів або тексту поза JSON**.
7. Став акцент на **реалістичність та складність для розуміння**, щоб фраза була корисною для тренування слуху та читання.
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

    await voiceGenerate(antwortObj.phrase, id);

    // await sendMessage(id, antwortObj.phrase);
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

export const voiceGenerate = async (str: string, id: number) => {
  const filePath = '/tmp/speech.ogg';

  const variant = Math.round(Math.random() * 11);

  try {
    const ttsResponse = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: 'shimmer', // alloy
      input: str,
      response_format: 'opus',
      instructions: intonation.get(variant),
    });

    const buffer = Buffer.from(await ttsResponse.arrayBuffer());

    writeFileSync(filePath, new Uint8Array(buffer));

    const formData = new FormData();
    formData.append('chat_id', id + '');
    formData.append('voice', new Blob([buffer]), 'speech.ogg');

    await sendVoice(formData);
  } catch (e) {
    console.log(e);
  }
};
