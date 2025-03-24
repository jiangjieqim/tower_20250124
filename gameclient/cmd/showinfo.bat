call loadlib.bat %1
cd %QATOOLS%

node showinfo.js --trunk %trunk%

cd %trunk%\gameclient\cmd
