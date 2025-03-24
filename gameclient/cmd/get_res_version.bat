@REM call loadlib.bat %1
@REM cd %QATOOLS%
@REM node get_res_version.js --trunk %trunk%
@REM @REM cd %trunk%\gameclient\cmd
@REM cd %MYCMD%





cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd get_res_version %workspaceFolder%