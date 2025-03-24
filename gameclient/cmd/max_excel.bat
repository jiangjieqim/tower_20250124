echo off
call loadlib.bat %1

@REM 找一个版本号最大的分支进行配置表构建

cd %QATOOLS%
node getmax.js --project %curproject% --batfile online_excel.bat

cd %MYCMD%