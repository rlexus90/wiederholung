import {
  ApiGatewayV2Client,
  CreateApiCommand,
  CreateAuthorizerCommand,
  CreateDeploymentCommand,
  CreateIntegrationCommand,
  CreateRouteCommand,
  CreateStageCommand,
  ProtocolType,
} from '@aws-sdk/client-apigatewayv2';
import {
  GetFunctionCommand,
  LambdaClient,
  ListFunctionsCommand,
} from '@aws-sdk/client-lambda';
import { access, writeFile } from 'fs/promises';
import path = require('path');
import { NAMES } from '../const';

export const createApi = async () => {
  const client = new ApiGatewayV2Client({});
  const RouteKey = 'POST /message';

  try {
    const clientLambda = new LambdaClient({});
    const resp = await clientLambda.send(
      new GetFunctionCommand({
        FunctionName: NAMES.botName,
      })
    );
    const arn = resp.Configuration?.FunctionArn;

    const command = new CreateApiCommand({
      Name: NAMES.api,
      ProtocolType: ProtocolType.HTTP,
      CorsConfiguration: {
        AllowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
        ],
        AllowMethods: ['POST'],
        AllowOrigins: ['*'],
      },
    });

    const { ApiId } = await client.send(command);

    const integration = await client.send(
      new CreateIntegrationCommand({
        ApiId,
        IntegrationMethod: 'POST',
        IntegrationType: 'AWS_PROXY',
        IntegrationUri: arn,
        PayloadFormatVersion: '2.0',
      })
    );

    if (integration.IntegrationId) {
      await client.send(
        new CreateRouteCommand({
          ApiId,
          RouteKey,
          Target: `integrations/${integration.IntegrationId}`,
        })
      );
    }

    const createStageResult = await client.send(
      new CreateStageCommand({
        ApiId,
        StageName: 'prod',
      })
    );

    await client.send(
      new CreateDeploymentCommand({
        ApiId,
        StageName: createStageResult.StageName,
      })
    );

    await writeFile(path.resolve(__dirname, 'info.txt'), `${ApiId}`);
    console.log(`Api created ID: ${ApiId}`);
    return ApiId;
  } catch (err) {
    console.log(err);
  }
  return;
};
