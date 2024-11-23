import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const getDynamoDBConfig = () => {
    if (process.env.AWS_SAM_LOCAL === 'true') {
        return {
            endpoint: 'http://dynamodb:8000',
            region: 'local',
            credentials: {
                accessKeyId: 'dummy',
                secretAccessKey: 'dummy'
            },
            forcePathStyle: true, // Needed for local DynamoDB
        };
    }
    return {
        region: process.env.AWS_REGION
    };
};

const client = new DynamoDBClient(getDynamoDBConfig());
const ddbDocClient = DynamoDBDocumentClient.from(client);

const verifyTableExists = async (tableName) => {
    try {
        const { TableNames } = await client.send(new ListTablesCommand({}));
        console.log('Available tables:', TableNames);
        return TableNames.includes(tableName);
    } catch (err) {
        console.error('Error checking tables:', err);
        return false;
    }
};

export const getAllItemsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    
    console.info('DynamoDB Config:', getDynamoDBConfig());

    try {
        // First verify if table exists
        const tableExists = await verifyTableExists('APILogs');
        if (!tableExists) {
            throw new Error('APILogs table does not exist');
        }

        // Then attempt to scan
        console.log("Attempting to scan table: APILogs");
        const data = await ddbDocClient.send(new ScanCommand({
            TableName: 'APILogs',
            ConsistentRead: true
        }));
        
        console.log("Success - items retrieved:", JSON.stringify(data, null, 2));
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data.Items || [])
        };
    } catch (err) {
        console.error("Error details:", {
            message: err.message,
            code: err.code,
            statusCode: err.$metadata?.httpStatusCode,
            endpoint: client.config.endpoint,
            stack: err.stack
        });

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                message: 'Error retrieving items',
                error: err.message,
                config: getDynamoDBConfig(),
                networkInfo: {
                    isLocal: process.env.AWS_SAM_LOCAL === 'true',
                    dockerNetwork: 'sam-network',
                    tables: await verifyTableExists('APILogs')
                }
            })
        };
    }
};