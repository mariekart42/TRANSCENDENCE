#!/bin/bash

# Define color codes
RED='\033[0;31m'
BLUE='\033[0;34m'
YEL='\033[0;33m'
GRN='\033[0;32m'
RESET='\033[0m' # No Color (reset color back to normal)

# Prompt the user
echo -e " #  ${BLUE}Are you in a virtual environment?${RESET}"
read -p " #  [Y/N]: " response

# Check the user's response
if [[ "$response" == "y" || "$response" == "Y" ]]; then

    echo -e " #  ${BLUE}Upgrading pip...${RESET}"
    python3.9 -m pip install --upgrade pip

    echo -e " #  ${BLUE}Installing Django...${RESET}"
    python3.9 -m pip install Django

    echo -e " #  ${BLUE}Starting Django server...${RESET}"
    # u can specify port at the end, default is 8000
    python3 backend/manage.py runserver 6969

    echo -e " #  ${RED}Server exit${RESET}"
else
    echo -e "\n ${RED}=> Go in your virtual environment!\n${BLUE} => RUN: source virtualEnvironment/bin/activate${RESET}"
fi
