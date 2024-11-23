# LIDP Cloud Challenge - Serverless Application 🚀

A production-ready serverless application showcasing cloud infrastructure skills using AWS SAM, implementing secure and scalable architecture.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.x-brightgreen.svg)](https://nodejs.org/)
[![AWS SAM](https://img.shields.io/badge/AWS%20SAM-required-orange.svg)](https://aws.amazon.com/serverless/sam/)
[![Docker](https://img.shields.io/badge/Docker-required-blue.svg)](https://www.docker.com/)
[![DynamoDB](https://img.shields.io/badge/DynamoDB-local-yellow.svg)](https://aws.amazon.com/dynamodb/)
[![Tests](https://img.shields.io/badge/tests-jest-red.svg)](https://jestjs.io/)

## 📋 Prerequisites

> **Note**: Ensure all tools are installed and properly configured before starting.

- [Node.js](https://nodejs.org/) (v18.x or later)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [AWS CLI](https://aws.amazon.com/cli/)

## 🚀 Quick Start

### 1️⃣ Installation

```bash
# Clone the repository
git clone <your-repository>
cd challenge-SAM

# Install dependencies
npm install
```

### 2️⃣ Local Development

```bash
# Initialize local environment
./scripts/setup.sh

# Alternative manual setup:
docker network create sam-network
docker run --rm -d -p 8000:8000 --network sam-network --name dynamodb amazon/dynamodb-local
sam build
sam local start-api --docker-network sam-network
```

### 3️⃣ Verify Setup

```bash
# Test the greeting endpoint
curl http://localhost:3000/greet

# Expected response:
{
    "message": "Hello from AWS Lambda!",
    "timestamp": "2024-11-23T00:00:00Z"
}
```

## 📁 Project Structure

```
.
├── src/
│   ├── handlers/          # Lambda function handlers
│   └── utils/            # Shared utilities
├── tests/                # Unit tests
├── scripts/              # Automation scripts
├── website/             # Static website files
├── template.yaml        # SAM template
└── docs/               # Documentation
```

## 🛣️ Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Static website |
| GET | `/greet` | Greeting endpoint |
| GET | `/items` | List all items |
| GET | `/items/{id}` | Get item by ID |
| POST | `/items` | Create new item |

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific tests
npm test -- greet.test.mjs
npm test -- get-all-items.test.mjs
```

### API Testing

```bash
# Test static website
curl http://localhost:3000/

# Test items API
curl http://localhost:3000/items

# Create new item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"id": "test-1", "name": "Test Item"}'
```

## 🔒 Security Features

- ✅ Least privilege IAM roles
- ✅ HTTPS-only API access
- ✅ DynamoDB encryption
- ✅ WAF protection
- ✅ CloudFront security
- ✅ S3 bucket policies

## 📊 Monitoring & Logging

- CloudWatch integration
- DynamoDB request logging
- API Gateway logs
- WAF logs
- S3 access logs

## 🏗️ Architecture

| Service | Purpose |
|---------|----------|
| API Gateway | Request routing |
| Lambda | Serverless compute |
| DynamoDB | Data storage |
| S3 | Static content |
| CloudFront | CDN |
| WAF | Security |

## 📖 Documentation

- [API Documentation](docs/API.md)
- [Architecture Documentation](docs/ARCHITECTURE.md)
- [Security Documentation](docs/SECURITY.md)

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `setup.sh` | Initialize environment |
| `cleanup.sh` | Remove resources |
| `test.sh` | Run test suite |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Submit pull request

## 📄 License

MIT License - See [LICENSE](LICENSE)

## 📞 Support

- Open an issue
- Contact: Guil Silva

## 👏 Acknowledgments

- AWS SAM team
- LIDP Challenge team
- Open source community

---
<div align="center">
Developed with ❤️ for LIDP Cloud Challenge
</div>