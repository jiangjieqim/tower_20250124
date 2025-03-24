@REM :: 例子执行任务test2
@REM :: runJK test2

@REM echo off

@REM call loadlib.bat %3

@REM if %testnet_code% == 1 ( echo runJKCMD...%%1[%1] %%2[%2] fail.. & exit /b)

@REM set param=%1

@REM echo runJKCMD...%%1[%1] %%1[%2]

@REM set project1=%CURPROJECT%
@REM set path=%project1%\Client\tools\jenkins\jdk\jdk-17.0.1\bin

@REM if "%2"=="r" ( call:runjob )
@REM if "%2"=="w" ( call:watchjob )
@REM if "%2"=="" ( echo please set %%2 & exit /b )
@REM goto:eof

@REM :runjob
@REM echo runjob...
@REM java -jar "%project1%\Client\tools\jenkins\jenkins-cli.jar" -s %jenkins_url% -webSocket -auth admin:a build %param% -v -f -w
@REM ::java -version
@REM goto END

@REM @REM 显示日志
@REM :watchjob
@REM echo watchjob...
@REM java -jar "%project1%\Client\tools\jenkins\jenkins-cli.jar" -s %jenkins_url% -webSocket -auth admin:a console %param%
@REM goto END

@REM :END
@REM cd %MYCMD%
@REM exit /b

