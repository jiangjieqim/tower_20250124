@REM @REM echo off
@REM call loadlib.bat %1

@REM cd..\..\

@REM cd %CURPROJECT%\Client\excel

@REM if %SVN_CLOSE% == 0 ( svn up  & svn log -l 3 -v)

@REM cd %QATOOLS%

@REM @REM node json2bAll.js -excels %excels% -jsondir "%trunk%\resource\o\config\export" -codedir "%trunk%\gameclient\src\game\static\json\struct"
@REM node json2bConvert.js --trunk %trunk% --project %CURPROJECT%

@REM node combineCfgTs.js --trunk %trunk%

@REM @REM --ignoreAllbin (true)忽略all.bin打包

@REM cd %trunk%\gameclient\cmd

@REM @REM 生成配置并且copy到rev_out中去
@REM copy.bat haslib



cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd buildxlsx_new %workspaceFolder%