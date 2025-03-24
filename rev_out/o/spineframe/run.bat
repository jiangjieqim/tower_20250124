echo off
cd ..\..\..\gameclient

set workspaceFolder=%cd%


set cur1=%cd%

cd../../../

call project_config cmd spine2Ani %workspaceFolder%

cd %cur1%
cd../../../
call project_config cmd nginx_start

pause

