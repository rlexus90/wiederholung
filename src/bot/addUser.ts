import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as dotenv from 'dotenv';
import { NAMES, TEXT } from '../const';
import { IAntwort, Imsg } from '../types';

dotenv.config();

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const dbName = NAMES.DBname;
const ADMIN_ID = process.env.ADMIN_ID || 1;

export const addUser = async (msg: Imsg): Promise<IAntwort> => {
  const id = msg.from.id;
  console.log('add user');

  if (id != ADMIN_ID) {
    return { chatId: msg.chat.id, text: TEXT.NO_ACCESS_ADD };
  }

  const incomeCommand = msg.text || '';
  const newId = Number(incomeCommand.replace('/add', ''));

  try {
    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        userId: newId,
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }

  return {
    chatId: msg.chat.id,
    text: `Користувача ${newId} успішно доданно`,
    additionalMSG: {
      chatId: newId,
      text: TEXT.SUCCESSFUL_ADD,
    },
  };
};
