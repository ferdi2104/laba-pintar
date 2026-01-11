@echo off
echo ==========================================
echo   OTOMATISASI UPLOAD KE GITHUB
echo   Laba Pintar Elite Project
echo ==========================================
echo.

:: Cek apakah git terinstal
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git tidak terdeteksi di laptop ini!
    echo Silakan download dan install Git dulu di: https://git-scm.com/downloads
    echo Setelah install, restart VS Code dan jalankan file ini lagi.
    echo.
    pause
    exit /b
)

echo Menginisialisasi Git...
git init

echo Menambahkan semua file website...
git add .

echo Menyimpan perubahan (Commit)...
git commit -m "Upload Final Laba Pintar Elite v2.5.0"

echo Mengatur cabang utama...
git branch -M main

echo Menghubungkan ke GitHub...
git remote add origin https://github.com/ferdi2104/laba-pintar.git
:: Jika remote sudah ada, abaikan errornya
git remote set-url origin https://github.com/ferdi2104/laba-pintar.git

echo Mendorong (Pushing) ke server...
git push -u origin main

echo.
echo ==========================================
echo   PROSES SELESAI!
echo ==========================================
pause
