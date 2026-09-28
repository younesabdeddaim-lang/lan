import { Beneficiaire, Dossier, Formation, Presence, Activite, DocumentItem, AppareilConnecte, Sauvegarde, ServerStatusData, Utilisateur } from '../types';

const API_BASE = '/api';

// File d'attente hors-connexion stockée dans localStorage si le Wi-Fi tombe
const OFFLINE_QUEUE_KEY = 'centre_2e_chance_offline_queue';

export function getOfflineQueue(): any[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToOfflineQueue(item: any) {
  const queue = getOfflineQueue();
  queue.push(item);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export function clearOfflineQueue() {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
}

export const api = {
  // Statut du serveur
  async getServerStatus(): Promise<ServerStatusData> {
    const res = await fetch(`${API_BASE}/server/status`);
    if (!res.ok) throw new Error('Impossible de contacter le serveur local');
    return res.json();
  },

  async getServerQrCode(ip?: string, port?: number): Promise<{ targetUrl: string; qrCodeDataUrl: string }> {
    const query = new URLSearchParams();
    if (ip) query.set('ip', ip);
    if (port) query.set('port', String(port));
    const res = await fetch(`${API_BASE}/server/qrcode?${query.toString()}`);
    return res.json();
  },

  // Appareils
  async getDevices(): Promise<AppareilConnecte[]> {
    const res = await fetch(`${API_BASE}/devices`);
    return res.json();
  },

  async registerDevice(data: { nomAppareil: string; type: string; utilisateur: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/devices/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async toggleDevice(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/devices/${id}/toggle`, { method: 'PUT' });
    return res.json();
  },

  async pingDevice(deviceId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/devices/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId })
    });
    return res.json();
  },

  // Statistiques
  async getStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  // Bénéficiaires
  async getBeneficiaires(q?: string, statut?: string): Promise<Beneficiaire[]> {
    const query = new URLSearchParams();
    if (q) query.set('q', q);
    if (statut) query.set('statut', statut);
    const res = await fetch(`${API_BASE}/beneficiaires?${query.toString()}`);
    return res.json();
  },

  async getBeneficiaireById(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/beneficiaires/${id}`);
    return res.json();
  },

  async createBeneficiaire(data: Partial<Beneficiaire>): Promise<Beneficiaire> {
    const res = await fetch(`${API_BASE}/beneficiaires`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateBeneficiaire(id: string, data: Partial<Beneficiaire>): Promise<Beneficiaire> {
    const res = await fetch(`${API_BASE}/beneficiaires/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteBeneficiaire(id: string, permanent: boolean = false): Promise<any> {
    const res = await fetch(`${API_BASE}/beneficiaires/${id}?permanent=${permanent}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Dossiers
  async getDossiers(beneficiaireId?: string): Promise<Dossier[]> {
    const query = new URLSearchParams();
    if (beneficiaireId) query.set('beneficiaireId', beneficiaireId);
    const res = await fetch(`${API_BASE}/dossiers?${query.toString()}`);
    return res.json();
  },

  async createDossier(data: Partial<Dossier>): Promise<Dossier> {
    const res = await fetch(`${API_BASE}/dossiers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateDossier(id: string, data: Partial<Dossier>): Promise<Dossier> {
    const res = await fetch(`${API_BASE}/dossiers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Formations
  async getFormations(): Promise<Formation[]> {
    const res = await fetch(`${API_BASE}/formations`);
    return res.json();
  },

  async createFormation(data: Partial<Formation>): Promise<Formation> {
    const res = await fetch(`${API_BASE}/formations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async inscrireBeneficiaire(formationId: string, beneficiaireId: string): Promise<Formation> {
    const res = await fetch(`${API_BASE}/formations/${formationId}/inscrire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beneficiaireId })
    });
    return res.json();
  },

  // Présences
  async getPresences(date?: string, formationId?: string): Promise<Presence[]> {
    const query = new URLSearchParams();
    if (date) query.set('date', date);
    if (formationId) query.set('formationId', formationId);
    const res = await fetch(`${API_BASE}/presences?${query.toString()}`);
    return res.json();
  },

  async recordPresence(data: Partial<Presence>): Promise<Presence> {
    const res = await fetch(`${API_BASE}/presences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async recordPresencesBatch(presences: Partial<Presence>[]): Promise<any> {
    const res = await fetch(`${API_BASE}/presences/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presences })
    });
    return res.json();
  },

  // Activités
  async getActivites(): Promise<Activite[]> {
    const res = await fetch(`${API_BASE}/activites`);
    return res.json();
  },

  async createActivite(data: Partial<Activite>): Promise<Activite> {
    const res = await fetch(`${API_BASE}/activites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Documents
  async getDocuments(dossierId?: string, beneficiaireId?: string): Promise<DocumentItem[]> {
    const query = new URLSearchParams();
    if (dossierId) query.set('dossierId', dossierId);
    if (beneficiaireId) query.set('beneficiaireId', beneficiaireId);
    const res = await fetch(`${API_BASE}/documents?${query.toString()}`);
    return res.json();
  },

  async addDocument(data: Partial<DocumentItem>): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Sauvegardes
  async getBackups(): Promise<Sauvegarde[]> {
    const res = await fetch(`${API_BASE}/backups`);
    return res.json();
  },

  async createBackup(type: 'Manuelle' | 'Automatique' = 'Manuelle'): Promise<any> {
    const res = await fetch(`${API_BASE}/backups/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    return res.json();
  },

  async restoreBackup(backupId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/backups/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backupId })
    });
    return res.json();
  },

  // Utilisateurs
  async getUsers(): Promise<Utilisateur[]> {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  },

  // Synchronisation des modifications hors-ligne
  async syncOfflineChanges(user: string, deviceId: string): Promise<{ success: boolean; appliedCount: number }> {
    const queue = getOfflineQueue();
    if (queue.length === 0) return { success: true, appliedCount: 0 };

    const res = await fetch(`${API_BASE}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changes: queue, user, deviceId })
    });

    if (res.ok) {
      clearOfflineQueue();
      return res.json();
    }
    throw new Error('Échec de la synchronisation');
  },

  // Audit
  async getAuditLogs(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/audit`);
    return res.json();
  },

  // Paramètres
  async getParametres(): Promise<any> {
    const res = await fetch(`${API_BASE}/parametres`);
    return res.json();
  },

  async updateParametres(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/parametres`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
