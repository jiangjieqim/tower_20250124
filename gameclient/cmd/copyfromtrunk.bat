call loadlib.bat %1

cd ..\..\

call all_config

copy %CURPROJECT%\Client\%trunkname%\%resource%\o\font\lang.json %TRUNK%\%resource%\o\font\lang.json /y

@REM copy 代码
xcopy %CURPROJECT%\Client\%trunkname%\gameclient\src %TRUNK%\gameclient\src /y /e

xcopy %CURPROJECT%\Client\%trunkname%\%gameclient_ui%\laya %TRUNK%\%gameclient_ui%\laya /y /e

copy %CURPROJECT%\Client\%trunkname%\gameclient\version.json  %TRUNK%\gameclient\version.json /y

xcopy %CURPROJECT%\Client\%trunkname%\gameclient\ext  %TRUNK%\gameclient\ext /y

xcopy %CURPROJECT%\Client\%trunkname%\%resource% %TRUNK%\%resource% /y /e

@REM D:\project1\Client\%trunkname%\%gameclient_ui%\laya

@REM D:\project1\Client\%trunkname%\gameclient\src

cd %MYCMD%
