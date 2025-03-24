echo off

@REM call ftime.bat start1 clean.bat

@REM ping 127.0.0.1 -n 2

call loadlib.bat %1

::echo off
@REM set old=%cd%

cd %CURPROJECT%
svn cleanup

svn up

@REM echo clean END   %time%

@REM cd %old%
cd %MYCMD%

@REM call ftime.bat end clean.bat


