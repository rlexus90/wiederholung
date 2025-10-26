import { IAntwort, Imsg, IQuits } from '../types';
import OpenAI from 'openai';
import axios from 'axios';
import { TEXT } from '../const';
import { createWriteStream, createReadStream } from 'node:fs';
import { get } from 'https';

import { getQuits } from './DbHelper';
import { formatText } from './sendVerb';

const GPT_KEY = process.env.GPT_KEY || '';
const openai = new OpenAI({ apiKey: GPT_KEY });

const token = process.env.TOKEN;

const inputFilePath = '/tmp/voice.ogg';

export const prufVoice = async (msg: Imsg): Promise<IAntwort> => {
  const chatId = msg.chat.id;
  console.log('Pruf Voice');

  try {
    const quits: IQuits = await getQuits(chatId);

    const fileResp = await axios.get(
      `https://api.telegram.org/bot${token}/getFile`,
      {
        params: { file_id: msg.voice?.file_id },
      }
    );

    if (fileResp.status !== 200) return { chatId, text: TEXT.ERROR };

    const fileUrl = `https://api.telegram.org/file/bot${token}/${fileResp.data.result.file_path}`;

    await downloadFile(fileUrl);

    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(inputFilePath),
      model: 'gpt-4o-mini-transcribe',
      response_format: 'text',
      language: 'de',
    });

    console.log(transcription);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Оригінал тексту: "${quits.phrase}"
Транскрибований текст користувача: "${transcription}"
Будь ласка, порівняй їх. Напиши:
1 Відсоткову схожість вимови (за змістом та звучанням),
2 Короткий коментар українською про помилки або неточності у вимові.`,
        },
      ],
    });

    const antwort = completion.choices[0].message.content as string;
    console.log(antwort);

    return {
      chatId,
      text: formatText(antwort),
    };
  } catch (e) {
    console.log(e);
  }

  return {
    chatId,
    text: TEXT.ERROR,
  };
};

const downloadFile = async (url: string) => {
  return new Promise<void>((res) => {
    const voice = createWriteStream(inputFilePath);

    get(url, (resp) => {
      console.log(resp.statusCode);
      resp.pipe(voice);
    });
    voice.on('close', () => {
      console.log('file download');
      res();
    });

    voice.on('finish', async () => {
      voice.close();
    });
  });
};
