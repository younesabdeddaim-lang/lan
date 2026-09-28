import fs from 'fs';
import path from 'path';

export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string; // Stocké en hash ou token de session
  role: 'Administrateur' | 'Directeur' | 'Gestionnaire' | 'Éducateur' | 'Formateur' | 'Agent' | 'Consultation';
  actif: boolean;
  dateCreation: string;
}

export interface Beneficiaire {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  cin: string;
  telephone: string;
  adresse: string;
  ville: string;
  situationFamiliale: string;
  niveauScolaire: string;
  profession: string;
  dateInscription: string;
  statut: 'Actif' | 'En formation' | 'En attente' | 'Diplômé' | 'Abandon' | 'Archivé';
  photoUrl: string;
  notes: string;
  dateMiseAJour: string;
}

export interface Dossier {
  id: string;
  numero: string;
  beneficiaireId: string;
  dateCreation: string;
  type: 'Accompagnement social' | 'Formation professionnelle' | 'Orientation' | 'Insertion emploi' | 'Autre';
  description: string;
  responsable: string;
  statut: 'Ouvert' | 'En cours' | 'En attente' | 'Terminé' | 'Clôturé';
  notes: string;
  documentsCount: number;
}

export interface Formation {
  id: string;
  titre: string;
  formateur: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  capacite: number;
  statut: 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée';
  description: string;
  inscritsIds: string[];
}

export interface Presence {
  id: string;
  date: string;
  seance: 'Matin' | 'Après-midi' | 'Soir';
  beneficiaireId: string;
  formationId: string;
  statut: 'Présent' | 'Absent' | 'Retard' | 'Excusé';
  commentaire: string;
  enregistrePar: string;
}

export interface Activite {
  id: string;
  nom: string;
  type: 'Atelier CV' | 'Session motivation' | 'Visite entreprise' | 'Sport & Cohésion' | 'Conférence' | 'Autre';
  date: string;
  responsable: string;
  participantsIds: string[];
  description: string;
  resultat: string;
}

export interface DocumentItem {
  id: string;
  dossierId?: string;
  beneficiaireId?: string;
  nom: string;
  type: 'CIN' | 'Certificat' | 'Attestation' | 'Photo' | 'Document administratif' | 'Autre';
  tailleKo: number;
  dateUpload: string;
  nomFichier: string;
}

export interface AppareilConnecte {
  id: string;
  nomAppareil: string;
  type: 'PC' | 'Smartphone' | 'Tablette';
  utilisateur: string;
  adresseIp: string;
  derniereConnexion: string;
  statut: 'Actif' | 'Désactivé';
  userAgent?: string;
}

export interface Sauvegarde {
  id: string;
  nomFichier: string;
  date: string;
  tailleKo: number;
  type: 'Automatique' | 'Manuelle';
  chemin: string;
  totalRecords: number;
}

export interface JournalAudit {
  id: string;
  horodatage: string;
  utilisateur: string;
  action: string;
  details: string;
  ip: string;
}

export interface CentreParametres {
  nomCentre: string;
  slogan: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  directeur: string;
  portServeur: number;
  sauvegardesAutomatiques: boolean;
  frequenceSauvegardeHeures: number;
  modeLocalStrict: boolean;
  version: string;
}

export interface DatabaseSchema {
  parametres: CentreParametres;
  utilisateurs: Utilisateur[];
  beneficiaires: Beneficiaire[];
  dossiers: Dossier[];
  formations: Formation[];
  presences: Presence[];
  activites: Activite[];
  documents: DocumentItem[];
  appareils: AppareilConnecte[];
  sauvegardes: Sauvegarde[];
  journal: JournalAudit[];
}

const DB_DIR = path.resolve(process.cwd(), 'database');
const DB_FILE = path.join(DB_DIR, 'local-data.json');
const BACKUPS_DIR = path.resolve(process.cwd(), 'backups');

function ensureDirectories() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

function getDefaultData(): DatabaseSchema {
  const now = new Date().toISOString();
  return {
    parametres: {
      nomCentre: "Centre Deuxième Chance - Espoir & Avenir",
      slogan: "Insertion, Formation et Accompagnement Professionnel",
      adresse: "12 Avenue de l'Éducation et du Travail",
      ville: "Casablanca",
      telephone: "+212 5 22 00 11 22",
      email: "contact@centre-deuxieme-chance.ma",
      directeur: "M. Khalid Amrani",
      portServeur: 3000,
      sauvegardesAutomatiques: true,
      frequenceSauvegardeHeures: 2,
      modeLocalStrict: true,
      version: "1.0.0"
    },
    utilisateurs: [
      {
        id: "usr-admin-1",
        nom: "Benali",
        prenom: "Samir",
        email: "admin@centre.local",
        motDePasse: "admin123", // Dans l'installateur local, modifiable dès le premier démarrage
        role: "Administrateur",
        actif: true,
        dateCreation: now
      },
      {
        id: "usr-dir-1",
        nom: "Amrani",
        prenom: "Khalid",
        email: "directeur@centre.local",
        motDePasse: "directeur123",
        role: "Directeur",
        actif: true,
        dateCreation: now
      },
      {
        id: "usr-gest-1",
        nom: "Tazi",
        prenom: "Fatima",
        email: "gestion@centre.local",
        motDePasse: "gestion123",
        role: "Gestionnaire",
        actif: true,
        dateCreation: now
      },
      {
        id: "usr-educ-1",
        nom: "El Idrissi",
        prenom: "Yassine",
        email: "educateur@centre.local",
        motDePasse: "educ123",
        role: "Éducateur",
        actif: true,
        dateCreation: now
      },
      {
        id: "usr-form-1",
        nom: "Bouzid",
        prenom: "Amina",
        email: "formateur@centre.local",
        motDePasse: "format123",
        role: "Formateur",
        actif: true,
        dateCreation: now
      }
    ],
    beneficiaires: [
      {
        id: "BEN-2026-001",
        nom: "Mansouri",
        prenom: "Hamza",
        dateNaissance: "2006-04-12",
        cin: "BK789452",
        telephone: "06 12 34 56 78",
        adresse: "Rue 14, Hay Moulay Rachid",
        ville: "Casablanca",
        situationFamiliale: "Célibataire",
        niveauScolaire: "3ème année collège (abandon)",
        profession: "Sans emploi",
        dateInscription: "2026-01-15",
        statut: "En formation",
        photoUrl: "",
        notes: "Très motivé par les métiers de la menuiserie et du numérique.",
        dateMiseAJour: now
      },
      {
        id: "BEN-2026-002",
        nom: "Alami",
        prenom: "Sara",
        dateNaissance: "2007-08-23",
        cin: "BL998124",
        telephone: "06 98 76 54 32",
        adresse: "Derb Sultan, Rue 5",
        ville: "Casablanca",
        situationFamiliale: "Célibataire",
        niveauScolaire: "Tronc commun lycée",
        profession: "Sans emploi",
        dateInscription: "2026-02-01",
        statut: "En formation",
        photoUrl: "",
        notes: "Excellente aptitude en bureautique et infographie.",
        dateMiseAJour: now
      },
      {
        id: "BEN-2026-003",
        nom: "Chraibi",
        prenom: "Othmane",
        dateNaissance: "2005-11-04",
        cin: "BM441209",
        telephone: "06 45 11 22 33",
        adresse: "Hay El Farah, Rue 22",
        ville: "Casablanca",
        situationFamiliale: "Célibataire",
        niveauScolaire: "Niveau Primaire (6ème AEP)",
        profession: "Apprenti électricien",
        dateInscription: "2026-02-18",
        statut: "Actif",
        photoUrl: "",
        notes: "Suit un cursus de mise à niveau en français et électricité de base.",
        dateMiseAJour: now
      },
      {
        id: "BEN-2026-004",
        nom: "Zouhri",
        prenom: "Khadija",
        dateNaissance: "2008-01-30",
        cin: "BK633719",
        telephone: "06 77 88 99 00",
        adresse: "Sidi Bernoussi, Bloc 4",
        ville: "Casablanca",
        situationFamiliale: "Célibataire",
        niveauScolaire: "2ème année collège",
        profession: "Sans emploi",
        dateInscription: "2026-03-02",
        statut: "En formation",
        photoUrl: "",
        notes: "Formation en couture industrielle et confection.",
        dateMiseAJour: now
      }
    ],
    dossiers: [
      {
        id: "DOS-2026-001",
        numero: "DOS-001",
        beneficiaireId: "BEN-2026-001",
        dateCreation: "2026-01-16",
        type: "Formation professionnelle",
        description: "Parcours de qualification en électricité et maintenance générale.",
        responsable: "Yassine El Idrissi",
        statut: "En cours",
        notes: "Dossier validé par la commission d'admission du centre.",
        documentsCount: 2
      },
      {
        id: "DOS-2026-002",
        numero: "DOS-002",
        beneficiaireId: "BEN-2026-002",
        dateCreation: "2026-02-02",
        type: "Insertion emploi",
        description: "Accompagnement pour stage en secrétariat et bureautique.",
        responsable: "Fatima Tazi",
        statut: "Ouvert",
        notes: "Entretien initial réalisé le 03/02/2026.",
        documentsCount: 1
      },
      {
        id: "DOS-2026-003",
        numero: "DOS-003",
        beneficiaireId: "BEN-2026-003",
        dateCreation: "2026-02-20",
        type: "Accompagnement social",
        description: "Remise à niveau scolaire et soutien psychopédagogique.",
        responsable: "Yassine El Idrissi",
        statut: "En cours",
        notes: "Présence assidue aux ateliers du mercredi.",
        documentsCount: 1
      }
    ],
    formations: [
      {
        id: "FOR-01",
        titre: "Électricité du Bâtiment & Domotique",
        formateur: "M. Rachid Benmoussa",
        dateDebut: "2026-02-01",
        dateFin: "2026-07-31",
        lieu: "Atelier Technique B",
        capacite: 20,
        statut: "En cours",
        description: "Apprentissage des bases du câblage, sécurité électrique et lecture de plans.",
        inscritsIds: ["BEN-2026-001", "BEN-2026-003"]
      },
      {
        id: "FOR-02",
        titre: "Bureautique & Outils Numériques",
        formateur: "Mme. Amina Bouzid",
        dateDebut: "2026-02-15",
        dateFin: "2026-06-30",
        lieu: "Salle Informatique 1",
        capacite: 15,
        statut: "En cours",
        description: "Traitement de texte, tableurs, messagerie et navigation sécurisée.",
        inscritsIds: ["BEN-2026-002"]
      },
      {
        id: "FOR-03",
        titre: "Couture & Stylisme Confection",
        formateur: "Mme. Nezha Kadiri",
        dateDebut: "2026-03-01",
        dateFin: "2026-08-31",
        lieu: "Atelier Confection",
        capacite: 18,
        statut: "En cours",
        description: "Patronage, coupe, assemblage et utilisation des machines industrielles.",
        inscritsIds: ["BEN-2026-004"]
      }
    ],
    presences: [
      {
        id: "PRE-001",
        date: new Date().toISOString().split('T')[0],
        seance: "Matin",
        beneficiaireId: "BEN-2026-001",
        formationId: "FOR-01",
        statut: "Présent",
        commentaire: "Ponctuel et attentif",
        enregistrePar: "Amina Bouzid"
      },
      {
        id: "PRE-002",
        date: new Date().toISOString().split('T')[0],
        seance: "Matin",
        beneficiaireId: "BEN-2026-002",
        formationId: "FOR-02",
        statut: "Présent",
        commentaire: "Exercice terminé en avance",
        enregistrePar: "Amina Bouzid"
      },
      {
        id: "PRE-003",
        date: new Date().toISOString().split('T')[0],
        seance: "Matin",
        beneficiaireId: "BEN-2026-003",
        formationId: "FOR-01",
        statut: "Retard",
        commentaire: "Retard de 15 minutes justifié par le transport",
        enregistrePar: "Amina Bouzid"
      }
    ],
    activites: [
      {
        id: "ACT-01",
        nom: "Atelier CV & Techniques d'Entretien",
        type: "Atelier CV",
        date: "2026-03-15",
        responsable: "Yassine El Idrissi",
        participantsIds: ["BEN-2026-001", "BEN-2026-002"],
        description: "Simulation d'entretiens d'embauche et correction des CV personnalisés.",
        resultat: "12 CV finalisés et prêts pour la distribution."
      },
      {
        id: "ACT-02",
        nom: "Visite de l'Usine Somaca & Rencontre RH",
        type: "Visite entreprise",
        date: "2026-03-22",
        responsable: "Fatima Tazi",
        participantsIds: ["BEN-2026-001", "BEN-2026-003"],
        description: "Découverte des chaînes de montage et échange avec les maîtres d'apprentissage.",
        resultat: "Très forte impression des jeunes, 2 propositions de stages d'observation."
      }
    ],
    documents: [
      {
        id: "DOC-001",
        dossierId: "DOS-2026-001",
        beneficiaireId: "BEN-2026-001",
        nom: "Copie Carte d'Identité Nationale Hamza.pdf",
        type: "CIN",
        tailleKo: 420,
        dateUpload: "2026-01-16",
        nomFichier: "cin_ben_001.pdf"
      },
      {
        id: "DOC-002",
        dossierId: "DOS-2026-001",
        beneficiaireId: "BEN-2026-001",
        nom: "Attestation_Scolarite_Abandon.pdf",
        type: "Attestation",
        tailleKo: 650,
        dateUpload: "2026-01-16",
        nomFichier: "attest_scolaire_001.pdf"
      }
    ],
    appareils: [
      {
        id: "DEV-SERVEUR",
        nomAppareil: "PC SERVEUR PRINCIPAL (Ce PC)",
        type: "PC",
        utilisateur: "Samir Benali (Admin)",
        adresseIp: "127.0.0.1 / Local LAN",
        derniereConnexion: now,
        statut: "Actif",
        userAgent: "Local Server Native Host"
      },
      {
        id: "DEV-PC-ACCUEIL",
        nomAppareil: "PC Poste Accueil / Secrétariat",
        type: "PC",
        utilisateur: "Fatima Tazi (Gestionnaire)",
        adresseIp: "192.168.1.105",
        derniereConnexion: now,
        statut: "Actif",
        userAgent: "Windows Edge Client"
      },
      {
        id: "DEV-SMARTPHONE-1",
        nomAppareil: "Samsung Galaxy A54 (Éducateur)",
        type: "Smartphone",
        utilisateur: "Yassine El Idrissi",
        adresseIp: "192.168.1.112",
        derniereConnexion: now,
        statut: "Actif",
        userAgent: "Capacitor Mobile App / Android"
      }
    ],
    sauvegardes: [
      {
        id: "BAK-INIT",
        nomFichier: "sauvegarde_initiale_systeme.json",
        date: now,
        tailleKo: 48,
        type: "Automatique",
        chemin: "C:\\GestionDeuxiemeChance\\Backups\\sauvegarde_initiale_systeme.json",
        totalRecords: 25
      }
    ],
    journal: [
      {
        id: "LOG-001",
        horodatage: now,
        utilisateur: "Système Local",
        action: "Démarrage Serveur",
        details: "Le serveur local a été initialisé sur le port 3000 (0.0.0.0). Base de données opérationnelle.",
        ip: "127.0.0.1"
      }
    ]
  };
}

class LocalDatabase {
  private data: DatabaseSchema;
  private isSaving: boolean = false;

  constructor() {
    ensureDirectories();
    this.data = this.loadData();
    this.setupAutoBackup();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Erreur lecture base locale, utilisation du modèle par défaut:', e);
    }
    const initial = getDefaultData();
    this.persist(initial);
    return initial;
  }

  private persist(dataToSave: DatabaseSchema) {
    ensureDirectories();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Erreur écriture atomique base locale:', err);
      if (fs.existsSync(tempFile)) {
        try { fs.unlinkSync(tempFile); } catch {}
      }
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public update(updater: (draft: DatabaseSchema) => void): DatabaseSchema {
    updater(this.data);
    this.persist(this.data);
    return this.data;
  }

  public addAuditLog(utilisateur: string, action: string, details: string, ip: string = '127.0.0.1') {
    const log: JournalAudit = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      horodatage: new Date().toISOString(),
      utilisateur,
      action,
      details,
      ip
    };
    this.data.journal.unshift(log);
    if (this.data.journal.length > 500) {
      this.data.journal = this.data.journal.slice(0, 500);
    }
    this.persist(this.data);
  }

  public createBackup(type: 'Automatique' | 'Manuelle' = 'Manuelle'): Sauvegarde {
    ensureDirectories();
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const filename = `backup_centre_${timestamp}.json`;
    const fullPath = path.join(BACKUPS_DIR, filename);

    const snapshot = JSON.stringify(this.data, null, 2);
    fs.writeFileSync(fullPath, snapshot, 'utf-8');

    const totalRecords =
      this.data.beneficiaires.length +
      this.data.dossiers.length +
      this.data.formations.length +
      this.data.presences.length +
      this.data.activites.length +
      this.data.documents.length;

    const backupItem: Sauvegarde = {
      id: `BAK-${Date.now()}`,
      nomFichier: filename,
      date: now.toISOString(),
      tailleKo: Math.round(Buffer.byteLength(snapshot, 'utf-8') / 1024),
      type,
      chemin: fullPath,
      totalRecords
    };

    this.data.sauvegardes.unshift(backupItem);
    this.addAuditLog('Serveur Local', 'Sauvegarde créée', `Fichier: ${filename} (${type})`);
    this.persist(this.data);

    return backupItem;
  }

  public restoreBackup(backupId: string): boolean {
    const backup = this.data.sauvegardes.find(b => b.id === backupId);
    if (!backup) return false;

    if (!fs.existsSync(backup.chemin)) {
      console.error('Fichier de sauvegarde introuvable:', backup.chemin);
      return false;
    }

    try {
      const content = fs.readFileSync(backup.chemin, 'utf-8');
      const parsed = JSON.parse(content) as DatabaseSchema;
      this.data = parsed;
      this.persist(this.data);
      this.addAuditLog('Administrateur', 'Restauration base', `Restauration depuis ${backup.nomFichier}`);
      return true;
    } catch (e) {
      console.error('Erreur restauration:', e);
      return false;
    }
  }

  private setupAutoBackup() {
    // Sauvegarde automatique toutes les heures (en tâche de fond locale)
    setInterval(() => {
      try {
        if (this.data.parametres.sauvegardesAutomatiques) {
          this.createBackup('Automatique');
        }
      } catch (err) {
        console.error('Erreur sauvegarde automatique périodique:', err);
      }
    }, 60 * 60 * 1000);
  }
}

export const localDb = new LocalDatabase();
