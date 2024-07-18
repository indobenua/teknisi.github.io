@echo off
echo Node usahakan versi 16.*
echo Jalankan dulu npm install

echo Removing old static files
rmdir /S /Q static\js
rmdir /S /Q static\css

echo Building app...
npm run build

echo Copying built files from dist into current directory
xcopy /E /I /Y dist\* .\

echo Done!