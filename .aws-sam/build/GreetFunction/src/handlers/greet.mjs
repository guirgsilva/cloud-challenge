import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ 
    endpoint: "http://172.23.0.2:8000",
    region: "local",
    credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
    }
});

export const handler = async (event) => {
    const timestamp = new Date().toISOString();
    const id = `log_${Date.now()}`;

    const logEntry = {
        id: { S: id },
        timestamp: { S: timestamp },
        path: { S: event?.path || "" },
        method: { S: event?.httpMethod || "" },
        clientIp: { S: event?.requestContext?.identity?.sourceIp || "unknown" },
        userAgent: { S: event?.headers?.["User-Agent"] || "unknown" }
    };

    console.log('Attempting to save log entry:', JSON.stringify(logEntry, null, 2));

    try {
        const command = new PutItemCommand({
            TableName: "APILogs",
            Item: logEntry
        });

        const result = await client.send(command);
        console.log('Successfully saved to DynamoDB:', JSON.stringify(result, null, 2));

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                message: "Hello from AWS Lambda!",
                timestamp,
                logId: id
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                error: "Failed to save log",
                details: error.message
            })
        };
    }
};