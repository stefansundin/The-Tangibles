@echo off
echo Starting SpheroDriver
echo.

:start
"%ProgramFiles(x86)%\Java\jre7\bin\java.exe" -jar SpheroDriver.jar
echo.
echo.
echo SpheroDriver crashed or could not pair with a Sphero.
echo Trying again in 5 seconds.
echo.

:: Ugly sleep hack :-)
ping -n 5 -w 1 127.0.0.1 >nul

echo.
echo.
goto start
