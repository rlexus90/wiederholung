import { IMessageDelay } from "../types";
import { SchedulerClient, CreateScheduleCommand } from "@aws-sdk/client-scheduler";
import { v4 as uuidv4 } from "uuid";

export const sendWithDelay = async (param:IMessageDelay) =>{
	const {chat_id, text,delay}=param;
}



const client = new SchedulerClient({ region: "eu-central-1" });

export const handler = async (event) => {
  // затримка у годинах (наприклад, 6 годин)
  const delayHours = event.delayHours || 6;

  // коли запустити другу Lambda
  const runAt = new Date(Date.now() + delayHours * 60 * 60 * 1000)
    .toISOString()
    .split(".")[0]; // формат YYYY-MM-DDTHH:MM:SS

  const scheduleName = `delayed-task-${uuidv4()}`;

  const command = new CreateScheduleCommand({
    Name: scheduleName,
    ScheduleExpression: `at(${runAt})`,
    FlexibleTimeWindow: { Mode: "OFF" },
    Target: {
      Arn: "arn:aws:lambda:eu-central-1:123456789012:function:SendMessageLambda", // цільова Lambda
      RoleArn: "arn:aws:iam::123456789012:role/EventBridgeSchedulerRole",
      Input: JSON.stringify({
        message: event.message || "Hello after delay!"
      })
    }
  });

  await client.send(command);

  return {
    status: "scheduled",
    runAt,
    scheduleName
  };
};