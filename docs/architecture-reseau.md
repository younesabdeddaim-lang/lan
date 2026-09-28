# Architecture Réseau Local - Gestion Centre Deuxième Chance

## 🌐 Schéma du Réseau Local

```text
                               RÉSEAU LOCAL DU CENTRE
                             (Routeur Wi-Fi / Switch LAN)
                                         │
                                         │ IP : 192.168.1.100 (DHCP Fixe conseillé)
                                ┌────────▼────────┐
                                │   PC SERVEUR    │
                                │                 │
                                │ Application     │
                                │ Serveur Express │
                                │ Base de données │
                                │ Sauvegardes     │
                                └────────┬────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 │                       │                       │
         ┌───────▼───────┐       ┌───────▼───────┐       ┌───────▼───────┐
         │   PC Bureau   │       │  PC Accueil   │       │  Smartphones  │
         │  (Directeur)  │       │ (Secrétariat) │       │ (Éducateurs)  │
         │ 192.168.1.102 │       │ 192.168.1.105 │       │ 192.168.1.112 │
         └───────────────┘       └───────────────┘       └───────────────┘
```

## 🔒 Principes d'indépendance et de sécurité
1. **Zéro dépendance au Cloud obligatoire** : Les données résident physiquement sur le disque dur du PC serveur (`database/local-data.json` ou PostgreSQL local).
2. **Fonctionnement hors Internet** : Même si le câble fibre ou 4G du centre est coupé, le Wi-Fi local continue de relier les postes et les téléphones au PC serveur.
3. **Écoute 0.0.0.0** : Le serveur Express écoute sur toutes les cartes réseaux pour autoriser les requêtes entrantes des terminaux connectés au sous-réseau.
4. **Pare-feu Windows ciblé** : Seules les machines du profil réseau Privé (LAN) ont l'autorisation de contacter le port 3000.
