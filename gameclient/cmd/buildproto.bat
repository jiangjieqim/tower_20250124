call loadlib.bat %1

cd %qatools%
svn up
node buildproto.js --trunk %trunk%

::--cs   Csharp��������ʶ

pause