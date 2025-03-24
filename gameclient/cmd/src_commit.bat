call loadlib.bat %1

cd "%trunk%\gameclient\src"
svn up
"TortoiseProc.exe" /command:commit /path:"%trunk%\gameclient\src" /closeonend:0