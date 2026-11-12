@echo off
rem Double-click to start the worker. Leave the window open.
powershell.exe -NoProfile -File "%~dp0Worker.ps1"
pause
