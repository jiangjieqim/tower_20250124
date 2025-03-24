@REM 检测主干的配置是否svn一致 不一致就生成配置
echo off

call loadlib.bat %1
cd %QATOOLS%
node checkUpExcel.js --project %CURPROJECT%

cd %MYCMD%