call loadlib.bat %1

echo %cd%

set temp1=%trunk%/gameclient/src

call svn_up.bat %temp1%
cd %temp1%
svn log -l 3 -v

cd %MYCMD%
