import {
  ApiGatewayV2Client,
  DeleteApiCommand,
} from '@aws-sdk/client-apigatewayv2';
import { DeleteFunctionCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { returnApiId } from './api/api';
import { NAMES } from './const';

const destroy = async () => {
  const Lambda = new LambdaClient();
  const Api = new ApiGatewayV2Client();
  const ApiId = await returnApiId();
  if (ApiId) await Api.send(new DeleteApiCommand({ ApiId }));
  await Lambda.send(new DeleteFunctionCommand({ FunctionName: NAMES.botName }));

  console.log('Resources deleted');
};

destroy();
