@echo off

set mono="%ProgramFiles(x86)%\Mono-2.10.9\bin\mono.exe"

if not exist %mono% (
	echo You either do not have Mono installed, or the path in this bat file is wrong.
	echo This bat file looked for Mono at:
	echo  %mono%
	echo.
	echo If you have Mono installed and this path is wrong, please right click
	echo this bat file and click Edit, then update the path and save.
	echo.
	pause
	exit /b
)

if not exist Sifteo\SiftDriver.exe (
	echo Can't find Sifteo\SiftDriver.exe.
	echo.
	pause
	exit /b
)

echo Starting SiftDriver...
echo.
:start
%mono% Sifteo\SiftDriver.exe
echo.
echo SiftDriver crashed. Restarting...
echo.
goto start
