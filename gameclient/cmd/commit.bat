echo off

set temppath=%cd%
call loadlib.bat %1
::"C:\Program Files\TortoiseSVN\bin\TortoiseProc.exe"

cd "%trunk%\gameclient\src"
svn up
@REM svn log -l %SVN_LOG_NUM% -v
"TortoiseProc.exe" /command:commit /path:"%trunk%\gameclient\src" /closeonend:0 /logmsg "%date%%time% this is src code..."

@REM cd "%trunk%\resource\o\font"
@REM svn up
@REM svn log -l %SVN_LOG_NUM% -v

@REM "TortoiseProc.exe" /command:commit /path:"%trunk%\resource\o\font" /closeonend:0

cd %trunk%\protos
svn up
"TortoiseProc.exe" /command:commit /path:"%trunk%\protos" /closeonend:0 /logmsg "%date%%time% this is protos\BaseProto.xml"

@REM "TortoiseProc.exe" /command:commit /path:"%fontpath%" /closeonend:0 /logmsg "%date% %time% modify for %fontpath%..."

@REM "TortoiseProc.exe" /command:commit /path:"%trunk%\resource\o\config\export\ui.bin" /closeonend:0
@REM "TortoiseProc.exe" /command:commit /path:"%trunk%\resource\o\config\export\all.bin" /closeonend:0
@REM "TortoiseProc.exe" /command:commit /path:"%trunk%\gameclient\bin\js\bundle.js" /closeonend:0

cd %temppath%
call commitUI.bat