import React, { useState, useEffect } from 'react';
import { Menu, WifiOff, Wifi, RefreshCw, Smartphone, Laptop, Server } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { BeneficiairesView } from './components/BeneficiairesView';
import { DossiersView } from './components/DossiersView';
import { FormationsView } from './components/FormationsView';
import { PresencesView } from './components/PresencesView';
import { ActivitesView } from './components/ActivitesView';
import { DocumentsView } from './components/DocumentsView';
import { RapportsView } from './components/RapportsView';
import { SauvegardesView } from './components/SauvegardesView';
import { AppareilsView } from './components/AppareilsView';
import { ServeurAdminView } from './components/ServeurAdminView';
import { UtilisateursView } from './components/UtilisateursView';
import { ParametresView } from './components/ParametresView';
import { QrCodeModal } from './components/QrCodeModal';
import { NetworkStatusAlert } from './components/NetworkStatusAlert';
import { api, getOfflineQueue, addToOfflineQueue } from './services/api';
import {
  ServerStatusData,
  Beneficiaire,
  Dossier,
  Formation,
  Presence,
  Activite,
  DocumentItem,
  AppareilConnecte,
  Sauvegarde,
  Utilisateur
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [deviceMode, setDeviceMode] = useState<'serveur' | 'pc-client' | 'smartphone'>('serveur');

  // Données de l'application
  const [serverStatus, setServerStatus] = useState<ServerStatusData | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [presences, setPresences] = useState<Presence[]>([]);
  const [activites, setActivites] = useState<Activite[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [appareils, setAppareils] = useState<AppareilConnecte[]>([]);
  const [sauvegardes, setSauvegardes] = useState<Sauvegarde[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [parametres, setParametres] = useState<any>(null);

  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // Utilisateur simulé selon le mode appareil
  const currentUser = deviceMode === 'serveur'
    ? { nom: 'Samir Benali', role: 'Administrateur' }
    : deviceMode === 'pc-client'
    ? { nom: 'Fatima Tazi', role: 'Gestionnaire' }
    : { nom: 'Yassine El Idrissi', role: 'Éducateur' };

  const loadData = async () => {
    try {
      const [
        statusRes,
        statsRes,
        benefRes,
        dossRes,
        formRes,
        presRes,
        actRes,
        docRes,
        devRes,
        bakRes,
        usrRes,
        paramRes
      ] = await Promise.allSettled([
        api.getServerStatus(),
        api.getStats(),
        api.getBeneficiaires(),
        api.getDossiers(),
        api.getFormations(),
        api.getPresences(),
        api.getActivites(),
        api.getDocuments(),
        api.getDevices(),
        api.getBackups(),
        api.getUsers(),
        api.getParametres()
      ]);

      if (statusRes.status === 'fulfilled') setServerStatus(statusRes.value);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (benefRes.status === 'fulfilled') setBeneficiaires(benefRes.value);
      if (dossRes.status === 'fulfilled') setDossiers(dossRes.value);
      if (formRes.status === 'fulfilled') setFormations(formRes.value);
      if (presRes.status === 'fulfilled') setPresences(presRes.value);
      if (actRes.status === 'fulfilled') setActivites(actRes.value);
      if (docRes.status === 'fulfilled') setDocuments(docRes.value);
      if (devRes.status === 'fulfilled') setAppareils(devRes.value);
      if (bakRes.status === 'fulfilled') setSauvegardes(bakRes.value);
      if (usrRes.status === 'fulfilled') setUtilisateurs(usrRes.value);
      if (paramRes.status === 'fulfilled') setParametres(paramRes.value);

      setIsOnline(true);
    } catch (err) {
      console.warn('Mode hors-connexion ou serveur injoignable:', err);
      setIsOnline(false);
    }

    setOfflineQueueCount(getOfflineQueue().length);
  };

  useEffect(() => {
    loadData();

    // Heartbeat toutes les 15 secondes pour tester le réseau LAN et maintenir la session
    const interval = setInterval(() => {
      api.pingDevice('DEV-SERVEUR')
        .then(() => setIsOnline(true))
        .catch(() => setIsOnline(false));
      setOfflineQueueCount(getOfflineQueue().length);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Handlers Bénéficiaires
  const handleAddBeneficiaire = async (b: Partial<Beneficiaire>) => {
    if (!isOnline) {
      addToOfflineQueue({ type: 'create_beneficiaire', data: b });
      setOfflineQueueCount(getOfflineQueue().length);
      alert('Mode hors-ligne : Le bénéficiaire est enregistré dans la mémoire locale de l\'appareil et sera envoyé au PC Serveur dès rétablissement du Wi-Fi.');
      return;
    }
    const created = await api.createBeneficiaire(b);
    setBeneficiaires(prev => [created, ...prev]);
    loadData();
  };

  const handleUpdateBeneficiaire = async (id: string, b: Partial<Beneficiaire>) => {
    const updated = await api.updateBeneficiaire(id, b);
    setBeneficiaires(prev => prev.map(item => item.id === id ? updated : item));
    loadData();
  };

  const handleDeleteBeneficiaire = async (id: string, permanent: boolean = false) => {
    await api.deleteBeneficiaire(id, permanent);
    loadData();
  };

  // Handlers Dossiers
  const handleAddDossier = async (d: Partial<Dossier>) => {
    const created = await api.createDossier(d);
    setDossiers(prev => [created, ...prev]);
    loadData();
  };

  const handleUpdateDossier = async (id: string, d: Partial<Dossier>) => {
    const updated = await api.updateDossier(id, d);
    setDossiers(prev => prev.map(item => item.id === id ? updated : item));
    loadData();
  };

  // Handlers Formations & Inscriptions
  const handleAddFormation = async (f: Partial<Formation>) => {
    const created = await api.createFormation(f);
    setFormations(prev => [created, ...prev]);
    loadData();
  };

  const handleInscrire = async (formationId: string, beneficiaireId: string) => {
    const updated = await api.inscrireBeneficiaire(formationId, beneficiaireId);
    setFormations(prev => prev.map(f => f.id === formationId ? updated : f));
    loadData();
  };

  // Handlers Présences
  const handleSaveBatchPresences = async (list: Partial<Presence>[]) => {
    if (!isOnline) {
      list.forEach(p => {
        addToOfflineQueue({ type: 'create_presence', data: p });
      });
      setOfflineQueueCount(getOfflineQueue().length);
      alert('Mode hors-ligne : Les émargements sont conservés sur votre smartphone et seront synchronisés dès retour du Wi-Fi.');
      return;
    }
    await api.recordPresencesBatch(list);
    loadData();
  };

  // Handlers Activités
  const handleAddActivite = async (a: Partial<Activite>) => {
    const created = await api.createActivite(a);
    setActivites(prev => [created, ...prev]);
    loadData();
  };

  // Handlers Documents
  const handleAddDocument = async (doc: Partial<DocumentItem>) => {
    const created = await api.addDocument(doc);
    setDocuments(prev => [created, ...prev]);
    loadData();
  };

  // Handlers Sauvegardes
  const handleCreateBackup = async () => {
    await api.createBackup('Manuelle');
    loadData();
  };

  const handleRestoreBackup = async (backupId: string) => {
    await api.restoreBackup(backupId);
    loadData();
  };

  // Handlers Appareils
  const handleToggleDevice = async (id: string) => {
    await api.toggleDevice(id);
    loadData();
  };

  // Handlers Paramètres
  const handleSaveParametres = async (data: any) => {
    await api.updateParametres(data);
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Barre de navigation principale */}
      <Navbar
        serverStatus={serverStatus}
        onOpenQrCode={() => setIsQrModalOpen(true)}
        isOnline={isOnline}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        currentUser={currentUser}
        offlineQueueCount={offlineQueueCount}
      />

      {/* Barre de simulation & Bascule Wi-Fi */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-4 h-4" />
          </button>

          <span className="text-slate-400 hidden sm:inline">Mode actif :</span>
          <span className="font-semibold text-white flex items-center gap-1.5">
            {deviceMode === 'serveur' && <Server className="w-3.5 h-3.5 text-indigo-400" />}
            {deviceMode === 'pc-client' && <Laptop className="w-3.5 h-3.5 text-emerald-400" />}
            {deviceMode === 'smartphone' && <Smartphone className="w-3.5 h-3.5 text-amber-400" />}
            <span>
              {deviceMode === 'serveur' ? 'PC Serveur Central (Données locales directes)' :
               deviceMode === 'pc-client' ? 'Poste Client LAN (Accès via navigateur)' :
               'Smartphone Android (Wi-Fi + File d\'attente)'}
            </span>
          </span>
        </div>

        {/* Bouton de simulation Coupure Wi-Fi pour tester les sections 9 & 10 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isOnline
                ? 'bg-slate-800 hover:bg-rose-950 text-rose-300 border-slate-700 hover:border-rose-700'
                : 'bg-emerald-600 text-white border-emerald-500'
            }`}
            title="Tester le comportement de l'application si le Wi-Fi est coupé"
          >
            {isOnline ? (
              <>
                <WifiOff className="w-3 h-3 text-rose-400" />
                <span>Simuler coupure Wi-Fi</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-white" />
                <span>Rétablir Wi-Fi local</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Contenu principal : Sidebar + Module actif */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          isServerMode={deviceMode === 'serveur'}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                serverStatus={serverStatus}
                onNavigate={setCurrentTab}
                onOpenQr={() => setIsQrModalOpen(true)}
              />
            )}

            {currentTab === 'beneficiaires' && (
              <BeneficiairesView
                beneficiaires={beneficiaires}
                onAddBeneficiaire={handleAddBeneficiaire}
                onUpdateBeneficiaire={handleUpdateBeneficiaire}
                onDeleteBeneficiaire={handleDeleteBeneficiaire}
                onSelectBeneficiaireDossiers={(benefId) => {
                  setCurrentTab('dossiers');
                }}
              />
            )}

            {currentTab === 'dossiers' && (
              <DossiersView
                dossiers={dossiers}
                beneficiaires={beneficiaires}
                onAddDossier={handleAddDossier}
                onUpdateDossier={handleUpdateDossier}
              />
            )}

            {currentTab === 'formations' && (
              <FormationsView
                formations={formations}
                beneficiaires={beneficiaires}
                onAddFormation={handleAddFormation}
                onInscrire={handleInscrire}
              />
            )}

            {currentTab === 'presences' && (
              <PresencesView
                formations={formations}
                beneficiaires={beneficiaires}
                presences={presences}
                onSaveBatchPresences={handleSaveBatchPresences}
              />
            )}

            {currentTab === 'activites' && (
              <ActivitesView
                activites={activites}
                beneficiaires={beneficiaires}
                onAddActivite={handleAddActivite}
              />
            )}

            {currentTab === 'documents' && (
              <DocumentsView
                documents={documents}
                beneficiaires={beneficiaires}
                dossiers={dossiers}
                onAddDocument={handleAddDocument}
              />
            )}

            {currentTab === 'rapports' && (
              <RapportsView
                beneficiaires={beneficiaires}
                formations={formations}
                presences={presences}
                dossiers={dossiers}
                activites={activites}
              />
            )}

            {currentTab === 'sauvegardes' && (
              <SauvegardesView
                sauvegardes={sauvegardes}
                onCreateBackup={handleCreateBackup}
                onRestoreBackup={handleRestoreBackup}
              />
            )}

            {currentTab === 'appareils' && (
              <AppareilsView
                appareils={appareils}
                onToggleDevice={handleToggleDevice}
                onOpenQr={() => setIsQrModalOpen(true)}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'serveur' && (
              <ServeurAdminView
                serverStatus={serverStatus}
                onOpenQr={() => setIsQrModalOpen(true)}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'utilisateurs' && (
              <UtilisateursView utilisateurs={utilisateurs} />
            )}

            {currentTab === 'parametres' && (
              <ParametresView
                initialData={parametres}
                onSave={handleSaveParametres}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modal QR Code Connexion Réseau */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        serverStatus={serverStatus}
      />

      {/* Alerte Déconnexion & Synchronisation File d'Attente */}
      <NetworkStatusAlert
        isOnline={isOnline}
        onRetryConnection={loadData}
        pendingCount={offlineQueueCount}
        onSyncComplete={loadData}
      />
    </div>
  );
}
