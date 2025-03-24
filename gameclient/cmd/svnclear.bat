@REM call loadlib.bat %1

@REM @REM 清理svn 解决冲突**********************************************************
@REM @REM C:\project1\Client\tools
@REM cd %CURPROJECT%
@REM svn cleanup

@REM cd %CLIENT%
@REM svn resolved tools
@REM svn revert tools

@REM cd %trunk%\upload 
@REM svn resolved all.bin
@REM svn revert all.bin
@REM svn up

@REM cd %CURPROJECT%\Client
@REM svn resolved excel
@REM svn revert excel
@REM svn up

@REM cd %trunk%
@REM svn resolved out
@REM svn revert out
@REM svn up

@REM cd %trunk%\resource\o\config
@REM svn resolved export
@REM svn revert export
@REM svn up

@REM cd %trunk%\gameclient\src\ui
@REM svn resolved layaMaxUI.ts
@REM svn revert layaMaxUI.ts
@REM svn up
@REM @REM 清理svn 解决冲突**********************************************************

@REM cd %MYCMD%

cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd svnclear %workspaceFolder%