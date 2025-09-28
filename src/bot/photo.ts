import { IAntwort, Imsg } from '../types';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { TEXT } from '../const';
import { createWriteStream, createReadStream } from 'node:fs';
import { get } from 'https';

dotenv.config();

const GPT_KEY = process.env.GPT_KEY || '';
const openai = new OpenAI({ apiKey: GPT_KEY });

const TOKEN = process.env.TEST_TOKEN
  ? process.env.TEST_TOKEN
  : process.env.TOKEN;

export const photo = async (msg: Imsg): Promise<IAntwort> => {
  const chatId = msg.chat.id;
  console.log('Photo');
  const photos = msg.photo
    ?.sort((a, b) => b.file_size - a.file_size)
    .filter((img) => img.file_size <= 200000);
  if (!photos) return { chatId, text: TEXT.ERROR };

  const photo = photos[0];
  console.log(photo);

  try {
    const fileResp = await axios.get(
      `https://api.telegram.org/bot${TOKEN}/getFile`,
      {
        params: { file_id: photo.file_id },
      }
    );

    if (fileResp.status !== 200) return { chatId, text: TEXT.ERROR };

    const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${fileResp.data.result.file_path}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: TEXT.IMAGE_QUERY },
            {
              type: 'image_url',
              image_url: {
                url: fileUrl,
              },
            },
          ],
        },
      ],
    });

    const description = response.choices[0].message.content as string;
    console.log(description);

    return {
      chatId,
      text: description,
    };
  } catch (e) {
    console.log(e);
    return {
      chatId,
      text: TEXT.ERROR,
    };
  }
};
