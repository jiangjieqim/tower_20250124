call loadlib.bat %1

cd..\..\
set trunk=%cd%

@REM D:\outside\meta\trunk\configs\excels

cd "%trunk%\configs\excels"
svn up

@REM cd..\tools\qatools
cd..\..\..\
cd "tools\qatools"

svn up
node json2bAll.js -excels "%trunk%\configs\excels" -jsondir "%trunk%\resource\o\config\export" -codedir "%trunk%\gameclient\src\game\static\json\struct" -cshapedir "%trunk%\gameserver\ServerLib\StaticData\struct"
::cfg
pause
