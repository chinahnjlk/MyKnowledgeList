@echo off

%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\installutil.exe E:\XXX.exe
Net Start 服务名称
sc config 服务名称 start= auto
pause
