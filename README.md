# GESTION CENTRE DEUXIÈME CHANCE

Application professionnelle, moderne et autonome de gestion d'un centre de deuxième chance.
Conçue spécifiquement pour fonctionner sur un **réseau local (Wi-Fi / Ethernet)** avec un **PC principal qui sert de serveur et stocke l'intégralité des données**, sans obligation d'accès au Cloud ni dépendance externe à Internet.

---

## 🏛️ Architecture

```text
                    RÉSEAU LOCAL (Wi-Fi / Ethernet)
                                 │
                        ┌────────▼────────┐
                        │   PC SERVEUR    │
                        │                 │
                        │ Serveur Express │
                        │ Base locale     │
                        │ Sauvegardes     │
                        └────────┬────────┘
                                 │
             ┌───────────────────┼───────────────────┐
             │                   │                   │
      PC Secrétariat         PC Direction        Smartphones
     (Navigateur Web)     (Navigateur Web)      (App Android)
```

---

## 🚀 Démarrage Rapide

### Sur le PC Serveur Principal :
1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Démarrer le serveur local :
   ```bash
   npm run dev
   ```
   *Le serveur démarre sur le port 3000 et écoute sur `0.0.0.0` (toutes les cartes réseaux).*
3. Ouvrir l'application dans votre navigateur :
   - Sur le serveur : `http://localhost:3000`
   - Sur les autres PC du centre : `http://192.168.x.x:3000`
   - Sur smartphones : Scanner le QR Code affiché sur la page "Connecter un appareil".

---

## 📦 Structure du Projet

```text
gestion-centre-deuxieme-chance/
├── server.ts             # Point d'entrée serveur Express + Vite middleware (0.0.0.0:3000)
├── server/
│   ├── server-core.ts    # Détection automatique de l'IP LAN & génération QR Code
│   ├── db.ts             # Moteur de base de données locale sécurisée & sauvegardes
│   └── api.ts            # API REST complète (Bénéficiaires, Formations, etc.)
├── database/
│   ├── schema.sql        # Schéma PostgreSQL complet avec contraintes & index
│   ├── seed.sql          # Données de démarrage
│   └── local-data.json   # Base de données locale sécurisée sur le PC
├── backups/              # Répertoire des sauvegardes automatiques & manuelles
├── electron/
│   ├── main.js           # Wrapper desktop avec icône de notification Windows
│   ├── package.json      # Configuration electron-builder
│   └── installer.iss     # Script Inno Setup pour Gestion_Centre_Deuxieme_Chance_Setup.exe
├── android/
│   ├── capacitor.config.json # Configuration APK Android avec autorisations LAN
│   └── README.md         # Guide de compilation APK
├── docs/                 # Guides d'installation et schémas réseau
├── scripts/              # Scripts Windows (.bat) pour démarrage et pare-feu
└── src/                  # Interface utilisateur React + Tailwind CSS
```

---

## 👥 Rôles et Permissions intégrés
- **Administrateur** : Contrôle total, gestion des utilisateurs, sauvegardes, configuration serveur.
- **Directeur** : Consultation globale, validation des dossiers, rapports et statistiques.
- **Gestionnaire** : Inscriptions des bénéficiaires, gestion des formations, dossiers.
- **Éducateur** : Suivi des dossiers sociaux, organisation des activités, entretiens.
- **Formateur** : Feuilles d'émargement et pointage des présences quotidiennes.
- **Agent** : Accueil, saisie initiale des bénéficiaires.
- **Consultation** : Lecture seule.

---

## 🔐 Mode Hors-Internet & Résilience Réseau
- L'application est **100% opérationnelle sans connexion Internet**.
- Si le Wi-Fi est temporairement perturbé, les smartphones conservent les saisies dans leur file d'attente locale et synchronisent dès le retour de la portée du signal du PC serveur.
