call loadlib.bat %1
cd..\..\
set trunk=%cd%
cd %trunk%\gameclient
tsc --outDir %trunk%\gameclient\tscbin\js --removeComments true --pretty false
cd cmd
pause
