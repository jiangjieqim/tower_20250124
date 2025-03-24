call loadlib.bat %1

cd %trunk%\resource\o\config\export
svn commit all.bin -m "all.bin commit" --username jiangjieqi --password 123456
cd %old%