echo off

@REM cd..
@REM SET LayaChrome="%cd%\.laya\chrome\Default\Cache"

@REM if not exist %LayaChrome% (
@REM    echo not found %LayaChrome%
@REM ) else (
@REM     echo found %LayaChrome%
@REM     cd %LayaChrome%
@REM     rd/s/q Cache
@REM )


@REM===================================================================
::删除默认的谷歌缓存
@REM C:

@REM SET FILE="%userprofile%\AppData\Local\Google\Chrome\User Data\Default\Cache"
@REM if not exist %FILE% (
@REM    echo not found %FILE%
@REM ) else (
@REM     echo found %FILE%
@REM     C:
@REM     cd %userprofile%\AppData\Local\Google\Chrome\User Data\Default\
@REM     rd/s/q Cache
@REM )

@REM cd %FILE%
@REM dir /B
@REM===================================================================

@REM cd .laya\chrome\Default\
@REM echo %cd%
@REM rd/s/q Cache

@REM===================================================================


@REM chrome://version/
@REM 个人资料路径	C:\Users\jiang\AppData\Local\Temp\.profile\Default
c:
cd "%userprofile%\AppData\Local\Temp\.profile\Default"
rd/s/q Cache
@REM echo %cd%