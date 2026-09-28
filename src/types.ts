export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
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
  beneficiaireNom?: string;
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

export interface ServerStatusData {
  status: string;
  mode: string;
  host: string;
  port: number;
  serverIp: string;
  serverUrl: string;
  allInterfaces: Array<{
    name: string;
    address: string;
    family: string;
    internal: boolean;
    type: string;
  }>;
  qrCodeDataUrl: string;
  uptimeSeconds: number;
  databaseStatus: string;
  connectedDevicesCount: number;
  lastBackupDate: string | null;
  centerName: string;
  directeur: string;
  localModeStrict: boolean;
  version: string;
  totalBeneficiaires: number;
}
