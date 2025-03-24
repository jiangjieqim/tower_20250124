if %testnet_code% == 1 ( exit /b ) 
set svn_url=%1

@REM echo svn_up[%svn_url%]
@REM echo %SVN_CLOSE%
@REM if %SVN_CLOSE% equ 0 ( svn up %svn_url% )

if %SVN_CLOSE% == 0 ( svn up %svn_url% )
