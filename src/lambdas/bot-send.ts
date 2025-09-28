import { readFile } from 'fs/promises';
import path = require('path');
import { NAMES } from '../const';
import {
  Architecture,
  CreateFunctionCommand,
  LambdaClient,
  PackageType,
  Runtime,
  UpdateFunctionCodeCommand,
} from '@aws-sdk/client-lambda';

import * as dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.TOKEN || '';
const ADMIN_ID = process.env.ADMIN_ID || '';
const GPT_KEY = process.env.GPT_KEY || '';

export const botSend = async () => {
  const client = new LambdaClient({});
  const code = await readFile(
    path.resolve(__dirname, '../../dist', 'send-bot.zip')
  );
  const ZipFile = new Uint8Array(code);

  const FunctionName = NAMES.send_fn;

  const create = new CreateFunctionCommand({
    Code: { ZipFile },
    FunctionName,
    Role: 'arn:aws:iam::540415712502:role/Lambda_basic',
    Architectures: [Architecture.arm64],
    Handler: 'bot/index.handler',
    PackageType: PackageType.Zip,
    Runtime: Runtime.nodejs20x,
    Environment: {
      Variables: { TOKEN, ADMIN_ID: ADMIN_ID.toString(), GPT_KEY },
    },
  });

  const update = new UpdateFunctionCodeCommand({
    ZipFile,
    FunctionName,
    Architectures: [Architecture.arm64],
  });

  try {
    await client.send(update);
    console.log('Bot-lambda updated');
  } catch {
    try {
      await client.send(create);
      console.log('Bot-lambda created');
    } catch (err) {
      console.log(err);
    }
  }
};
