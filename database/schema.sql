-- ============================================================
-- BASE DE DONNÉES LOCALE : GESTION CENTRE DEUXIÈME CHANCE
-- SGBD Cible : PostgreSQL local sur le PC SERVEUR
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des Paramètres du Centre
CREATE TABLE IF NOT EXISTS centres (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'CENTRE-LOCAL',
    nom VARCHAR(255) NOT NULL,
    slogan VARCHAR(255),
    adresse TEXT,
    ville VARCHAR(100),
    telephone VARCHAR(50),
    email VARCHAR(100),
    directeur VARCHAR(150),
    port_serveur INT DEFAULT 3000,
    sauvegardes_automatiques BOOLEAN DEFAULT TRUE,
    frequence_sauvegarde_heures INT DEFAULT 2,
    mode_local_strict BOOLEAN DEFAULT TRUE,
    version VARCHAR(20) DEFAULT '1.0.0',
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des Utilisateurs et Rôles
CREATE TABLE IF NOT EXISTS utilisateurs (
    id VARCHAR(50) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Administrateur', 'Directeur', 'Gestionnaire', 'Éducateur', 'Formateur', 'Agent', 'Consultation')),
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des Bénéficiaires
CREATE TABLE IF NOT EXISTS beneficiaires (
    id VARCHAR(50) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    cin VARCHAR(50),
    telephone VARCHAR(50),
    adresse TEXT,
    ville VARCHAR(100) DEFAULT 'Casablanca',
    situation_familiale VARCHAR(100),
    niveau_scolaire VARCHAR(150),
    profession VARCHAR(150),
    date_inscription DATE DEFAULT CURRENT_DATE,
    statut VARCHAR(50) DEFAULT 'Actif' CHECK (statut IN ('Actif', 'En formation', 'En attente', 'Diplômé', 'Abandon', 'Archivé')),
    photo_url TEXT,
    notes TEXT,
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des Dossiers Bénéficiaires
CREATE TABLE IF NOT EXISTS dossiers (
    id VARCHAR(50) PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    beneficiaire_id VARCHAR(50) REFERENCES beneficiaires(id) ON DELETE CASCADE,
    date_creation DATE DEFAULT CURRENT_DATE,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    responsable VARCHAR(150),
    statut VARCHAR(50) DEFAULT 'Ouvert' CHECK (statut IN ('Ouvert', 'En cours', 'En attente', 'Terminé', 'Clôturé')),
    notes TEXT,
    documents_count INT DEFAULT 0
);

-- Table des Formations
CREATE TABLE IF NOT EXISTS formations (
    id VARCHAR(50) PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    formateur VARCHAR(150),
    date_debut DATE,
    date_fin DATE,
    lieu VARCHAR(150),
    capacite INT DEFAULT 15,
    statut VARCHAR(50) DEFAULT 'Planifiée' CHECK (statut IN ('Planifiée', 'En cours', 'Terminée', 'Annulée')),
    description TEXT
);

-- Table de liaison Inscriptions Formations
CREATE TABLE IF NOT EXISTS inscriptions (
    id VARCHAR(50) PRIMARY KEY,
    formation_id VARCHAR(50) REFERENCES formations(id) ON DELETE CASCADE,
    beneficiaire_id VARCHAR(50) REFERENCES beneficiaires(id) ON DELETE CASCADE,
    date_inscription DATE DEFAULT CURRENT_DATE,
    statut VARCHAR(50) DEFAULT 'Inscrit',
    UNIQUE (formation_id, beneficiaire_id)
);

-- Table des Présences
CREATE TABLE IF NOT EXISTS presences (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    seance VARCHAR(20) NOT NULL CHECK (seance IN ('Matin', 'Après-midi', 'Soir')),
    beneficiaire_id VARCHAR(50) REFERENCES beneficiaires(id) ON DELETE CASCADE,
    formation_id VARCHAR(50) REFERENCES formations(id) ON DELETE CASCADE,
    statut VARCHAR(20) NOT NULL CHECK (statut IN ('Présent', 'Absent', 'Retard', 'Excusé')),
    commentaire TEXT,
    enregistre_par VARCHAR(150),
    horodatage TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des Activités
CREATE TABLE IF NOT EXISTS activites (
    id VARCHAR(50) PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    responsable VARCHAR(150),
    description TEXT,
    resultat TEXT
);

-- Table de liaison Participants Activités
CREATE TABLE IF NOT EXISTS activite_participants (
    activite_id VARCHAR(50) REFERENCES activites(id) ON DELETE CASCADE,
    beneficiaire_id VARCHAR(50) REFERENCES beneficiaires(id) ON DELETE CASCADE,
    PRIMARY KEY (activite_id, beneficiaire_id)
);

-- Table des Documents
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(50) PRIMARY KEY,
    dossier_id VARCHAR(50) REFERENCES dossiers(id) ON DELETE SET NULL,
    beneficiaire_id VARCHAR(50) REFERENCES beneficiaires(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL CHECK (type IN ('CIN', 'Certificat', 'Attestation', 'Photo', 'Document administratif', 'Autre')),
    taille_ko INT DEFAULT 0,
    date_upload DATE DEFAULT CURRENT_DATE,
    nom_fichier VARCHAR(255)
);

-- Table des Appareils Connectés au LAN
CREATE TABLE IF NOT EXISTS appareils_connectes (
    id VARCHAR(50) PRIMARY KEY,
    nom_appareil VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('PC', 'Smartphone', 'Tablette')),
    utilisateur VARCHAR(150),
    adresse_ip VARCHAR(50) NOT NULL,
    derniere_connexion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'Actif' CHECK (statut IN ('Actif', 'Désactivé')),
    user_agent TEXT
);

-- Table des Sauvegardes
CREATE TABLE IF NOT EXISTS sauvegardes (
    id VARCHAR(50) PRIMARY KEY,
    nom_fichier VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    taille_ko INT,
    type VARCHAR(50) DEFAULT 'Automatique',
    chemin TEXT,
    total_records INT
);

-- Table du Journal d'Audit
CREATE TABLE IF NOT EXISTS journal_audit (
    id VARCHAR(50) PRIMARY KEY,
    horodatage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    utilisateur VARCHAR(150) NOT NULL,
    action VARCHAR(150) NOT NULL,
    details TEXT,
    ip VARCHAR(50)
);

-- Index pour performances locales
CREATE INDEX IF NOT EXISTS idx_beneficiaires_nom ON beneficiaires (nom, prenom);
CREATE INDEX IF NOT EXISTS idx_beneficiaires_cin ON beneficiaires (cin);
CREATE INDEX IF NOT EXISTS idx_presences_date ON presences (date, formation_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_beneficiaire ON dossiers (beneficiaire_id);
