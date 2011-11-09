@echo off
echo -- Building FAExtender extension --
echo Creating temporary folder
rmdir /S /Q build
mkdir build
xcopy /S src\* build\
echo Creating ZIP...
cd build\
"%ProgramFiles%\WinRAR\winrar.exe" -afzip -r m ../faextender.zip .
echo Renaming to XPI...
cd ..
move faextender.zip faextender.xpi
echo Cleaning up...
rmdir /S /Q build
echo Complete!