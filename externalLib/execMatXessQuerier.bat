@echo off

set _curDir=%cd%

set java17home=%_curDir%\externalLib\jdk-17.0.7\bin

%java17home%\java -version

set databasePath=%1
set tmpQueryFile=%2
set outDataFile=%3

echo %databasePath%
echo %tmpQueryFile%
echo %outDataFile%

%java17home%\java -jar %_curDir%\externalLib\MatXessQuerier.jar "%databasePath%" "%tmpQueryFile%" "%outDataFile%" > app.log
