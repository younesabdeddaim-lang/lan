import React, { useState } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

interface NetworkStatusAlertProps {
  isOnline: boolean;
  onRetryConnection: () => void;
  pendingCount: number;
  onSyncComplete: () => void;
}

export const NetworkStatusAlert: React.FC<NetworkStatusAlertProps> = ({
  isOnline,
  onRetryConnection,
  pendingCount,
  onSyncComplete
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const res = await api.syncOfflineChanges('Smartphone Android (Éducateur)', 'DEV-SMARTPHONE-1');
      setSyncMsg(`${res.appliedCount} modifications synchronisées avec la base centrale du PC Serveur.`);
      onSyncComplete();
      setTimeout(() => setSyncMsg(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isOnline && pendingCount === 0 && !syncMsg) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full animate-in slide-in-from-bottom duration-200">
      {!isOnline ? (
        <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-600/50 text-white shadow-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
              <WifiOff className="w-5 h-5 text-rose-400" />
              <span>Serveur inaccessible</span>
            </div>
            <button
              onClick={onRetryConnection}
              className="text-xs px-2.5 py-1 bg-rose-800 hover:bg-rose-700 rounded-lg text-white font-medium flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Réessayer</span>
            </button>
          </div>
          <p className="text-xs text-rose-200">
            Vérifiez votre connexion Wi-Fi au réseau du centre. Les modifications effectuées restent mémorisées sur cet appareil et seront envoyées dès que le PC serveur sera à portée.
          </p>
          {pendingCount > 0 && (
            <div className="text-[11px] font-semibold text-amber-300 bg-amber-950/60 p-2 rounded-lg border border-amber-500/30">
              ⚡ {pendingCount} action(s) en attente de synchronisation.
            </div>
          )}
        </div>
      ) : pendingCount > 0 ? (
        <div className="p-4 rounded-2xl bg-indigo-950/90 border border-indigo-500/50 text-white shadow-2xl backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-indigo-300 text-sm">
              <Wifi className="w-5 h-5 text-emerald-400" />
              <span>Connexion rétablie !</span>
            </div>
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-600/40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser'}</span>
            </button>
          </div>
          <p className="text-xs text-indigo-200">
            Le PC serveur local est à nouveau joignable. Cliquez pour propager vos {pendingCount} modifications en attente.
          </p>
        </div>
      ) : syncMsg ? (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{syncMsg}</span>
        </div>
      ) : null}
    </div>
  );
};
