@REM 打开文件夹
@REM open Client\trunk\gameclient 
echo off
call loadlib.bat %1

set fold=%1

cd %CURPROJECT%/%fold%
explorer .