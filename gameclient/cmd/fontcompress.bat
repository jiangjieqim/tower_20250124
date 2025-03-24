
@REM call loadlib.bat %1
@REM call svn_up.bat %trunk%/gameclient_ui
@REM @REM cd %CURPROJECT%\Client\tools\qatools
@REM call init_node.bat
@REM echo %LIB_ROOT%
@REM cd %LIB_ROOT%/client/tools/qatools
@REM node fontcompress.js -i %trunk%
@REM cd %MYCMD%



cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd fontcompress %workspaceFolder%