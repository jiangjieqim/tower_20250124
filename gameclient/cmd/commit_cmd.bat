echo off

call loadlib.bat %1

::"C:\Program Files\TortoiseSVN\bin\TortoiseProc.exe"

set fold1=%trunk%\gameclient\cmd
cd %fold1%
svn up
"TortoiseProc.exe" /command:commit /path:"%fold1%" /logmsg "commit %cd% %date%%time%" /closeonend:0
"TortoiseProc.exe" /command:commit /path:"%trunk%\gameclient\.vscode\tasks.json" /logmsg "commit %cd% %date%%time%" /closeonend:0

cd %MYCMD%