:: ע��
:: ��jenkins����Ҫ����APPDATA��ֵ
:: set APPDATA="C:\Users\Administrator\AppData\Roaming"
:: d:
:: cd D:\Project1\Client\trunk\gameclient\cmd
:: exportUI_Atlas.bat

@REM call svn_up.bat %trunk%/gameclient_ui
@REM cd %QATOOLS%
@REM node ui_export.js --trunk %trunk% -atlas
@REM cd %trunk%\gameclient\cmd

@REM exportUI.bat atlas %1





cd..
set workspaceFolder=%cd%
cd..\..\..\
call project_config cmd exportUI %workspaceFolder% atlas