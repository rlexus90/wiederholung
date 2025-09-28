import { IAntwort, Imsg, LANGUAGES } from '../types';
import * as dotenv from 'dotenv';
import { NAMES, TEXT } from '../const';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

dotenv.config();

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const dbName = NAMES.DBname;

export const langHandler = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  const lang = text.replace('/lang', '').trim().toLowerCase();
  console.log('Language', lang);

  if (!lang)
    return {
      text: await getLang(id),
      chatId: id,
    };

  return await setLang(id, lang);
};

export const getLang = async (id: number) => {
  const command = new GetCommand({
    TableName: dbName,
    Key: {
      userId: id,
    },
  });

  const response = await docClient.send(command);
  return response.Item!.lang || LANGUAGES.uk;
};

const setLang = async (id: number, lang: string): Promise<IAntwort> => {
  const language = langSet[lang];
  if (!language) return { chatId: id, text: TEXT.WRONG_LANG_QUERY };

  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        lang: language,
      },
    });
    await docClient.send(addCommand);
    return { chatId: id, text: language };
  } catch (e) {
    console.log(e);
    return { chatId: id, text: TEXT.ERROR };
  }
};

const langSet: { [key: string]: string } = {
  de: LANGUAGES.de,
  uk: LANGUAGES.uk,
  ru: LANGUAGES.ru,
};
