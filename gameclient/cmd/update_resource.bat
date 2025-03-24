call loadlib.bat %1
cd %trunk%\resource
svn cleanup
svn up
svn log -l %SVN_LOG_NUM% -v
cd %trunk%\gameclient\cmd

