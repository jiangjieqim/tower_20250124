@REM call loadlib.bat %1

@REM cd %trunk%\gameclient\src
@REM if %SVN_CLOSE% == 1 ( echo SVN_CLOSE) else ( svn up)

@REM @REM if %SVN_CLOSE% == 1 ( echo SVN_CLOSE) else (svn log -l %SVN_LOG_NUM% -v )

@REM cd %QATOOLS%

@REM node compile.js -w %trunk%\gameclient --wx %CURPROJECT%\Client\wx\js\bundle.js --vest %CURPROJECT%\Client\xingchen

@REM @REM node sub.js -w %trunk%\gameclient
@REM cd %MYCMD%
 
@REM call copybg


cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd wx %workspaceFolder%