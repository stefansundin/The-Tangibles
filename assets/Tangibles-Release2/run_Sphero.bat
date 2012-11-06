echo Starting SpheroDriver
echo.
:start
"%ProgramFiles(x86)%\Java\jre7\bin\java.exe" -jar Sphero.jar
echo.
echo SpheroDriver crashed or could not found a sphero peered. Restarting...
echo.
goto start
