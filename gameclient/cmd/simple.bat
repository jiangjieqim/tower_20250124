@REM echo off

@REM call loadlib.bat %1

call init_node.bat

echo RUN simple.bat

cd %QATOOLS%
node compile.js -w %trunk%\gameclient

cd %MYCMD%