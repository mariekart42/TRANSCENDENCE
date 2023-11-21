#!/bin/bash

# Define color codes
RED='\033[0;31m'
BLUE='\033[0;34m'
YEL='\033[0;33m'
GRN='\033[0;32m'
RESET='\033[0m' # No Color (reset color back to normal)



    echo -e " 🗿  ${BLUE}Upgrading pip...${RESET}"
    python3 -m pip install --upgrade pip

    echo -e " 🗿  ${BLUE}Installing Django...${RESET}"
    python3 -m pip install Django
    python3 -m pip install Django channels


#    echo -e " 🗿  ${BLUE}Installing Vue CLI...${RESET}"
#    npm install --save-dev @vue/cli
#    npm install --save-dev @vue/cli-service


        # Prompt the user to run migrations
#    echo -e " 🔔  ${YEL}DO YOU WANT TO MIGRATE CHANGES TO DATABASE?${RESET} (optional but recommended)"
#    read -p "     [Y/N]: " migrate_response

#    if [[ "$migrate_response" == "y" || "$migrate_response" == "Y" ]]; then
        echo -e " 🗿  ${BLUE}Applying migrations...${RESET}"
        python3 lol/manage.py makemigrations
        python3 lol/manage.py migrate




    echo -e " 🗿  ${BLUE}Starting Django server...${RESET}"
    # u can specify port at the end, default is 8000
    python3 lol/manage.py runserver 6969

    echo -e " 🗿  ${RED}Server exit${RESET}"
