@REM echo off
call init_node.bat

@REM echo %trunk%
@REM echo %CLIENT%

@REM cd %CURPROJECT%/Client/excel/trunk
@REM explorer .

@REM http://www.doczj.com/doc/0f1704262.html

@REM C:\Users\Anita>set /a 1+2
@REM set /a var = 1 + 2
@REM echo %var%


@REM call:myDosFunc %CLIENT%
@REM set a=%len%

@REM call:myDosFunc %trunk%
@REM set b=%len%

@REM set /a sub = %b% - %a%

@REM echo %sub%

@REM echo %trunk:~18,24%


@REM ::---------------------------------------------------------------------
@REM ::--函数定义
@REM ::---------------------------------------------------------------------
@REM :myDosFunc
@REM     set "str=%~1"
@REM     @REM echo %str%

@REM     set/p"=%str%"<nul>$
@REM     @REM for %%i in ("$") do echo,length %%~zi bytes
@REM     for %%i in ("$") do set len=%%~zi
@REM     del /f $
@REM     @REM echo %len%
@REM goto:eof


cd %QATOOLS%
node openfold.js --trunk %trunk% --file %~1

exit /b