@echo off

set mono="%ProgramFiles(x86)%\Mono-2.10.9\bin\mono.exe"

echo Starting SiftDriver...
echo.
:start
%mono% SiftDriver.exe
echo.
echo SiftDriver crashed. Restarting...
echo.
goto start
