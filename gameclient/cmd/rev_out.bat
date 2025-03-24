@REM call loadlib.bat %1

@REM cd %QATOOLS%

@REM node rev_out.js --trunk %trunk%

@REM copy %trunk%\resource\o\config\game.json %trunk%\rev_out\o\config\game.json 

@REM @REM cd %trunk%\gameclient\cmd
@REM cd %MYCMD%



cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd rev_out %workspaceFolder%