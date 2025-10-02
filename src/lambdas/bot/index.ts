import { Imsg } from '../../types';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { NAMES } from '../../const';
import { APIGatewayProxyEventV2 } from 'aws-lambda/trigger/api-gateway-proxy';

const admin = process.env.ADMIN_ID;

const client = new LambdaClient();

export const handler = async (event: APIGatewayProxyEventV2) => {
  if (!event.body) return;
  const msg: Imsg = JSON.parse(event.body).message;
  console.log(msg);
  console.log(admin);

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
