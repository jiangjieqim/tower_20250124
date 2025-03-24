@REM echo off

@REM @REM call loadlib.bat %1

@REM call init_node.bat

@REM echo RUN simple_svn...

@REM cd %trunk%
@REM svn up

@REM cd %QATOOLS%
@REM node compile.js -w %trunk%\gameclient

@REM cd %MYCMD%


cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd param_simple_svn %workspaceFolder%