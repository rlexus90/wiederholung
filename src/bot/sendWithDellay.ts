import { IMessageDelay, MessageArr } from '../types';
import {
  SchedulerClient,
  CreateScheduleCommand,
} from '@aws-sdk/client-scheduler';

import { v4 as uuidv4 } from 'uuid';

const client = new SchedulerClient();

export const sendWithDelay = async (param: IMessageDelay) => {
  const { chat_id, text, delay } = param;

  const checkDate = new Date(Date.now() + delay * 1000 * 60 * 60);
  const hours = checkDate.getHours();

  const date =
    hours >= 22
      ? new Date(Date.now() + (delay + 14) * 1000 * 60 * 60)
      : checkDate;

  const runAt = date.toISOString().split('.')[0];

  const scheduleName = `delayed-task-${uuidv4()}`;

  const command = new CreateScheduleCommand({
    Name: scheduleName,
    ScheduleExpression: `at(${runAt})`,
    FlexibleTimeWindow: { Mode: 'OFF' },
    ActionAfterCompletion: 'DELETE',
    Target: {
      Arn: 'arn:aws:lambda:eu-west-2:540415712502:function:Send-FN',
      RoleArn: 'arn:aws:iam::540415712502:role/Lambda_basic',
      Input: JSON.stringify({
        chat_id,
        text,
      }),
    },
  });

  await client.send(command);
};
