
echo off

call loadlib.bat %1

if %testnet_code% equ 0 ( goto main )
goto:eof

:main
call svn_up %MYCMD%
call svn_up %VSCODE%

"TortoiseProc.exe" /command:commit /path:"%MYCMD%" /closeonend:0
"TortoiseProc.exe" /command:commit /path:"%VSCODE%\tasks.json" /closeonend:0
