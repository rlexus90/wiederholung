import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { NAMES, TEXT } from '../const';
import { Imsg, IAntwort, User } from '../types';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const dbName = NAMES.DBname;
const ADMIN_ID = process.env.ADMIN_ID || 1;

export const listUsers = async (msg: Imsg): Promise<IAntwort> => {
  const id = msg.from.id;
  if (id != ADMIN_ID) {
    return { chatId: id, text: TEXT.NO_ACCESS_ACTION };
  }

  const command = new ScanCommand({
    TableName: dbName,
  });

  try {
    const responseUsers = await docClient.send(command);
    if (!responseUsers.Items) return { text: TEXT.ERROR, chatId: id };

    const users: User[] = responseUsers.Items as User[];
    console.log(users);

    const usersList = users.map(
      (user) => `id: ${user.userId}; Name: ${user.Name}; lang: ${user.lang}`
    );
    const text = usersList.join('\n');
    return {
      chatId: id,
      text,
    };
  } catch (e) {
    console.log(e);
  }
  return {
    chatId: id,
    text: TEXT.ERROR,
  };
};
