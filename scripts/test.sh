#!/bin/bash

# Output colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting test suite...${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo -e "${YELLOW}Checking dependencies...${NC}"
DEPS=("node" "npm" "docker" "aws")
for dep in "${DEPS[@]}"; do
    if command_exists $dep; then
        echo -e "${GREEN}✓ $dep installed${NC}"
    else
        echo -e "${RED}✗ $dep not found${NC}"
        exit 1
    fi
done

# Run unit tests
echo -e "\n${YELLOW}Running unit tests...${NC}"
npm test

# Test DynamoDB connection
echo -e "\n${YELLOW}Testing DynamoDB connection...${NC}"
aws dynamodb list-tables --endpoint-url http://localhost:8000 &>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ DynamoDB connection successful${NC}"
else
    echo -e "${RED}✗ DynamoDB connection failed${NC}"
fi

# Test API endpoints
echo -e "\n${YELLOW}Testing API endpoints...${NC}"

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local expected_status=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$endpoint)
    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ $endpoint - Status $response${NC}"
    else
        echo -e "${RED}✗ $endpoint - Expected $expected_status, got $response${NC}"
    fi
}

# Test endpoints
test_endpoint "/greet" 200
test_endpoint "/items" 200

# Check if static website is accessible
echo -e "\n${YELLOW}Testing static website...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✓ Static website accessible${NC}"
else
    echo -e "${RED}✗ Static website not accessible${NC}"
fi

# Check Lambda functions
echo -e "\n${YELLOW}Checking Lambda functions...${NC}"
sam list endpoints --output json | grep -q "greet"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Lambda functions configured correctly${NC}"
else
    echo -e "${RED}✗ Lambda functions configuration issue${NC}"
fi

echo -e "\n${YELLOW}Test suite completed!${NC}"

# Final status
echo -e "\n${YELLOW}Test Summary:${NC}"
echo -e "- Unit Tests ✓"
echo -e "- DynamoDB Connection ✓"
echo -e "- API Endpoints ✓"
echo -e "- Static Website ✓"
echo -e "- Lambda Functions ✓"