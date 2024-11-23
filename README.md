<<<<<<< HEAD
# LIDP Cloud Challenge

[![AWS SAM](https://img.shields.io/badge/AWS%20SAM-Ready-orange)](https://aws.amazon.com/serverless/sam/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Required-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> A serverless application demonstrating static website hosting, API functionality, and secure data storage using AWS SAM.

## 🚀 Quick Start

### Prerequisites

- AWS SAM CLI
- Docker Desktop
- Node.js 18.x or later
- AWS CLI (configured)

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/lidp-cloud-challenge.git
cd lidp-cloud-challenge
```

2. **Install dependencies**
=======
```markdown
# **Challenge-SAM: LIDP Cloud Challenge**

## **Project Description**
This repository contains the solution for the LIDP Cloud Challenge. The project simulates a serverless architecture using AWS SAM, including:
- A static website hosted locally, simulating an S3 bucket.
- A RESTful API backed by a Lambda function.
- Logging of API calls into a DynamoDB table.

---

## **Features**

### **API Endpoints**
- **GET /greet**:  
  - Responds with a JSON object containing a greeting message.
  - Logs details (IP, user-agent, timestamp, etc.) of each request into DynamoDB.

### **Static Website**
- A simple "Hello, World!" page accessible via a local endpoint, simulating S3 hosting.

### **AWS Resources**
- **AWS Lambda**: 
  - Handles API requests and logs the details to DynamoDB.
- **Amazon API Gateway**: 
  - Routes requests to the Lambda function.
- **Amazon DynamoDB**:
  - Stores logs in a table named `APILogs`.

---

## **Setup and Run Locally**

### **1. Prerequisites**
- **AWS CLI**: Installed and configured.
- **Docker**: For running DynamoDB Local and SAM CLI.
- **SAM CLI**: The latest version installed.
- **Node.js**: Version 18 or higher.

### **2. Install Dependencies**
Run the following command to install the Node.js dependencies:
>>>>>>> 49afe1d76dd07694fbb9024bfb41d7a54f751a1d
```bash
npm install
```

3. **Set up Docker network**
```bash
docker network create sam-network
```

4. **Start DynamoDB Local**
```bash
docker run --rm -p 8000:8000 --network sam-network --name dynamodb amazon/dynamodb-local
```

5. **Build and start the application**
```bash
sam build
sam local start-api --docker-network sam-network
```

## 🧪 Testing

### Static Website
```bash
# Access the website
curl http://localhost:3000
# Or open in your browser: http://localhost:3000
```

### API Endpoints

1. **Greeting Endpoint**
```bash
curl http://localhost:3000/greet
```

2. **Items CRUD Operations**
```bash
# Get all items
curl http://localhost:3000/items

# Get item by ID
curl http://localhost:3000/items/123

# Create new item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"id": "123", "name": "test-item"}'
```

### Run Unit Tests
```bash
npm test
```

## 🏗️ Architecture

The application consists of:

- **Static Website** - Simulated S3 hosting
- **API Gateway** - REST API endpoints
- **Lambda Functions** - Business logic handlers
- **DynamoDB** - Data storage and logging
- **Security Features** - WAF, IAM roles, HTTPS enforcement

## 🤔 Implementation Decisions

1. **Why Docker for DynamoDB Local?**
   - Cost-effective development environment
   - Offline development capability
   - Consistent database behavior across environments
   - Network isolation and control
   - Easy setup and teardown

2. **Security Considerations**
   - API Gateway with HTTPS only
   - Least privilege IAM roles
   - WAF protection
   - S3 bucket with blocked public access
   - DynamoDB encryption at rest

3. **Local Development Focus**
   - AWS free-tier compatible
   - Simple setup process
   - Minimal dependencies
   - Docker-based isolation

## 📁 Project Structure

```
.
├── src/
│   └── handlers/           # Lambda function handlers
├── __tests__/             # Unit tests
├── website/               # Static website files
├── template.yaml          # SAM template
├── samconfig.toml         # SAM configuration
└── package.json           # Node.js dependencies
```

<<<<<<< HEAD
## 🔧 Common Issues & Solutions

### DynamoDB Connection Issues

If you can't connect to DynamoDB Local:

1. Verify Docker container is running:
```bash
docker ps | grep dynamodb
```

2. Check network configuration:
```bash
docker network inspect sam-network
```

3. Ensure correct endpoint URL:
```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

### API Gateway Issues

If the API isn't responding:

1. Check SAM logs:
```bash
sam logs -n FunctionName
```

2. Verify API is running:
```bash
sam local start-api --debug
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
=======
---
>>>>>>> 49afe1d76dd07694fbb9024bfb41d7a54f751a1d
