@echo off
title Portfolio dev server
rem Double-click to run the portfolio locally: http://localhost:5180
rem Keep this window open while you use the site; close it to stop the server.
cd /d "%~dp0"
rem Open the browser once the server has had a moment to start.
start "" /min cmd /c "timeout /t 10 /nobreak >nul & start http://localhost:5180"
npm run dev
pause
