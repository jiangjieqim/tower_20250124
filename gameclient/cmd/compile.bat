call loadlib.bat %1

@REM echo off
cd..
set client=%cd%
cd..\..\tools\qatools
@REM svn up
node compile.js -w %client%