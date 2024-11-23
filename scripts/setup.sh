#!/bin/bash

# Output colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to wait for DynamoDB
wait_for_dynamodb() {
    echo -e "${YELLOW}Waiting for DynamoDB to be available...${NC}"
    for i in {1..30}; do
        if aws dynamodb list-tables --endpoint-url http://localhost:8000 &>/dev/null; then
            echo -e "${GREEN}DynamoDB is available!${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    echo -e "${RED}Failed to connect to DynamoDB${NC}"
    return 1
}

# Function to setup DynamoDB table
setup_table() {
    echo -e "${YELLOW}Creating APILogs table...${NC}"
    
    # Delete table if it exists
    aws dynamodb delete-table \
        --table-name APILogs \
        --endpoint-url http://localhost:8000 2>/dev/null || true
    
    sleep 2

    # Create table
    aws dynamodb create-table \
        --table-name APILogs \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
            AttributeName=timestamp,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
            AttributeName=timestamp,KeyType=RANGE \
        --billing-mode PAY_PER_REQUEST \
        --endpoint-url http://localhost:8000

    sleep 2

    # Verify table is active
    aws dynamodb describe-table \
        --table-name APILogs \
        --endpoint-url http://localhost:8000

    # Insert test items
    echo -e "${YELLOW}Inserting test data...${NC}"
    aws dynamodb put-item \
        --table-name APILogs \
        --item '{
            "id": {"S": "test-1"},
            "timestamp": {"S": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"},
            "message": {"S": "Test message"}
        }' \
        --endpoint-url http://localhost:8000

    # Verify data
    echo -e "${YELLOW}Verifying data in table...${NC}"
    aws dynamodb scan --table-name APILogs --endpoint-url http://localhost:8000
}

echo -e "${YELLOW}Starting setup process...${NC}"

# Clean up existing resources
echo -e "${YELLOW}Cleaning up existing resources...${NC}"
docker stop dynamodb &>/dev/null || true
docker rm dynamodb &>/dev/null || true
docker network rm sam-network &>/dev/null || true

sleep 2

# Create Docker network
echo -e "${YELLOW}Creating Docker network...${NC}"
docker network create sam-network

# Start DynamoDB
echo -e "${YELLOW}Starting DynamoDB Local...${NC}"
docker run --rm -d \
    -p 8000:8000 \
    --network sam-network \
    --name dynamodb \
    --network-alias dynamodb \
    amazon/dynamodb-local \
    -jar DynamoDBLocal.jar -sharedDb

# Wait for DynamoDB to be ready
wait_for_dynamodb

# Setup table
setup_table

# Verify network setup
echo -e "${YELLOW}Docker network configuration:${NC}"
docker network inspect sam-network
echo -e "${YELLOW}DynamoDB container information:${NC}"
docker inspect dynamodb | grep -i ipaddress

# Build SAM application
echo -e "${YELLOW}Building SAM application...${NC}"
sam build

echo -e "${GREEN}Setup complete! Starting API...${NC}"
echo -e "${YELLOW}Running SAM Local API...${NC}"
sam local start-api --docker-network sam-network --warm-containers EAGER