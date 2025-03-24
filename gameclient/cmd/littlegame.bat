call loadlib.bat %1

cd %trunk%\gameclient\src
if %SVN_CLOSE% == 1 ( echo SVN_CLOSE) else ( svn up)

@REM if %SVN_CLOSE% == 1 ( echo SVN_CLOSE) else (svn log -l %SVN_LOG_NUM% -v )

cd %QATOOLS%

@REM node compile.js -w %trunk%\gameclient --wx %CURPROJECT%\Client\wx\js\bundle.js

node sub.js -w %trunk%\gameclient --entry LittleGame --name littlegame

:: es5
cd %CURPROJECT%\Client\babel1
littlegame.bat