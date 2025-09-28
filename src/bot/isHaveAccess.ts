import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Imsg, User } from '../types';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { NAMES } from '../const';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const dbName = NAMES.DBname;

export const isHaveAccess = async (msg: Imsg) => {
  const command = new ScanCommand({
    TableName: dbName,
  });

  try {
    const responseUsers = await docClient.send(command);
    if (!responseUsers.Items) return false;

    const users: User[] = responseUsers.Items as User[];
    const user = users.filter((user) => user.userId === msg.from.id);

    if (user.length === 0) return false;

    if (user[0].Name == '' || !user[0].Name) {
      const addCommand = new PutCommand({
        TableName: dbName,
        Item: {
          userId: msg.chat.id,
          Name: msg.chat.username,
        },
      });
      await docClient.send(addCommand);
    }
  } catch (e) {
    console.log(e);
  }

  return true;
};
