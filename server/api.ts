import { Router, Request, Response } from 'express';
import { getLocalNetworkInterfaces, getPreferredLanIp, generateServerQrCode } from './server-core';
import { localDb, Beneficiaire, Dossier, Formation, Presence, Activite, Utilisateur } from './db';

export const apiRouter = Router();

// Middleware pour journaliser les requêtes entrantes
apiRouter.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Device-Id');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ==========================================
// 1. ÉTAT DU SERVEUR LOCAL & RÉSEAU LAN
// ==========================================
apiRouter.get('/server/status', async (req: Request, res: Response) => {
  const dbData = localDb.getData();
  const lanIp = getPreferredLanIp();
  const port = Number(process.env.PORT) || dbData.parametres.portServeur || 3000;
  const serverUrl = `http://${lanIp}:${port}`;
  const allInterfaces = getLocalNetworkInterfaces();
  const qrCodeDataUrl = await generateServerQrCode(serverUrl);

  const lastBackup = dbData.sauvegardes[0]?.date || null;
  const activeDevices = dbData.appareils.filter(d => d.statut === 'Actif').length;

  res.json({
    status: 'actif',
    mode: 'Serveur Local LAN',
    host: '0.0.0.0',
    port,
    serverIp: lanIp,
    serverUrl,
    allInterfaces,
    qrCodeDataUrl,
    uptimeSeconds: Math.floor(process.uptime()),
    databaseStatus: 'operationnelle',
    connectedDevicesCount: activeDevices,
    lastBackupDate: lastBackup,
    centerName: dbData.parametres.nomCentre,
    directeur: dbData.parametres.directeur,
    localModeStrict: dbData.parametres.modeLocalStrict,
    version: dbData.parametres.version,
    totalBeneficiaires: dbData.beneficiaires.length
  });
});

// Génération / regénération du QR Code
apiRouter.get('/server/qrcode', async (req: Request, res: Response) => {
  const lanIp = getPreferredLanIp();
  const port = Number(process.env.PORT) || 3000;
  const customIp = (req.query.ip as string) || lanIp;
  const customPort = (req.query.port as string) || port;
  const targetUrl = `http://${customIp}:${customPort}`;
  const qrDataUrl = await generateServerQrCode(targetUrl);

  res.json({
    targetUrl,
    qrCodeDataUrl: qrDataUrl
  });
});

// ==========================================
// 2. APPAREILS CONNECTÉS & DÉTECTION LAN
// ==========================================
apiRouter.get('/devices', (req: Request, res: Response) => {
  const dbData = localDb.getData();
  res.json(dbData.appareils);
});

apiRouter.post('/devices/register', (req: Request, res: Response) => {
  const { nomAppareil, type, utilisateur } = req.body;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const cleanIp = String(clientIp).replace('::ffff:', '');
  const now = new Date().toISOString();

  let registeredDevice: any = null;

  localDb.update(draft => {
    const existingIndex = draft.appareils.findIndex(
      d => d.adresseIp === cleanIp || (d.nomAppareil === nomAppareil && d.utilisateur === utilisateur)
    );

    if (existingIndex >= 0) {
      draft.appareils[existingIndex].derniereConnexion = now;
      draft.appareils[existingIndex].statut = 'Actif';
      draft.appareils[existingIndex].userAgent = req.headers['user-agent'] || 'App Client';
      registeredDevice = draft.appareils[existingIndex];
    } else {
      registeredDevice = {
        id: `DEV-${Date.now()}`,
        nomAppareil: nomAppareil || `Appareil ${cleanIp}`,
        type: type || 'Smartphone',
        utilisateur: utilisateur || 'Agent Local',
        adresseIp: cleanIp,
        derniereConnexion: now,
        statut: 'Actif',
        userAgent: req.headers['user-agent'] || 'App Client'
      };
      draft.appareils.push(registeredDevice);
    }
  });

  localDb.addAuditLog(utilisateur || 'Appareil', 'Connexion appareil', `Appareil: ${nomAppareil} (${cleanIp})`, cleanIp);

  res.json({ success: true, device: registeredDevice });
});

apiRouter.put('/devices/:id/toggle', (req: Request, res: Response) => {
  const { id } = req.params;
  let updatedDevice: any = null;

  localDb.update(draft => {
    const dev = draft.appareils.find(d => d.id === id);
    if (dev) {
      dev.statut = dev.statut === 'Actif' ? 'Désactivé' : 'Actif';
      updatedDevice = dev;
    }
  });

  if (!updatedDevice) {
    return res.status(404).json({ error: 'Appareil introuvable' });
  }

  localDb.addAuditLog('Administrateur', 'Modification statut appareil', `${updatedDevice.nomAppareil}: ${updatedDevice.statut}`);
  res.json({ success: true, device: updatedDevice });
});

// Heartbeat pour maintenir la liste des appareils en ligne
apiRouter.post('/devices/ping', (req: Request, res: Response) => {
  const { deviceId } = req.body;
  const now = new Date().toISOString();
  if (deviceId) {
    localDb.update(draft => {
      const dev = draft.appareils.find(d => d.id === deviceId);
      if (dev) {
        dev.derniereConnexion = now;
      }
    });
  }
  res.json({ pong: true, time: now, server: 'Gestion Centre Deuxième Chance LAN' });
});

// ==========================================
// 3. TABLEAU DE BORD (STATS GLOBALES)
// ==========================================
apiRouter.get('/stats', (req: Request, res: Response) => {
  const dbData = localDb.getData();
  const totalBeneficiaires = dbData.beneficiaires.length;
  const actifs = dbData.beneficiaires.filter(b => b.statut === 'Actif' || b.statut === 'En formation').length;
  const enFormation = dbData.beneficiaires.filter(b => b.statut === 'En formation').length;
  const dossiersOuverts = dbData.dossiers.filter(d => d.statut === 'Ouvert' || d.statut === 'En cours').length;
  const dossiersTermines = dbData.dossiers.filter(d => d.statut === 'Terminé' || d.statut === 'Clôturé').length;
  const formationsEnCours = dbData.formations.filter(f => f.statut === 'En cours').length;

  const today = new Date().toISOString().split('T')[0];
  const presencesAujourdhui = dbData.presences.filter(p => p.date === today);
  const presentsCount = presencesAujourdhui.filter(p => p.statut === 'Présent').length;

  res.json({
    totalBeneficiaires,
    beneficiairesActifs: actifs,
    beneficiairesEnFormation: enFormation,
    formationsEnCours,
    dossiersOuverts,
    dossiersTermines,
    presencesAujourdhuiCount: presencesAujourdhui.length,
    presentsAujourdhuiCount: presentsCount,
    tauxPresence: presencesAujourdhui.length > 0 ? Math.round((presentsCount / presencesAujourdhui.length) * 100) : 100,
    activitesRecentes: dbData.activites.slice(0, 5),
    derniersBeneficiaires: dbData.beneficiaires.slice(0, 5),
    derniersDossiers: dbData.dossiers.slice(0, 5)
  });
});

// ==========================================
// 4. MODULE BÉNÉFICIAIRES
// ==========================================
apiRouter.get('/beneficiaires', (req: Request, res: Response) => {
  const { q, statut, formationId } = req.query;
  let list = localDb.getData().beneficiaires;

  if (q && typeof q === 'string') {
    const term = q.toLowerCase();
    list = list.filter(b =>
      b.nom.toLowerCase().includes(term) ||
      b.prenom.toLowerCase().includes(term) ||
      b.cin.toLowerCase().includes(term) ||
      b.id.toLowerCase().includes(term) ||
      b.telephone.includes(term)
    );
  }

  if (statut && typeof statut === 'string') {
    list = list.filter(b => b.statut === statut);
  }

  if (formationId && typeof formationId === 'string') {
    const form = localDb.getData().formations.find(f => f.id === formationId);
    if (form) {
      list = list.filter(b => form.inscritsIds.includes(b.id));
    }
  }

  res.json(list);
});

apiRouter.get('/beneficiaires/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const b = localDb.getData().beneficiaires.find(item => item.id === id);
  if (!b) return res.status(404).json({ error: 'Bénéficiaire introuvable' });

  const dossiers = localDb.getData().dossiers.filter(d => d.beneficiaireId === id);
  const presences = localDb.getData().presences.filter(p => p.beneficiaireId === id);
  const formations = localDb.getData().formations.filter(f => f.inscritsIds.includes(id));
  const documents = localDb.getData().documents.filter(doc => doc.beneficiaireId === id);

  res.json({ ...b, dossiers, presences, formations, documents });
});

apiRouter.post('/beneficiaires', (req: Request, res: Response) => {
  const body = req.body;
  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const count = localDb.getData().beneficiaires.length + 1;
  const newId = `BEN-${year}-${String(count).padStart(3, '0')}`;

  const newBeneficiaire: Beneficiaire = {
    id: body.id || newId,
    nom: body.nom || '',
    prenom: body.prenom || '',
    dateNaissance: body.dateNaissance || '',
    cin: body.cin || '',
    telephone: body.telephone || '',
    adresse: body.adresse || '',
    ville: body.ville || 'Casablanca',
    situationFamiliale: body.situationFamiliale || 'Célibataire',
    niveauScolaire: body.niveauScolaire || '',
    profession: body.profession || 'Sans emploi',
    dateInscription: body.dateInscription || now.split('T')[0],
    statut: body.statut || 'Actif',
    photoUrl: body.photoUrl || '',
    notes: body.notes || '',
    dateMiseAJour: now
  };

  localDb.update(draft => {
    draft.beneficiaires.unshift(newBeneficiaire);
  });

  localDb.addAuditLog('Agent', 'Création bénéficiaire', `${newBeneficiaire.prenom} ${newBeneficiaire.nom} (${newBeneficiaire.id})`);
  res.status(201).json(newBeneficiaire);
});

apiRouter.put('/beneficiaires/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let updated: Beneficiaire | null = null;
  const now = new Date().toISOString();

  localDb.update(draft => {
    const index = draft.beneficiaires.findIndex(b => b.id === id);
    if (index >= 0) {
      draft.beneficiaires[index] = {
        ...draft.beneficiaires[index],
        ...req.body,
        id, // Empêcher la modification de l'ID
        dateMiseAJour: now
      };
      updated = draft.beneficiaires[index];
    }
  });

  if (!updated) return res.status(404).json({ error: 'Bénéficiaire introuvable' });

  localDb.addAuditLog('Agent', 'Modification bénéficiaire', `${(updated as Beneficiaire).prenom} ${(updated as Beneficiaire).nom}`);
  res.json(updated);
});

apiRouter.delete('/beneficiaires/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { permanent } = req.query;
  let deleted: Beneficiaire | null = null;

  localDb.update(draft => {
    const index = draft.beneficiaires.findIndex(b => b.id === id);
    if (index >= 0) {
      if (permanent === 'true') {
        deleted = draft.beneficiaires.splice(index, 1)[0];
      } else {
        draft.beneficiaires[index].statut = 'Archivé';
        deleted = draft.beneficiaires[index];
      }
    }
  });

  if (!deleted) return res.status(404).json({ error: 'Bénéficiaire introuvable' });

  localDb.addAuditLog('Agent', permanent === 'true' ? 'Suppression définitive' : 'Archivage bénéficiaire', `ID: ${id}`);
  res.json({ success: true, message: permanent === 'true' ? 'Supprimé définitivement' : 'Archivé avec succès' });
});

// ==========================================
// 5. MODULE DOSSIERS
// ==========================================
apiRouter.get('/dossiers', (req: Request, res: Response) => {
  const { beneficiaireId, statut } = req.query;
  let list = localDb.getData().dossiers;

  if (beneficiaireId && typeof beneficiaireId === 'string') {
    list = list.filter(d => d.beneficiaireId === beneficiaireId);
  }
  if (statut && typeof statut === 'string') {
    list = list.filter(d => d.statut === statut);
  }

  // Joindre avec le nom du bénéficiaire
  const benefMap = new Map(localDb.getData().beneficiaires.map(b => [b.id, `${b.prenom} ${b.nom}`]));
  const enhanced = list.map(d => ({
    ...d,
    beneficiaireNom: benefMap.get(d.beneficiaireId) || 'Inconnu'
  }));

  res.json(enhanced);
});

apiRouter.post('/dossiers', (req: Request, res: Response) => {
  const body = req.body;
  const count = localDb.getData().dossiers.length + 1;
  const year = new Date().getFullYear();
  const newDossier: Dossier = {
    id: `DOS-${year}-${String(count).padStart(3, '0')}`,
    numero: `DOS-${String(count).padStart(3, '0')}`,
    beneficiaireId: body.beneficiaireId,
    dateCreation: body.dateCreation || new Date().toISOString().split('T')[0],
    type: body.type || 'Accompagnement social',
    description: body.description || '',
    responsable: body.responsable || 'Conseiller',
    statut: body.statut || 'Ouvert',
    notes: body.notes || '',
    documentsCount: 0
  };

  localDb.update(draft => {
    draft.dossiers.unshift(newDossier);
  });

  localDb.addAuditLog('Éducateur', 'Ouverture dossier', `Numéro: ${newDossier.numero}`);
  res.status(201).json(newDossier);
});

apiRouter.put('/dossiers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let updated: Dossier | null = null;

  localDb.update(draft => {
    const idx = draft.dossiers.findIndex(d => d.id === id);
    if (idx >= 0) {
      draft.dossiers[idx] = { ...draft.dossiers[idx], ...req.body, id };
      updated = draft.dossiers[idx];
    }
  });

  if (!updated) return res.status(404).json({ error: 'Dossier introuvable' });
  res.json(updated);
});

// ==========================================
// 6. MODULE FORMATIONS & INSCRIPTIONS
// ==========================================
apiRouter.get('/formations', (req: Request, res: Response) => {
  const list = localDb.getData().formations;
  res.json(list);
});

apiRouter.post('/formations', (req: Request, res: Response) => {
  const body = req.body;
  const count = localDb.getData().formations.length + 1;
  const newFormation: Formation = {
    id: `FOR-${String(count).padStart(2, '0')}`,
    titre: body.titre || '',
    formateur: body.formateur || '',
    dateDebut: body.dateDebut || '',
    dateFin: body.dateFin || '',
    lieu: body.lieu || 'Atelier Principal',
    capacite: Number(body.capacite) || 15,
    statut: body.statut || 'Planifiée',
    description: body.description || '',
    inscritsIds: body.inscritsIds || []
  };

  localDb.update(draft => {
    draft.formations.unshift(newFormation);
  });

  localDb.addAuditLog('Gestionnaire', 'Création formation', newFormation.titre);
  res.status(201).json(newFormation);
});

apiRouter.post('/formations/:id/inscrire', (req: Request, res: Response) => {
  const { id } = req.params;
  const { beneficiaireId } = req.body;
  let updated: Formation | null = null;

  localDb.update(draft => {
    const f = draft.formations.find(item => item.id === id);
    if (f) {
      if (!f.inscritsIds.includes(beneficiaireId)) {
        f.inscritsIds.push(beneficiaireId);
      }
      updated = f;
    }
  });

  if (!updated) return res.status(404).json({ error: 'Formation introuvable' });
  res.json(updated);
});

// ==========================================
// 7. MODULE PRÉSENCES
// ==========================================
apiRouter.get('/presences', (req: Request, res: Response) => {
  const { date, formationId, beneficiaireId } = req.query;
  let list = localDb.getData().presences;

  if (date && typeof date === 'string') {
    list = list.filter(p => p.date === date);
  }
  if (formationId && typeof formationId === 'string') {
    list = list.filter(p => p.formationId === formationId);
  }
  if (beneficiaireId && typeof beneficiaireId === 'string') {
    list = list.filter(p => p.beneficiaireId === beneficiaireId);
  }

  res.json(list);
});

apiRouter.post('/presences', (req: Request, res: Response) => {
  const body = req.body;
  const newPresence: Presence = {
    id: `PRE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    date: body.date || new Date().toISOString().split('T')[0],
    seance: body.seance || 'Matin',
    beneficiaireId: body.beneficiaireId,
    formationId: body.formationId,
    statut: body.statut || 'Présent',
    commentaire: body.commentaire || '',
    enregistrePar: body.enregistrePar || 'Formateur'
  };

  localDb.update(draft => {
    // Vérifier si une présence existe déjà pour cette même séance et bénéficiaire
    const existing = draft.presences.findIndex(
      p => p.date === newPresence.date && p.seance === newPresence.seance && p.beneficiaireId === newPresence.beneficiaireId
    );
    if (existing >= 0) {
      draft.presences[existing] = { ...draft.presences[existing], ...newPresence };
    } else {
      draft.presences.unshift(newPresence);
    }
  });

  res.status(201).json(newPresence);
});

// Enregistrement par lot (feuille de présence complète)
apiRouter.post('/presences/batch', (req: Request, res: Response) => {
  const { presences } = req.body;
  if (!Array.isArray(presences)) {
    return res.status(400).json({ error: 'Format invalide, tableau attendu' });
  }

  localDb.update(draft => {
    for (const p of presences) {
      const existing = draft.presences.findIndex(
        x => x.date === p.date && x.seance === p.seance && x.beneficiaireId === p.beneficiaireId
      );
      if (existing >= 0) {
        draft.presences[existing] = { ...draft.presences[existing], ...p };
      } else {
        draft.presences.unshift({
          id: `PRE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          ...p
        });
      }
    }
  });

  res.json({ success: true, count: presences.length });
});

// ==========================================
// 8. MODULE ACTIVITÉS
// ==========================================
apiRouter.get('/activites', (req: Request, res: Response) => {
  res.json(localDb.getData().activites);
});

apiRouter.post('/activites', (req: Request, res: Response) => {
  const body = req.body;
  const count = localDb.getData().activites.length + 1;
  const newAct: Activite = {
    id: `ACT-${String(count).padStart(2, '0')}`,
    nom: body.nom || '',
    type: body.type || 'Atelier CV',
    date: body.date || new Date().toISOString().split('T')[0],
    responsable: body.responsable || '',
    participantsIds: body.participantsIds || [],
    description: body.description || '',
    resultat: body.resultat || ''
  };

  localDb.update(draft => {
    draft.activites.unshift(newAct);
  });

  localDb.addAuditLog('Éducateur', 'Création activité', newAct.nom);
  res.status(201).json(newAct);
});

// ==========================================
// 9. MODULE DOCUMENTS
// ==========================================
apiRouter.get('/documents', (req: Request, res: Response) => {
  const { dossierId, beneficiaireId } = req.query;
  let list = localDb.getData().documents;

  if (dossierId && typeof dossierId === 'string') {
    list = list.filter(doc => doc.dossierId === dossierId);
  }
  if (beneficiaireId && typeof beneficiaireId === 'string') {
    list = list.filter(doc => doc.beneficiaireId === beneficiaireId);
  }

  res.json(list);
});

apiRouter.post('/documents', (req: Request, res: Response) => {
  const body = req.body;
  const newDoc = {
    id: `DOC-${Date.now()}`,
    dossierId: body.dossierId,
    beneficiaireId: body.beneficiaireId,
    nom: body.nom || 'Document.pdf',
    type: body.type || 'Document administratif',
    tailleKo: body.tailleKo || Math.floor(Math.random() * 400 + 100),
    dateUpload: new Date().toISOString().split('T')[0],
    nomFichier: body.nomFichier || `doc_${Date.now()}.pdf`
  };

  localDb.update(draft => {
    draft.documents.unshift(newDoc);
    if (newDoc.dossierId) {
      const dossier = draft.dossiers.find(d => d.id === newDoc.dossierId);
      if (dossier) dossier.documentsCount = (dossier.documentsCount || 0) + 1;
    }
  });

  res.status(201).json(newDoc);
});

// ==========================================
// 10. SAUVEGARDES & RESTAURATION
// ==========================================
apiRouter.get('/backups', (req: Request, res: Response) => {
  res.json(localDb.getData().sauvegardes);
});

apiRouter.post('/backups/create', (req: Request, res: Response) => {
  const { type } = req.body;
  const backup = localDb.createBackup(type === 'Automatique' ? 'Automatique' : 'Manuelle');
  res.json({ success: true, backup });
});

apiRouter.post('/backups/restore', (req: Request, res: Response) => {
  const { backupId } = req.body;
  if (!backupId) return res.status(400).json({ error: 'ID sauvegarde requis' });

  const ok = localDb.restoreBackup(backupId);
  if (ok) {
    res.json({ success: true, message: 'Base restaurée avec succès' });
  } else {
    res.status(500).json({ error: 'Échec de la restauration de la sauvegarde' });
  }
});

// ==========================================
// 11. SYNCHRONISATION HORS-LIGNE (SMARTPHONES)
// ==========================================
apiRouter.post('/sync', (req: Request, res: Response) => {
  const { changes, deviceId, user } = req.body;
  if (!Array.isArray(changes)) {
    return res.status(400).json({ error: 'Format invalide: tableau changes attendu' });
  }

  let appliedCount = 0;
  localDb.update(draft => {
    for (const change of changes) {
      if (change.type === 'create_presence') {
        draft.presences.unshift({
          id: `PRE-SYNC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          ...change.data
        });
        appliedCount++;
      } else if (change.type === 'create_beneficiaire') {
        draft.beneficiaires.unshift({
          id: `BEN-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
          ...change.data,
          dateMiseAJour: new Date().toISOString()
        });
        appliedCount++;
      } else if (change.type === 'update_dossier') {
        const d = draft.dossiers.find(x => x.id === change.data.id);
        if (d) {
          Object.assign(d, change.data);
          appliedCount++;
        }
      }
    }
  });

  localDb.addAuditLog(user || 'App Mobile', 'Synchronisation hors-ligne', `${appliedCount} modifications synchronisées`);
  res.json({ success: true, appliedCount, serverTime: new Date().toISOString() });
});

// ==========================================
// 12. UTILISATEURS & PERMISSIONS
// ==========================================
apiRouter.get('/users', (req: Request, res: Response) => {
  // Masquer les mots de passe
  const safeUsers = localDb.getData().utilisateurs.map(u => ({
    id: u.id,
    nom: u.nom,
    prenom: u.prenom,
    email: u.email,
    role: u.role,
    actif: u.actif,
    dateCreation: u.dateCreation
  }));
  res.json(safeUsers);
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, motDePasse } = req.body;
  const user = localDb.getData().utilisateurs.find(u => u.email.toLowerCase() === email?.toLowerCase());

  if (!user || user.motDePasse !== motDePasse) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }

  if (!user.actif) {
    return res.status(403).json({ error: 'Compte désactivé' });
  }

  localDb.addAuditLog(user.nom, 'Connexion réussie', `Rôle: ${user.role}`);
  res.json({
    token: `local-session-token-${user.id}-${Date.now()}`,
    user: {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role
    }
  });
});

// Journal d'audit
apiRouter.get('/audit', (req: Request, res: Response) => {
  res.json(localDb.getData().journal);
});

// Paramètres du centre
apiRouter.get('/parametres', (req: Request, res: Response) => {
  res.json(localDb.getData().parametres);
});

apiRouter.put('/parametres', (req: Request, res: Response) => {
  let updated: any = null;
  localDb.update(draft => {
    draft.parametres = { ...draft.parametres, ...req.body };
    updated = draft.parametres;
  });
  localDb.addAuditLog('Administrateur', 'Mise à jour paramètres', 'Configuration centre mise à jour');
  res.json(updated);
});
