# LIDP Cloud Challenge - Project Wiki

Welcome to the LIDP Cloud Challenge project wiki! This documentation contains all the information needed to understand, develop, and maintain the project.

## Quick Navigation

* [Getting Started](#getting-started)
* [Development Guide](#development-guide)
* [Architecture Reference](#architecture-reference)
* [API Documentation](#api-documentation)
* [Security Guide](#security-guide)
* [Operations Guide](#operations-guide)
* [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:

```bash
# Required versions
Node.js >= 18.x
npm >= 8.x
Docker >= 20.x
AWS SAM CLI >= 1.x

# Recommended IDE
Visual Studio Code with extensions:
- AWS Toolkit
- ESLint
- Prettier
```

### Quick Start Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/cloud-challenge.git
   cd cloud-challenge
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Local Development Environment**
   ```bash
   # Create Docker network
   docker network create sam-network

   # Start DynamoDB Local
   docker run --rm -p 8000:8000 --network sam-network --name dynamodb amazon/dynamodb-local

   # Build and start application
   sam build
   sam local start-api --docker-network sam-network
   ```

4. **Verify Installation**
   ```bash
   # Test the greeting endpoint
   curl http://localhost:3000/greet

   # Expected response:
   {
       "message": "Hello from AWS Lambda!",
       "timestamp": "2024-11-23T00:00:00Z"
   }
   ```

## Development Guide

### Project Structure
```plaintext
project/
├── src/                # Source code
│   ├── handlers/       # Lambda function handlers
│   └── utils/         # Shared utilities
├── tests/             # Test files
├── website/           # Static website files
├── scripts/           # Automation scripts
└── template.yaml      # SAM template
```

### Development Workflow

1. **Feature Development**
   ```bash
   # Create feature branch
   git checkout -b feature/new-feature

   # Start local development
   npm run dev
   ```

2. **Code Style**
   ```bash
   # Format code
   npm run format

   # Lint code
   npm run lint
   ```

3. **Testing**
   ```bash
   # Run all tests
   npm test

   # Run specific test
   npm test -- greet.test.js
   ```

### Configuration Guide

#### Environment Variables
```bash
# Local development (.env)
AWS_REGION=us-east-1
LOG_LEVEL=DEBUG
API_STAGE=dev

# Production (set in AWS)
AWS_REGION=<region>
LOG_LEVEL=INFO
API_STAGE=prod
```

## Architecture Reference

### System Components

#### Frontend (Static Website)
- **S3 Bucket Configuration**
  ```yaml
  StaticWebsiteBucket:
    Type: AWS::S3::Bucket
    Properties:
      WebsiteConfiguration:
        IndexDocument: index.html
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
  ```

#### Backend (API)
- **Lambda Functions**
  ```javascript
  // Example handler
  export const handler = async (event) => {
      // Implementation
  };
  ```

#### Database
- **DynamoDB Schema**
  ```yaml
  APILogsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
  ```

### Security Architecture

#### IAM Roles
```yaml
# Lambda execution role
LambdaExecutionRole:
  Type: AWS::IAM::Role
  Properties:
    AssumeRolePolicyDocument:
      Version: '2012-10-17'
      Statement:
        - Effect: Allow
          Principal:
            Service: lambda.amazonaws.com
          Action: sts:AssumeRole
```

## API Documentation

### Endpoints

#### GET /greet
Returns a greeting message.

**Request:**
```bash
curl http://localhost:3000/greet
```

**Response:**
```json
{
    "message": "Hello from AWS Lambda!",
    "timestamp": "2024-11-23T00:00:00Z"
}
```

#### GET /items
Retrieves all items from the database.

**Request:**
```bash
curl http://localhost:3000/items
```

**Response:**
```json
{
    "items": [
        {
            "id": "item1",
            "timestamp": "2024-11-23T00:00:00Z"
        }
    ]
}
```

## Security Guide

### Security Best Practices

1. **API Security**
   ```yaml
   # WAF Configuration
   WebACL:
     Type: AWS::WAFv2::WebACL
     Properties:
       Rules:
         - Name: RateLimit
           Priority: 1
           Statement:
             RateBasedStatement:
               Limit: 2000
   ```

2. **Data Security**
   ```yaml
   # DynamoDB Encryption
   TableEncryption:
     SSESpecification:
       SSEEnabled: true
   ```

### Security Checklist

- [ ] WAF rules configured
- [ ] SSL/TLS enabled
- [ ] IAM roles reviewed
- [ ] Encryption enabled
- [ ] Access logs enabled

## Operations Guide

### Deployment

#### Development Deployment
```bash
# Deploy with development configuration
sam deploy --config-env dev
```

#### Production Deployment
```bash
# Deploy with production configuration
sam deploy --config-env prod
```

### Monitoring

#### CloudWatch Alarms
```yaml
# High Error Rate Alarm
HighErrorRateAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmDescription: Alert on high error rate
    MetricName: Errors
    Threshold: 5
```

#### Logging
```javascript
// Structured logging
console.log(JSON.stringify({
    level: 'info',
    message: 'Operation completed',
    timestamp: new Date().toISOString()
}));
```

## Troubleshooting

### Common Issues

#### DynamoDB Connection Issues
```bash
# Check DynamoDB status
docker ps | grep dynamodb

# Verify network
docker network inspect sam-network
```

#### API Gateway Issues
```bash
# Check logs
sam logs -n FunctionName

# Test endpoint locally
curl -v http://localhost:3000/greet
```

### Debug Guide

1. **Lambda Function Debugging**
   ```bash
   # Enable debug logs
   sam local start-api --debug

   # Check CloudWatch logs
   aws logs get-log-events --log-group-name /aws/lambda/FunctionName
   ```

2. **API Gateway Debugging**
   ```bash
   # Test with verbose output
   curl -v http://localhost:3000/greet

   # Check API Gateway logs
   aws logs get-log-events --log-group-name API-Gateway-Execution-Logs
   ```

## FAQ

### Development FAQs

Q: How do I add a new endpoint?
```yaml
# Add to template.yaml
NewFunction:
  Type: AWS::Serverless::Function
  Properties:
    Handler: src/handlers/new-handler.handler
    Events:
      Api:
        Type: Api
        Properties:
          Path: /new-path
          Method: GET
```

Q: How do I update DynamoDB schema?
```yaml
# Update table definition
APILogsTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: newAttribute
        AttributeType: S
```

### Support Contacts

- Technical Issues: [tech-support@email.com]
- Security Concerns: [security@email.com]
- General Questions: [help@email.com]

## Contributing

### Contribution Guidelines

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Submit pull request

### Code Review Process

1. Code style check
2. Unit tests pass
3. Integration tests pass
4. Security review
5. Performance review

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

**Note**: This wiki is continuously updated. For the latest information, please check the repository regularly.