import {
  ApiGatewayV2Client,
  GetApiCommand,
} from '@aws-sdk/client-apigatewayv2';
import path = require('path');
import { access, readFile, rm } from 'fs/promises';
import { createApi } from './createApi';

export const api = async () => {
  const client = new ApiGatewayV2Client();
  const infoFile = path.resolve(__dirname, 'info.txt');
  try {
    await access(infoFile);
    const key = await readFile(infoFile, {
      encoding: 'utf-8',
    });
    try {
      await client.send(
        new GetApiCommand({
          ApiId: key,
        })
      );
      console.log('API exist');
    } catch {
      await rm(infoFile);
      await createApi();
    }
  } catch {
    await createApi();
  }
};

export const returnApiId = async () => {
  const infoFile = path.resolve(__dirname, 'info.txt');

  try {
    await access(infoFile);
    const key = await readFile(infoFile, {
      encoding: 'utf-8',
    });
    return key;
  } catch {
    return;
  }
};
