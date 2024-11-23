import { jest } from '@jest/globals';
import { handler } from '../../../src/handlers/greet.mjs';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

describe('Test greetHandler', () => {
    const ddbMock = mockClient(DynamoDBClient);
    
    beforeEach(() => {
        ddbMock.reset();
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-01-01'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return greeting and save log to DynamoDB', async () => {
        ddbMock.on(PutItemCommand).resolves({});

        const event = {
            path: '/greet',
            httpMethod: 'GET',
            requestContext: {
                identity: {
                    sourceIp: '127.0.0.1'
                }
            },
            headers: {
                'User-Agent': 'jest-test'
            }
        };

        const result = await handler(event);

        // Verificar a resposta
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toHaveProperty('message', 'Hello from AWS Lambda!');
        
        // Verificar a chamada ao DynamoDB
        expect(ddbMock.calls()).toHaveLength(1);
        const putCall = ddbMock.call(0);
        expect(putCall.args[0].input).toMatchObject({
            TableName: 'APILogs',
            Item: {
                path: { S: '/greet' },
                method: { S: 'GET' },
                clientIp: { S: '127.0.0.1' },
                userAgent: { S: 'jest-test' }
            }
        });
    });
});