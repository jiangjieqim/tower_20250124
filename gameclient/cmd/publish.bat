call loadlib.bat %1
cd..\..\
set trunk=%cd%
cd..\tools\qatools
svn up
node publish.js -w %trunk%\gameclient -r %trunk%\resource -o %trunk%\release
pause