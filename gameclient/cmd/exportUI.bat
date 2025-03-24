@REM @REM exportUI.bat atlas haslib

@REM echo CMD:exportUI atlas[%1] haslib[%2]

@REM call loadlib.bat %2

@REM @REM exit /b

@REM @REM set atlas=%1

@REM set param=null

@REM @REM if %atlas% == atlas ( set param=-atlas ) else ( set param=null )

@REM if "%1"=="" ( set param=null )
@REM if "%1"=="atlas" ( set param=-atlas )

@REM cd %MYCMD%

@REM call clean.bat haslib

@REM cd %MYCMD%

@REM @REM if %SVN_CLOSE% == 1 ( echo SVN_CLOSE) else ( svn up)
@REM @REM if %SVN_CLOSE% == 1 ( echo SVN_CLOSE) else (svn log -l %SVN_LOG_NUM% -v )

@REM if %SVN_CLOSE% == 1 ( goto:f_svnUp ) else ( goto:f_start )

@REM :f_svnUp

@REM     cd %trunk%\gameclient_ui
@REM 	svn cleanup
@REM     svn up
@REM     svn log -l %SVN_LOG_NUM% -v
@REM     goto:f_start


@REM :f_start
@REM     @REM ����svn �����ͻ**********************************************************
@REM     cd %trunk%\gameclient\src\ui

@REM     svn resolved layaMaxUI.ts
@REM     svn revert layaMaxUI.ts
@REM     svn up

@REM     @REM ����svn �����ͻ**********************************************************


@REM     cd %qatools%

@REM     xcopy %trunk%\gameclient_ui\laya\assets\static %trunk%\resource\static /s /y

@REM     node ui_export.js --trunk %trunk% %param%

@REM     cd %MYCMD%
@REM     exit /b




cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd exportUI %workspaceFolder% ui