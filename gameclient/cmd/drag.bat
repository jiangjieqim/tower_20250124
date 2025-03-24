echo off
call loadlib.bat %1

@REM echo off
@REM set "str=%~x1"
@REM @REM echo %~nx1 filename: %~n1

set /p filename=input file:
cd %QATOOLS%

@REM node drag.js %filename%

node drag.js --file D:\project1\Client\trunk\resource\o\icon\100.png --end 105
 
cd %MYCMD%