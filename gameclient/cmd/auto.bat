cd..\..\
set client=%cd%
cd..\tools\qatools
svn cleanup
svn up
node auto.js -w %client%
pause
