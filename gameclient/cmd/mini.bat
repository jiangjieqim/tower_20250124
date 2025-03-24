call loadlib.bat %1

cd %QATOOLS%

node mini.js -i %trunk%

cd %MYCMD%
