import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const DOCKER_DYNAMODB_ENDPOINT = "http://dynamodb:8000"; // Using container name as hostname
const IS_LOCAL = process.env.AWS_SAM_LOCAL === 'true';

const client = new DynamoDBClient({
    endpoint: IS_LOCAL ? DOCKER_DYNAMODB_ENDPOINT : undefined,
    region: IS_LOCAL ? 'local' : process.env.AWS_REGION,
    ...(IS_LOCAL && {
        credentials: {
            accessKeyId: 'dummy',
            secretAccessKey: 'dummy'
        }
    })
});

export const ddbDocClient = DynamoDBDocumentClient.from(client);