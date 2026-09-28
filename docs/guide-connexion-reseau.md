# Guide de Connexion Réseau & Résolution de Problèmes

## 1. Comment trouver l'adresse IP du Serveur
Dans l'application sur le PC Serveur, cliquez sur l'onglet **🖥️ Administration du Serveur** ou **📱 Connecter un Appareil**.
L'adresse s'affiche en grand avec son QR Code.

## 2. Si un Smartphone ne parvient pas à joindre le Serveur
Vérifiez les points suivants :
- Le smartphone est-il bien connecté au **même Wi-Fi** que le PC serveur ? (et pas sur la 4G/5G mobile).
- Le pare-feu Windows bloque-t-il le port ? Exécutez le script :
  `scripts\installer-firewall.bat` en tant qu'administrateur.
- Le type de réseau Windows sur le serveur est-il configuré en **Réseau Privé** ?
  (Sous Windows : Paramètres > Réseau et Internet > Wi-Fi/Ethernet > Définir sur "Réseau Privé").

## 3. Si l'accès Internet tombe
Aucune inquiétude : l'application fonctionne à 100% sur le réseau local Wi-Fi / Ethernet, sans nécessiter d'accès à Internet externe.
