#!/bin/bash

RED='\033[0;31m'
BLUE='\033[0;34m'
YEL='\033[0;33m'
GRN='\033[0;32m'
RESET='\033[0m'


  echo -e " 🗿  ${BLUE}Upgrading pip...${RESET}"
  python3 -m pip install --upgrade pip

  echo -e " 🗿  ${BLUE}Installing Django...${RESET}"
  python3 -m pip install django==4.0

  python3 -m pip install channels==4.0.0

  python3 -m pip install daphne==4.0.0

  python3 -m pip install channels_redis

  echo -e " 🗿  ${BLUE}Applying migrations...${RESET}"
  python3 backend/manage.py makemigrations
  python3 backend/manage.py migrate

  echo -e " 🗿  ${BLUE}Starting Django server...${RESET}"
#  python3 backend/manage.py runserver 6969


