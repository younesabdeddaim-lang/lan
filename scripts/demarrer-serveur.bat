@echo off
TITLE Serveur - Gestion Centre Deuxieme Chance
COLOR 0A

echo ============================================================
echo   GESTION CENTRE DEUXIEME CHANCE - DEMARRAGE DU SERVEUR
echo ============================================================
echo.
echo Verification des dependances locales...

cd /d "%~dp0\.."

REM Recuperation de l'adresse IP locale du PC
for /f "tokens=4" %%a in ('route print ^| findstr 0.0.0.0 ^| findstr /v "0.0.0.0.*0.0.0.0"') do (
    set LOCAL_IP=%%a
)

echo.
echo Adresse IP locale detectee : %LOCAL_IP%
echo Port d'ecoute              : 3000
echo.
echo ------------------------------------------------------------
echo  URL D'ACCES POUR CE PC        : http://localhost:3000
echo  URL D'ACCES RESEAU (AUTRES PC): http://%LOCAL_IP%:3000
echo  URL POUR LES SMARTPHONES      : http://%LOCAL_IP%:3000
echo ------------------------------------------------------------
echo.
echo Demarrage du serveur Node.js / Express en ecoute sur 0.0.0.0:3000...
echo.

start http://localhost:3000
npm run dev

pause
