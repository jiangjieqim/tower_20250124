call loadlib.bat %1

cd..\..\..\..\..\
cd Project1\Excel\
@REM echo %cd%

@REM 更新配置
set excels=%cd%
svn up
echo ####################################################################
echo CurServerTime:%time%

svn log -l 10

cd..\Client
set trunk=%cd%\trunk

cd tools\qatools
svn up

node json2bAll.js -excels %excels% -jsondir "%trunk%\resource\o\config\export" -codedir "%trunk%\gameclient\src\game\static\json\struct" -cshapedir "%trunk%\gameserver\ServerLib\StaticData\struct" --ignoreAllbin

@REM --ignoreAllbin (true)忽略all.bin打包

pause
