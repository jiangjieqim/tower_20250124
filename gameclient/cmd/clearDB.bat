cd..\..\
set trunk=%cd%
d:
cd %trunk%\gameserver\bin\Redis-x64-3.2.100
dir
del dump.rdb

cd %trunk%\gameserver\bin\mongodb\bin 
del /q db 
cd db
dir
pause