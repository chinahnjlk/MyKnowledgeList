@echo off

%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\installutil.exe E:\XXX.exe
Net Start ��������
sc config �������� start= auto
pause
