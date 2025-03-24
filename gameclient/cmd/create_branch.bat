@REM call loadlib.bat %1

@REM cd %CURPROJECT%
@REM call project_config

@REM cd %MYCMD%

@REM set url=%CUR_TRUNK_SVN%
@REM @REM http://%server%/svn/project3/Client

@REM svn info %url%/trunk
@REM set /p version=input_branch_name:
@REM svn copy %url%/trunk %url%/%version% -m "create branch..."
@REM svn up

@REM cd %MYCMD%

@REM call buildInitConfig.bat

@REM pause




cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd create_branch %workspaceFolder%