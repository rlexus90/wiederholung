import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { IAntwort, Imsg } from '../types';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { NAMES, TEXT } from '../const';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const dbName = NAMES.DBname;

const GPT_KEY = process.env.GPT_KEY || '';

const openai = new OpenAI({ apiKey: GPT_KEY });

export const saveWort = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  const wort = text.replace('/save', '').trim();
  console.log(wort);

  if (wort.length === 0)
    return {
      chatId: id,
      text: TEXT.ERROR,
    };

  try {
    await save(wort, id);
    return { chatId: id, text: `${wort} added` };
  } catch (e) {
    console.log(e);
    return {
      chatId: id,
      text: TEXT.ERROR,
    };
  }
};

export const wordList = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  const command = new GetCommand({
    TableName: dbName,
    Key: {
      userId: id,
    },
  });

  try {
    const list = await docClient.send(command);

    const user = list.Item;
    if (!user) throw Error('No users');
    const worts = (user.WS as string[]).map((str) =>
      str.includes('/') ? '' : str.toLowerCase()
    );

    const WS = [...new Set(worts)];
    console.log(WS);

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        WS,
      },
    });
    await docClient.send(addCommand);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      temperature: 0.3,
      messages: [
        { role: 'system', content: TEXT.SYSTEM_QUERY },
        { role: 'system', content: TEXT.LIST_QUERY },
        {
          role: 'user',
          content: WS.join('\n'),
        },
      ],
    });

    const antwort = completion.choices[0].message.content as string;
    console.log(antwort);
    return {
      chatId: id,
      text: antwort || TEXT.ERROR,
    };
  } catch (e) {
    console.log(e);
    return {
      chatId: id,
      text: TEXT.ERROR,
    };
  }
};

export const save = async (wort: string, id: number) => {
  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;
    if (!user) throw Error('No users');

    const newWS = Array.isArray(user.WS) ? user.WS : [];
    newWS.push(wort);

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        WS: newWS,
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }
};
