echo off

set temppath=%cd%
call loadlib.bat %1

::"C:\Program Files\TortoiseSVN\bin\TortoiseProc.exe"

set fold1="%trunk%\gameclient\src"

cd %fold1%

svn up
@REM svn log -l %SVN_LOG_NUM% -v
"TortoiseProc.exe" /command:commit /path:"%trunk%\gameclient\src" /logmsg "commit_code %cd% %date%%time%" /closeonend:0

@REM cd "%trunk%\resource\o\font"
@REM svn up
@REM svn log -l %SVN_LOG_NUM% -v

@REM "TortoiseProc.exe" /command:commit /path:"%trunk%\resource\o\font" /closeonend:0
@REM 提交协议
cd %trunk%\protos
svn up
"TortoiseProc.exe" /command:commit /path:"%trunk%\protos" /logmsg "commit_code %cd% %date%%time%" /closeonend:0

cd %trunk%\gameclient\ext
svn up
"TortoiseProc.exe" /command:commit /path:"%trunk%\gameclient\ext" /logmsg "d.ts commit..." /closeonend:0