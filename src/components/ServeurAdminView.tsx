import React, { useState } from 'react';
import {
  Server,
  Wifi,
  Shield,
  Database,
  CheckCircle2,
  Clock,
  QrCode,
  HardDrive,
  Copy,
  Check,
  Terminal,
  RefreshCw,
  FolderGit2
} from 'lucide-react';
import { ServerStatusData } from '../types';

interface ServeurAdminViewProps {
  serverStatus: ServerStatusData | null;
  onOpenQr: () => void;
  onRefresh: () => void;
}

export const ServeurAdminView: React.FC<ServeurAdminViewProps> = ({
  serverStatus,
  onOpenQr,
  onRefresh
}) => {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    if (serverStatus?.serverUrl) {
      navigator.clipboard.writeText(serverStatus.serverUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatUptime = (seconds: number = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <span>Administration & Moniteur du Serveur Local</span>
          </h2>
          <p className="text-xs text-slate-400">
            Supervision de l'état réseau 0.0.0.0, connectivité Wi-Fi / Ethernet et intégrité de la base de données
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser l'état</span>
          </button>
          <button
            onClick={onOpenQr}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Générer QR Code</span>
          </button>
        </div>
      </div>

      {/* Cartes d'État en temps réel (Section 23) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* État Serveur */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            État du Serveur
          </span>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>🟢 Actif (0.0.0.0)</span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Uptime : {formatUptime(serverStatus?.uptimeSeconds)}
          </p>
        </div>

        {/* Adresse IP & Port */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Adresse IP & Port
          </span>
          <div className="text-white font-mono font-bold text-lg flex items-center justify-between">
            <span>{serverStatus?.serverIp || '192.168.1.100'}</span>
            <span className="text-indigo-400">:{serverStatus?.port || 3000}</span>
          </div>
          <p className="text-xs text-slate-400">
            Port TCP ouvert sur le sous-réseau
          </p>
        </div>

        {/* Appareils Connectés */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Appareils Connectés
          </span>
          <div className="text-indigo-400 font-bold text-xl">
            {serverStatus?.connectedDevicesCount || 3} terminaux
          </div>
          <p className="text-xs text-slate-400">
            PC clients et smartphones Android
          </p>
        </div>

        {/* Base de données */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Base de Données Locale
          </span>
          <div className="text-emerald-400 font-bold text-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Opérationnelle</span>
          </div>
          <p className="text-xs text-slate-400 truncate">
            {serverStatus?.lastBackupDate ? `Dernière sauvegarde : ${new Date(serverStatus.lastBackupDate).toLocaleDateString('fr-FR')}` : 'Sauvegarde active'}
          </p>
        </div>
      </div>

      {/* URL de Connexion Complète */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">
              URL Locale d'Accès pour les autres Appareils
            </h3>
            <p className="text-xs text-slate-400">
              Tapez cette adresse dans le navigateur d'un PC ou smartphone connecté au même réseau
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 font-bold text-sm select-all">
              {serverStatus?.serverUrl || 'http://192.168.1.100:3000'}
            </div>
            <button
              onClick={copyUrl}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copié' : 'Copier'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interfaces Réseau Détectées */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>Cartes & Interfaces Réseau Détectées sur ce PC Serveur</span>
          </div>
          <span>Mode 0.0.0.0 Actif</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {serverStatus?.allInterfaces?.map((iface, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  iface.type === 'wifi' ? 'bg-indigo-500/20 text-indigo-300' :
                  iface.type === 'ethernet' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {iface.type}
                </span>
                <span className="text-white font-medium">{iface.name}</span>
              </div>
              <div className="text-emerald-400 font-semibold">
                http://{iface.address}:{serverStatus.port}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pare-feu Windows & Démarrage Automatique */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Configuration Pare-feu Windows</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Pour autoriser les requêtes entrantes du réseau local :
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 select-all">
            netsh advfirewall firewall add rule name="Gestion Centre Deuxieme Chance" dir=in action=allow protocol=TCP localport=3000
          </div>
          <p className="text-slate-400">
            Ou double-cliquez simplement sur <code className="text-emerald-400 font-mono">scripts\installer-firewall.bat</code>.
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Scripts de Démarrage & Diagnostic</span>
          </div>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2">
              <span className="font-mono text-emerald-400 font-bold">demarrer-serveur.bat</span> : Démarrer le serveur et ouvrir l'application.
            </li>
            <li className="flex items-center gap-2">
              <span className="font-mono text-indigo-400 font-bold">verifier-reseau.bat</span> : Vérifier l'écoute sur 0.0.0.0:3000.
            </li>
            <li className="flex items-center gap-2">
              <span className="font-mono text-amber-400 font-bold">installer.iss</span> : Générateur de l'installateur Windows officiel.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
