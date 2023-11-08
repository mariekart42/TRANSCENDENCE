#!/bin/bash

# Define color codes
RED='\033[0;31m'
BLUE='\033[0;34m'
YEL='\033[0;33m'
GRN='\033[0;32m'
RESET='\033[0m' # No Color (reset color back to normal)

# Prompt the user
echo -e " 🔔  ${YEL}ARE YOU IN VIRTUAL ENVIRONMENT?${RESET}"
read -p "     [Y|N|?]: " response

# Check the user's response
if [[ "$response" == "y" || "$response" == "Y" ]]; then

    echo -e " 🗿  ${BLUE}Upgrading pip...${RESET}"
    python3.9 -m pip install --upgrade pip

    echo -e " 🗿  ${BLUE}Installing Django...${RESET}"
    python3.9 -m pip install Django

    echo -e " 🗿  ${BLUE}Installing Cors Header...${RESET}"
    python3.9 -m pip install django-cors-headers


        # Prompt the user to run migrations
#    echo -e " 🔔  ${YEL}DO YOU WANT TO MIGRATE CHANGES TO DATABASE?${RESET} (optional but recommended)"
#    read -p "     [Y/N]: " migrate_response

#    if [[ "$migrate_response" == "y" || "$migrate_response" == "Y" ]]; then
        echo -e " 🗿  ${BLUE}Applying migrations...${RESET}"

        python3.9 backend/manage.py makemigrations
        python3.9 backend/manage.py migrate

#    else
#        echo -e " ⚠️  ${YEL}Migrations skipped${RESET}"
#    fi

    echo -e " 🗿  ${BLUE}Starting Django server...${RESET}"
    # u can specify port at the end, default is 8000
    python3 backend/manage.py runserver 6969

    echo -e " 🗿  ${RED}Server exit${RESET}"

elif [[ "$response" == "?" ]]; then
    echo -e "\n 💡  ${RESET}Your Terminal should look like this:"
    echo -e "       (${YEL}virtualEnvironment${RESET}) user@lol69 TRANSCENDENCE %"
    echo -e "\n     To activate virtual Environment run:"
    echo -e "       ${YEL}source virtualEnvironment/bin/activate${RESET}"
    echo -e "\n     For more Information's go to:"
    echo -e "       https://docs.python.org/3/library/venv.html\n"
else
    echo -e "\n ${RED}❌   ACTIVATE VIRTUAL ENVIRONMENT!\n${BLUE} 💡  RUN:  source virtualEnvironment/bin/activate${RESET}"
fi
