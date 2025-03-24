@REM call loadlib.bat %1
@REM cd %QATOOLS%
@REM node compress_res.js -i "%trunk%\resource" -o "%trunk%\compress_resource" --compress
@REM cd %MYCMD%


cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd compress_res %workspaceFolder%