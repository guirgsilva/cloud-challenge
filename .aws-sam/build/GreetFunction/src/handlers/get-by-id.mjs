import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const getDynamoDBConfig = () => {
    if (process.env.AWS_SAM_LOCAL === 'true') {
        return {
            endpoint: 'http://dynamodb:8000',
            region: 'local',
            credentials: {
                accessKeyId: 'dummy',
                secretAccessKey: 'dummy'
            },
            forcePathStyle: true
        };
    }
    return {
        region: process.env.AWS_REGION
    };
};

const client = new DynamoDBClient(getDynamoDBConfig());
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const getByIdHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
    }

    const id = event.pathParameters.id;
    console.info('Getting item with id:', id);

    try {
        const params = {
            TableName: 'APILogs',
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id
            }
        };

        const data = await ddbDocClient.send(new QueryCommand(params));
        console.log('Query result:', JSON.stringify(data, null, 2));

        if (!data.Items || data.Items.length === 0) {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: `Item with id ${id} not found`
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data.Items[0])
        };
    } catch (err) {
        console.error('Error:', {
            message: err.message,
            code: err.code,
            statusCode: err.$metadata?.httpStatusCode,
            stack: err.stack
        });

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Error retrieving item',
                error: err.message,
                id: id,
                config: getDynamoDBConfig()
            })
        };
    }
};