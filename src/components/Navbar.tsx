import React, { useState } from 'react';
import { Server, Wifi, WifiOff, QrCode, Laptop, Smartphone, Shield, User, Copy, Check } from 'lucide-react';
import { ServerStatusData } from '../types';

interface NavbarProps {
  serverStatus: ServerStatusData | null;
  onOpenQrCode: () => void;
  isOnline: boolean;
  deviceMode: 'serveur' | 'pc-client' | 'smartphone';
  onDeviceModeChange: (mode: 'serveur' | 'pc-client' | 'smartphone') => void;
  currentUser: { nom: string; role: string };
  offlineQueueCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  serverStatus,
  onOpenQrCode,
  isOnline,
  deviceMode,
  onDeviceModeChange,
  currentUser,
  offlineQueueCount
}) => {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    if (serverStatus?.serverUrl) {
      navigator.clipboard.writeText(serverStatus.serverUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 px-4 py-2.5">
      <div className="flex items-center justify-between gap-3">
        {/* Titre & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-bold text-lg text-white">
            2C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base md:text-lg tracking-tight text-white leading-tight">
                GESTION CENTRE DEUXIÈME CHANCE
              </h1>
              <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                LAN 0.0.0.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Réseau Local Autonome • Base Centrale sur PC Serveur
            </p>
          </div>
        </div>

        {/* Centre : Statut Serveur & Adresse IP */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="font-medium text-slate-300">
              {isOnline ? 'Serveur Local :' : 'Déconnecté du Serveur :'}
            </span>
            <span className="font-mono text-emerald-400 font-semibold">
              {serverStatus ? serverStatus.serverUrl : 'http://127.0.0.1:3000'}
            </span>
          </div>

          <button
            onClick={copyUrl}
            title="Copier l'adresse locale"
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Bouton QR Code */}
          <button
            onClick={onOpenQrCode}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium hover:underline cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Connecter un appareil</span>
          </button>
        </div>

        {/* Droite : Simulateur de mode appareil & Utilisateur */}
        <div className="flex items-center gap-2.5">
          {/* Indicateur file d'attente hors-ligne si active */}
          {offlineQueueCount > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-medium animate-pulse">
              <WifiOff className="w-3.5 h-3.5" />
              <span>{offlineQueueCount} en attente</span>
            </div>
          )}

          {/* Sélecteur de type d'appareil (Simulateur / Réel) */}
          <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => onDeviceModeChange('serveur')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                deviceMode === 'serveur'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Affichage PC Serveur Principal"
            >
              <Server className="w-3 h-3" />
              <span className="hidden xl:inline">PC Serveur</span>
            </button>
            <button
              onClick={() => onDeviceModeChange('pc-client')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                deviceMode === 'pc-client'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Affichage Poste Client (Accueil/Directeur)"
            >
              <Laptop className="w-3 h-3" />
              <span className="hidden xl:inline">Poste Client</span>
            </button>
            <button
              onClick={() => onDeviceModeChange('smartphone')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                deviceMode === 'smartphone'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Affichage Smartphone Android"
            >
              <Smartphone className="w-3 h-3" />
              <span className="hidden xl:inline">Smartphone</span>
            </button>
          </div>

          {/* Bouton mobile QR Code */}
          <button
            onClick={onOpenQrCode}
            className="md:hidden p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30"
            title="Afficher QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Profil utilisateur actuel */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">
                {currentUser.nom}
              </div>
              <div className="text-[10px] text-indigo-400 font-medium">
                {currentUser.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
