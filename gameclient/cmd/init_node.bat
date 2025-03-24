@REM call config.bat

@REM @REM 服务器地址
@REM @REM set server=101.132.177.145:8002

@REM @REM 工具链所在文件夹
@REM set LIB_FOLD=Project1

@REM @REM ==========================================================================================
@REM set old=%cd%
@REM cd../../
@REM set TRUNK=%cd%

@REM set VSCODE=%TRUNK%\gameclient\.vscode

@REM cd %old%

@REM cd../../../../
@REM set CURPROJECT=%cd%

@REM cd..
@REM set desk=%cd%

@REM @REM echo %desk%

@REM @REM D:\Project1 
@REM set LIB_ROOT=%desk%%LIB_FOLD%

@REM cd %LIB_ROOT%\cmd
@REM call jenkins_config

@REM set jenkins_url=%jenkins_host%
@REM set server=%svn_server%

@REM @REM http://101.132.177.14:8080/
@REM @REM echo "jenkins_url is %jenkins_url%"
@REM @REM echo "svn server is %svn_server%"

@REM if exist project1_config.bat ( call project1_config )

@REM @REM set LIB_ROOT=D:/Project1

@REM set CLIENT=%CURPROJECT%\Client

@REM set QATOOLS=%LIB_ROOT%\Client\tools\qatools

@REM @REM 设置日志的数量
@REM set SVN_LOG_NUM=1

@REM @REM 关闭svn 1         开启svn 0

@REM ::开启svn更新
@REM set SVN_CLOSE=0 

@REM cd %QATOOLS%

@REM set PATH=%LIB_ROOT%\Client\tools\qatools\npm;%LIB_ROOT%\nodejs_10.24;%PROGRAMFILES%\TortoiseSVN\bin;%SystemRoot%\System32;%SystemRoot%;

@REM node testnet.js

@REM set testnet_code=%ERRORLEVEL%

@REM if %testnet_code% == 1 ( echo testnet_code fail!) 

@REM if %ERRORLEVEL% == 1 (set SVN_CLOSE=1) else (set SVN_CLOSE=0)

@REM @REM config.bat中设置
@REM if A%CONFIG_CLOSE_SVN%==A1 ( set SVN_CLOSE=1  ) else ( echo svn open)

@REM cd %CURPROJECT%

@REM cd %old%
@REM call svn_up.bat %QATOOLS%

@REM set node=%CURPROJECT%\nodejs_10.24

@REM set MYCMD=%trunk%\gameclient\cmd

@REM cd %MYCMD%


cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd lib %workspaceFolder%