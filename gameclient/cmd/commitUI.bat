@REM call loadlib.bat %1

@REM cd %qatools%

@REM set uipath1=%trunk%/gameclient_ui/laya

@REM node TortoiseProc.js -w %uipath1%

@REM echo "---------------------------->commit %uipath1%"

@REM @REM 提交lang.json
@REM set lang="%CURPROJECT%\Client\trunk\resource\o\font\lang.json"
@REM svn up %lang%

@REM echo "--------------------------->commit %lang%"

@REM "TortoiseProc.exe" /command:commit /path:%lang% /closeonend:0