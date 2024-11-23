#!/bin/bash

# Output colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting cleanup process...${NC}"

# Stop all running containers
echo -e "${YELLOW}Stopping all Docker containers...${NC}"
docker stop $(docker ps -a -q) 2>/dev/null || true

# Remove DynamoDB container
echo -e "${YELLOW}Removing DynamoDB container...${NC}"
docker rm dynamodb 2>/dev/null || true

# Remove Docker network
echo -e "${YELLOW}Removing Docker network...${NC}"
docker network rm sam-network 2>/dev/null || true

# Remove DynamoDB local data
echo -e "${YELLOW}Removing DynamoDB local data...${NC}"
rm -rf .dynamodb

# Remove SAM build artifacts
echo -e "${YELLOW}Removing SAM build artifacts...${NC}"
rm -rf .aws-sam

# Remove node modules
echo -e "${YELLOW}Removing node modules...${NC}"
rm -rf node_modules

# Remove package-lock.json
echo -e "${YELLOW}Removing package-lock.json...${NC}"
rm -f package-lock.json

# List any remaining Docker resources
echo -e "${YELLOW}Checking remaining Docker resources...${NC}"
echo "Containers:"
docker ps -a
echo "Networks:"
docker network ls

echo -e "${GREEN}Cleanup completed successfully!${NC}"
echo -e "${YELLOW}To start fresh, run: ./scripts/setup.sh${NC}"