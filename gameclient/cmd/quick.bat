@REM echo RUN quick ... 

@REM @REM call ftime.bat start1 quick.bat

@REM @REM call loadlib.bat %1

@REM @REM exit /b

@REM call clean.bat

@REM ::清理svn 解决冲突
@REM call svnclear.bat

@REM @REM cd %trunk%\gameclient
@REM @REM svn up

@REM cd %MYCMD%
@REM :: 导出图集
@REM call exportUI_Atlas.bat

@REM :: 字体压缩
@REM call fontcompress.bat

@REM ::检查代码是否编译报错
@REM call tsccheck.bat

@REM cd %MYCMD%
@REM call tinycompile.bat

@REM @REM echo END %time%.
@REM @REM call ftime.bat end quick.bat

@REM @REM call ftime.bat end quick.bat

@REM cd %MYCMD%

@REM call create_config.bat

@REM cd %MYCMD%


cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd quick %workspaceFolder%