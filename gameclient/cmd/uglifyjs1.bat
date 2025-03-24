@REM 压缩代码到微信

set old1=%cd%

call loadlib.bat %1

echo %CURPROJECT% 
cd %CURPROJECT% 
cd Client/babel1
call run.bat

cd %MYCMD%

uglifyjs -o %CURPROJECT%/Client/wx/js/uglifyjs_out.js %CURPROJECT%/Client/wx/js/out.js --mangle -c --define DEBUG=true
