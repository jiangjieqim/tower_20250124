call loadlib.bat %1
cd %QATOOLS%

node buildInitConfig.js --trunk %trunk%

cd %MYCMD%