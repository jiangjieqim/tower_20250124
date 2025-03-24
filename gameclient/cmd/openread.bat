call loadlib.bat %1
cd %QATOOLS%

node openbrower.js --url http://127.0.0.1:8001/github/jjqmdlib/entry/doc.html?file=Project1/Client/doc/read.md

@REM ?file=read.md