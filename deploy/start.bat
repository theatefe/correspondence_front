@echo off

cd backend
start cmd /k yarn start:dev
timeout /t 30

cd ..
cd front
start cmd /k pm2 --name fronend start index.js 
