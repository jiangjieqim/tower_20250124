@REM cd..\..\
@REM set CUR_DIR=%cd%
@REM cd out

@REM set pw=--username jiangjieqi --password 123456

@REM @REM cd c:\Project1\Client\trunk\out
@REM ::svn commit cfg.ts -m "this is commit cfg.ts message!" %pw%
@REM ::svn commit cfg2.ts -m "this is commit cfg2.ts"  %pw%

@REM svn commit %cd% -m "%date% %time% this is commit %cd%" %pw%
@REM cd %CUR_DIR%\resource\o\config
@REM svn commit export -m "%date% %time% this is commit %cd%" %pw%



cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd commit_cfg %workspaceFolder%