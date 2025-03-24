@REM call init_node.bat
@REM cd %QATOOLS%
@REM node createConfig.js -w %trunk%

cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd create_config %workspaceFolder%