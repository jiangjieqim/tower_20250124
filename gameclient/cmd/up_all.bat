call loadlib.bat %1

cd %CURPROJECT%
svn cleanup
svn up
cd %old%