# LIDP Cloud Challenge - Serverless Application 🚀

A serverless web application developed using AWS SAM (Serverless Application Model) that implements a secure and scalable cloud infrastructure.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.x-brightgreen.svg)](https://nodejs.org/)
[![AWS SAM](https://img.shields.io/badge/AWS%20SAM-required-orange.svg)](https://aws.amazon.com/serverless/sam/)
[![Docker](https://img.shields.io/badge/Docker-required-blue.svg)](https://www.docker.com/)

## 📋 Prerequisites

> **Note**: Make sure you have all these tools installed before proceeding.

- [Node.js](https://nodejs.org/) (v18.x or later)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/downloads)
- [AWS CLI](https://aws.amazon.com/cli/) (configured with credentials)

## 🚀 Quick Start

### 1️⃣ Clone and Setup

```shell
# Clone the repository
git clone https://github.com/guirgsilva/cloud-challenge/
cd challenge-SAM

# Install dependencies
npm install
```

### 2️⃣ Local Development Environment Setup

```shell
# Create Docker network for service communication
docker network create sam-network

# Start DynamoDB Local
docker run --rm -p 8000:8000 --network sam-network --name dynamodb amazon/dynamodb-local

# In a new terminal, build and start the application
sam build
sam local start-api --docker-network sam-network
```

### 3️⃣ Verify Installation

Test the API endpoints:

```shell
# Test greeting endpoint
curl http://localhost:3000/greet
```

Expected response:
```json
{
    "message": "Hello from AWS Lambda!",
    "timestamp": "2024-11-22T22:00:00.000Z"
}
```

## 📁 Project Structure

```
.
├── README.md
├── __tests__/               # Unit tests
├── events/                  # Sample event payloads
├── src/
│   └── handlers/           # Lambda function handlers
├── template.yaml           # SAM template
└── package.json
```

## 🛣️ Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Static website |
| GET | `/greet` | Greeting endpoint |
| GET | `/items` | List all items |
| GET | `/items/{id}` | Get item by ID |
| POST | `/items` | Create new item |

## 🧪 Running Tests

All tests are located in the `__tests__/unit/handlers/` directory.

### Running All Tests
```shell
# Run complete test suite
npm test
```

### Running Individual Tests

```shell
# Test greeting endpoint
npm test -- greet.test.mjs

# Test static website handler
npm test -- static.test.js

# Test DynamoDB operations
npm test -- get-all-items.test.mjs
npm test -- get-by-id.test.mjs
npm test -- put-item.test.mjs
```

### API Endpoint Testing

1. **Static Website**
```shell
# Test static website endpoint
curl http://localhost:3000/

# Expected: Returns HTML content
```

2. **Greeting Endpoint**
```shell
# Test greeting endpoint
curl http://localhost:3000/greet

# Expected response:
{
    "message": "Hello from AWS Lambda!",
    "timestamp": "2024-11-22T22:00:00.000Z",
    "logId": "log_1234567890"
}
```

3. **DynamoDB Operations**
```shell
# List all items
curl http://localhost:3000/items

# Get specific item
curl http://localhost:3000/items/123

# Create new item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"id": "123", "name": "test-item"}'
```

### Verifying DynamoDB Logs

```shell
# Check API Logs in DynamoDB
aws dynamodb scan \
  --table-name APILogs \
  --endpoint-url http://localhost:8000

# Expected response:
{
    "Items": [
        {
            "id": { "S": "log_1234567890" },
            "timestamp": { "S": "2024-11-22T22:00:00.000Z" },
            "path": { "S": "/greet" },
            "method": { "S": "GET" },
            "clientIp": { "S": "127.0.0.1" },
            "userAgent": { "S": "curl/7.68.0" }
        }
    ],
    "Count": 1,
    "ScannedCount": 1
}
```

### Unit Test Coverage

The test suite covers:

| Component | Tests |
|-----------|-------|
| Static Website | - File serving<br>- Error handling |
| Greeting API | - Response format<br>- DynamoDB logging |
| DynamoDB Operations | - Get all items<br>- Get item by ID<br>- Put item<br>- Error cases |
| Security | - IAM permissions<br>- API access |

### Test Environment Setup

Before running tests, ensure:

1. DynamoDB Local is running:
```shell
docker ps | grep dynamodb
```

2. Docker network is created:
```shell
docker network ls | grep sam-network
```

3. Environment variables are set in `env.json`:
```json
{
    "getAllItemsFunction": {
        "SAMPLE_TABLE": "<TABLE-NAME>"
    },
    "getByIdFunction": {
        "SAMPLE_TABLE": "<TABLE-NAME>"
    },
    "putItemFunction": {
        "SAMPLE_TABLE": "<TABLE-NAME>"
    }
}
```

## ⚠️ Common Issues and Solutions

<details>
<summary><b>DynamoDB Connection Issues</b></summary>

If you see connection errors to DynamoDB:
```shell
# Verify DynamoDB container is running
docker ps | grep dynamodb

# Check network
docker network inspect sam-network

# Restart DynamoDB if needed
docker restart dynamodb
```
</details>

<details>
<summary><b>Port Conflicts</b></summary>

If port 8000 is already in use:
```shell
# Find and kill process using port 8000
lsof -i :8000
kill -9 [PID]

# Or use a different port
docker run --rm -p 8001:8000 --network sam-network --name dynamodb amazon/dynamodb-local
```
</details>

<details>
<summary><b>SAM CLI Issues</b></summary>

If SAM CLI fails to start:
```shell
# Clear SAM CLI cache
sam --clear-cache

# Rebuild the application
sam build --clear-cache
```
</details>

<details>
<summary><b>Tests Failing Due to DynamoDB Connection</b></summary>

If tests fail due to DynamoDB connection:
```shell
# Restart DynamoDB container
docker restart dynamodb

# Verify endpoint
aws dynamodb list-tables --endpoint-url http://localhost:8000
```
</details>

<details>
<summary><b>Jest Timeout Issues</b></summary>

If tests timeout:
```shell
# Increase Jest timeout
npm test -- --testTimeout=10000
```
</details>

## 🔒 Security Features

- ✅ IAM roles with least privilege access
- ✅ API Gateway with HTTPS-only access
- ✅ DynamoDB encryption at rest
- ✅ WAF rules for API protection
- ✅ CloudFront distribution for content delivery

## 📊 Monitoring and Logging

- API calls logged to DynamoDB
- CloudWatch integration for Lambda functions
- Access logs for S3 and CloudFront
- WAF logging enabled

## 🏗️ Architecture Details

The application uses several AWS services simulated locally:

| Service | Purpose |
|---------|----------|
| API Gateway | Routes HTTP requests |
| Lambda | Serverless compute |
| DynamoDB | NoSQL database for logging |
| S3 | Static website hosting |
| CloudFront | Content delivery (optional) |
| WAF | Web application firewall (optional) |

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Add/update tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For any questions or issues:
- [Open an issue](../../issues) in the GitHub repository
- Contact: Guil Silva

## 👏 Acknowledgments

- AWS SAM development team
- LIDP Cloud Challenge team

---
<div align="center">
Made with ❤️ for LIDP Cloud Challenge
</div>
