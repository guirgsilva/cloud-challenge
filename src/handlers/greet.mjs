import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ endpoint: "http://dynamodb:8000" });

export const handler = async (event) => {
  const timestamp = new Date().toISOString();
  const id = `log_${Date.now()}`;

  const logEntry = {
    id: { S: id },
    timestamp: { S: timestamp },
    path: { S: event?.path || "" },
    method: { S: event?.httpMethod || "" },
    clientIp: { S: event?.requestContext?.identity?.sourceIp || "unknown" },
    userAgent: { S: event?.headers["User-Agent"] || "unknown" },
  };

  console.log("Log Entry to Save:", JSON.stringify(logEntry, null, 2));

  try {
    const result = await client.send(
      new PutItemCommand({
        TableName: "APILogs",
        Item: logEntry,
      })
    );
    console.log("DynamoDB Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error saving log to DynamoDB:", error);
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello from AWS Lambda!",
      timestamp,
    }),
  };
};
