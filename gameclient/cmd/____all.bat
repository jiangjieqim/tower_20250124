echo off
echo RUN all... START %time%

call loadlib.bat %1

node -v

@REM 清理svn 解决冲突

@REM C:\project1\Client\trunk\gameclient
@REM cd %CURPROJECT%\Client\trunk
@REM svn resolved gameclient
@REM svn revert gameclient

cd %CLIENT%
svn resolved tools
svn revert tools

cd %trunk%\gameclient\src\game\static\json
svn resolved cfg.ts
svn revert cfg.ts

cd %MYCMD%

call svnclear.bat 

call up_all.bat 

call tsccheck.bat 

cd %trunk%\gameclient\cmd

::更新资源
call svn_up.bat %trunk%\resource

call online_excel.bat 

cd %trunk%
svn resolved gameclient
svn revert gameclient
cd %MYCMD%

:: 导出图集
call exportUI_Atlas.bat 

:: 字体压缩
call fontcompress.bat 

:: 编译
call tinycompile.bat 

@REM 压缩代码
call mini.bat 
copy %trunk%\gameclient\bin\js\bundle.js %trunk%\release\js\bundle.js

@REM this is something platform files.
call copyplatform.bat

::压缩resource资源生成到文件compress_resource中
call compress_res.bat 

::copy all bin
call svn_up.bat %trunk%\resource\remote\font
copy %trunk%\resource\o\config\export\all.bin %trunk%\compress_resource\o\config\export\all.bin

@REM ::生成版本控制文件=========================================================

call resverV2.bat 

@REM ::版控文件输出
call rev_out.bat 

cd %MYCMD%

call get_res_version.bat 

::=========================================================
echo ".................检测是否有mainfest.json文件"
cd %MYCMD%
cd ..
set workspaceFolder=%cd%
cd ..\..\..\
call project_config cmd all_again %workspaceFolder%
::=========================================================

echo END %time%