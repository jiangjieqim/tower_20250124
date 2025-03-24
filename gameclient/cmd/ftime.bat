@REM exit /b



@REM if "%2" == "" ( set s = "" ) else ( set s=%2 )
@REM if "%1"=="end" ( goto end )
@REM if "%1"=="start1" (  goto start1 )

@REM goto:eof
@REM :end
@REM set /a temptime=%time:~0,2%*3600 + %time:~3,2%*60 + %time:~6,2%
@REM echo end %s% %temptime%
@REM goto:eof
@REM @REM set /a usetime=%end%-%start_p1%
@REM @REM echo %s% used %usetime% seconds

@REM :start1
@REM set /a temptime=%time:~0,2%*3600 + %time:~3,2%*60 + %time:~6,2% 
@REM echo start1 %s% %temptime%
@REM goto:eof