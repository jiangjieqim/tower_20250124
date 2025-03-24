call loadlib.bat %1
cd..
set client=%cd%
cd %qatools%
node visualizer_show.js -w %client%