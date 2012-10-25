@echo off
echo Starting SiftDriver...
echo.
:start
SiftDriver.exe
echo.
echo SiftDriver crashed. Restarting...
echo.
goto start
