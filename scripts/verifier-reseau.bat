@echo off
TITLE Diagnostic Reseau LAN - Centre Deuxieme Chance
COLOR 0E

echo ============================================================
echo   DIAGNOSTIC DU RESEAU LOCAL (LAN / WI-FI)
echo ============================================================
echo.

ipconfig | findstr /i "IPv4 Adresse Subnet Passerelle"

echo.
echo ------------------------------------------------------------
echo Verification de l'ecoute sur le port 3000 :
netstat -ano | findstr :3000

echo.
echo Si vous voyez "LISTENING" avec 0.0.0.0:3000, le serveur fonctionne
echo parfaitement et accepte les connexions des autres appareils.
echo ------------------------------------------------------------
echo.
pause
