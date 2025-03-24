@REM 从主干copy所有的cmd

echo off

call loadlib.bat %1

"TortoiseProc.exe" /command:commit /path:"%trunk%\gameclient\cmd" /closeonend:0 /logmsg "."

if  "%CURPROJECT%\Client\trunk\gameclient\cmd"=="%trunk%\gameclient\cmd"  ( goto ErrShow ) else ( goto Ok )

:ErrShow
    echo %date%%time% warnning you dir is [%cd%] ! 
    cd %MYCMD%
exit /b

:Ok
    xcopy %CURPROJECT%\Client\trunk\gameclient\cmd %trunk%\gameclient\cmd /s /y
    @REM 提交到svn
    "TortoiseProc.exe" /command:commit /path:"%trunk%\gameclient\cmd" /closeonend:0 /logmsg "."
	@REM 提交task.json
    set task=.vscode\tasks.json
    xcopy %CURPROJECT%\Client\trunk\gameclient\%task% %trunk%\gameclient\%task% /s /y
     "TortoiseProc.exe" /command:commit /path:"%trunk%\gameclient\%task%" /closeonend:0 /logmsg "."
    cd %MYCMD%
exit /b