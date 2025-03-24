@REM echo off
set filename=%1
@REM echo "commit file------------------------->%filename%"
"TortoiseProc.exe" /command:commit /path:"%filename%" /closeonend:0 /logmsg .
