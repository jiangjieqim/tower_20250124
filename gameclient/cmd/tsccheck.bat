@REM call loadlib.bat %1
@REM cd %MYCMD%
@REM echo RUN tsccheck...
@REM cd..
@REM set client=%cd%
@REM tsc -p %client% --outDir bin/js
@REM cd %MYCMD%

cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd tsccheck %workspaceFolder%