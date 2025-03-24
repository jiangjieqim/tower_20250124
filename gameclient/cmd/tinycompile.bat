@REM echo RUN tinycompile...

@REM call loadlib.bat %1

@REM cd %trunk%\gameclient\src

@REM if %SVN_CLOSE% == 0 ( svn up & svn log -l %SVN_LOG_NUM%  --verbose)

@REM cd %QATOOLS%

@REM node compile.js -w %trunk%\gameclient

@REM cd %MYCMD%


cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd tinycompile %workspaceFolder%