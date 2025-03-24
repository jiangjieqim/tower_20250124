
@REM @REM call buildxlsx_new.bat
@REM call init_node.bat
@REM ::call loadlib.bat %1

@REM @REM 清理svn 解决冲突
@REM @REM call svnclear.bat haslib

@REM cd %MYCMD%

@REM if not exist %trunk%\rev_out ( %qatools%/msgbox "WARNING without %trunk%\rev_out... AUTO create!" & pause & md "%trunk%\rev_out" )

@REM :: 构建配置表
@REM call buildxlsx_new.bat haslib


@REM cd %MYCMD%
@REM @REM copy.bat

@REM :: 提交配置相关
@REM cd %trunk%\out

@REM set user=--username jiangjieqi --password 123456
@REM echo %cd%
@REM svn commit %trunk%\out\cfg.ts -m "this is commit cfg.ts message!" %user%
@REM svn commit %trunk%\out\cfg2.ts -m "this is commit cfg2.ts" %user%

@REM cd %trunk%\resource\o\config
@REM svn commit export -m "commit %trunk%\resource\o\config\export %date% %time%" %user%


@REM @REM cd %trunk%\upload
@REM @REM svn commit all.bin -m "upload %date% %time% all.bin" %user%

@REM if not exist %trunk%\rev_out ( goto next )
@REM     cd %trunk%\rev_out
@REM     echo "online_excel.bat--->svn commit all.bin..." & svn commit all.bin -m "--->upload %date% %time% all.bin" %user%
@REM :next

@REM cd %MYCMD%
@REM call get_res_version.bat 

@REM cd %MYCMD%
@REM if "%1" == "no_showinfo" ( echo "end..." ) else ( call showinfo.bat )

cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd online_excel %workspaceFolder%