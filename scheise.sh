#!/bin/bash

# Define color codes
RED='\033[0;31m'
BLUE='\033[0;34m'
YEL='\033[0;33m'
GRN='\033[0;32m'
RESET='\033[0m' # No Color (reset color back to normal)


# create requirements.txt file for Dockerfile in backend
echo "Django==3.2.10" > requirements.txt
echo "psycopg2-binary==2.9.1" >> requirements.txt

# Move the requirements.txt file to the 'backend' directory:
mv requirements.txt backend/requirements.txt


# Start Docker containers using Docker Compose
echo -e "🐳   ${BLUE}STARTING  DOCKERRR${RESET}\n"
docker-compose up --build