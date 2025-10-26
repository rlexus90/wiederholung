import { ICallback, Imsg } from '../../types';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { NAMES } from '../../const';
import { APIGatewayProxyEventV2 } from 'aws-lambda/trigger/api-gateway-proxy';
import { pruffAntwort } from '../../bot/pruffAntwort';

const admin = process.env.ADMIN_ID;

const client = new LambdaClient();

export const handler = async (event: APIGatewayProxyEventV2) => {
  if (!event.body) return { statusCode: 400, body: 'Empty body' };

  console.log(event.body);
  const body = JSON.parse(event.body);

  if (body.callback_query) {
    const callback: ICallback = body.callback_query;

    try {
      await pruffAntwort(callback);
      return { statusCode: 200 };
    } catch (e) {
      console.log(e);
    }
  }

  const msg: Imsg = body.message;
  console.log(msg);

  try {
    await client.send(
      new InvokeCommand({
        FunctionName: NAMES.worker,
        InvocationType: 'Event',
        Payload: Buffer.from(JSON.stringify(msg)),
      })
    );
  } catch (e) {
    console.log(e);
  }

  return { statusCode: 200 };
};
