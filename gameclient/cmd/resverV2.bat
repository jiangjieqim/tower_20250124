@REM call loadlib.bat %1
@REM cd %QATOOLS%
@REM node resverV2.js --trunk %trunk%
@REM @REM cd %trunk%\gameclient\cmd
@REM cd %MYCMD%


cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd resverV2 %workspaceFolder%