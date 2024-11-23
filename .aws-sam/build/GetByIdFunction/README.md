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
```bash
npm install
```

### **3. Create a Docker Network**
To allow communication between the containers:
```bash
docker network create sam-network
```

### **4. Start DynamoDB Local**
Run the DynamoDB Local container connected to the `sam-network`:
```bash
docker run --rm -p 8000:8000 --network sam-network --name dynamodb amazon/dynamodb-local
```

### **5. Build and Start the Application**
Build and start the SAM application locally:
```bash
sam build
sam local start-api --docker-network sam-network
```

---

## **Testing the Functionality**

### **1. Testing the API**
Invoke the `/greet` endpoint:
```bash
curl http://localhost:3000/greet
```

Expected Response:
```json
{
    "message": "Hello from AWS Lambda!",
    "timestamp": "2024-11-22T22:00:00.000Z"
}
```

### **2. Verify Logs in DynamoDB**
Check if the API logs were recorded in DynamoDB:
```bash
aws dynamodb scan --table-name APILogs --endpoint-url http://localhost:8000
```

Expected Output:
```json
{
    "Items": [
        {
            "id": { "S": "log_123456789" },
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

### **3. Testing the Static Website**
To test the static website:
1. Open the `index.html` file in your browser or use the following command:
   ```bash
   curl http://localhost:3000
   ```

---

## **Assumptions and Decisions**
1. **DynamoDB Local**: 
   - Used to simulate the DynamoDB service locally for logging API requests.
2. **Static Website Simulation**:
   - Simulates S3 hosting by serving HTML files through the local API Gateway endpoint.
3. **Security Measures**:
   - IAM policies are configured for least-privilege access in the SAM template.
   - The S3 bucket is configured to block public access in the simulation.
   - API Gateway enforces HTTPS-only access.

---

## **Deploying to AWS**

To deploy the application to AWS:
1. Run the guided SAM deployment:
   ```bash
   sam deploy --guided
   ```
2. Follow the prompts to configure the stack.

---

## **Running Unit Tests**

Unit tests for the Lambda function are located in the `__tests__` directory. To run the tests:
```bash
npm test
```

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```

---