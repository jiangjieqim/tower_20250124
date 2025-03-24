@REM echo params:[%1]
cd %1
cd ..
set trunk=%cd%
@REM echo trunk is[%trunk%] p1 is [%2]
set file=%trunk%\%2
@REM echo your target file is '%file%'
TortoiseProc.exe /command:commit /path:%file% /logmsg . /closeonend:0