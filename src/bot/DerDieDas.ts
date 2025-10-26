import { IAntwort, IDerDieDas, IDerDieDasAntwort, Imsg, IType } from '../types';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { TEXT } from '../const';
import { formatText } from './sendVerb';
import { getWordList, saveWort } from './DbHelper';
import { sendWithDelay } from './sendWithDellay';

dotenv.config();

const GPT_KEY = process.env.GPT_KEY || '';

const openai = new OpenAI({ apiKey: GPT_KEY });

export const DerDieDas = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  console.log('Der Die Das');

  try {
    console.log('Word list');
    const wordList = await getWordList(id);

    console.log(wordList);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: TEXT.QUERY_10WORD + wordList?.join(',') },
      ],
    });

    const antwort = completion.choices[0].message.content as string;
    const antwortObj: IDerDieDasAntwort = JSON.parse(antwort);

    console.log(antwortObj);

    await saveWort(
      antwortObj.words.map((el) => el.word),
      id
    );

    const MsgArr = {
      message: antwortObj.words.map(
        (el) => `*${formatText(el.word)}*  ${formatText(el.translation)}
${formatText(el.part_of_speech)}
*${formatText(el.example)}*
${formatText(el.example_translation)}`
      ),
    };

    await Promise.all([
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(MsgArr),
        delay: 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(MsgArr),
        delay: 60,
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
