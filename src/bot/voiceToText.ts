import { IAntwort, Imsg } from '../types';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { TEXT } from '../const';
import { createWriteStream, createReadStream } from 'node:fs';
import { get } from 'https';
import { getLang } from './languageHelp';

dotenv.config();

const GPT_KEY = process.env.GPT_KEY || '';
const openai = new OpenAI({ apiKey: GPT_KEY });

const TOKEN = process.env.TEST_TOKEN
  ? process.env.TEST_TOKEN
  : process.env.TOKEN;

const inputFilePath = '/tmp/voice.oga';

export const voiceToText = async (msg: Imsg): Promise<IAntwort> => {
  const chatId = msg.chat.id;
  console.log('Voice to text');

  try {
    const fileResp = await axios.get(
      `https://api.telegram.org/bot${TOKEN}/getFile`,
      {
        params: { file_id: msg.voice?.file_id },
      }
    );

    if (fileResp.status !== 200) return { chatId, text: TEXT.ERROR };

    const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${fileResp.data.result.file_path}`;

    await downloadFile(fileUrl);

    const language = await getLang(chatId);
    console.log(language);

    const transcription = (await openai.audio.transcriptions.create({
      file: createReadStream(inputFilePath),
      model: 'whisper-1',
      response_format: 'text',
      language,
    })) as unknown as string;

    console.log(transcription);

    return {
      chatId,
      text: transcription,
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
