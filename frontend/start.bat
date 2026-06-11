@echo off
echo Starting Comment Analyzer...
cd backend
start "Backend" cmd /k "npm run dev"
cd ../frontend
start "Frontend" cmd /k "npm run dev"