@echo off
TITLE Configuration Pare-feu Windows - Centre Deuxieme Chance
COLOR 0B

echo ============================================================
echo   CONFIGURATION DU PARE-FEU WINDOWS (PORT 3000)
echo ============================================================
echo.
echo Ce script ouvre le port TCP 3000 uniquement pour le RESEAU LOCAL.
echo Cela permet aux smartphones et autres PC de joindre le serveur.
echo.

netsh advfirewall firewall delete rule name="Gestion Centre Deuxieme Chance (Port 3000)" >nul 2>&1

netsh advfirewall firewall add rule name="Gestion Centre Deuxieme Chance (Port 3000)" dir=in action=allow protocol=TCP localport=3000 profile=private,domain

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCES] La regle de pare-feu a ete ajoutee avec succes !
    echo Le serveur est maintenant accessible sur le reseau local Wi-Fi et Ethernet.
) else (
    echo.
    echo [ATTENTION] Veuillez executer ce script en tant qu'Administrateur (Clic-droit ^> Executer en tant qu'administrateur).
)

echo.
pause
