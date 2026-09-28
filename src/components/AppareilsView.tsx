import React from 'react';
import { Smartphone, Laptop, Tablet, CheckCircle2, XCircle, Power, RefreshCw, Plus, QrCode } from 'lucide-react';
import { AppareilConnecte } from '../types';

interface AppareilsViewProps {
  appareils: AppareilConnecte[];
  onToggleDevice: (id: string) => Promise<void>;
  onOpenQr: () => void;
  onRefresh: () => void;
}

export const AppareilsView: React.FC<AppareilsViewProps> = ({
  appareils,
  onToggleDevice,
  onOpenQr,
  onRefresh
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <span>Appareils Connectés au Réseau Local (LAN)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Postes PC du centre et smartphones Android des éducateurs autorisés
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser</span>
          </button>
          <button
            onClick={onOpenQr}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Associer un smartphone</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Terminaux autorisés ({appareils.length})</span>
          <span>Protocole LAN Wi-Fi / Ethernet</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {appareils.map((dev) => {
            const isPc = dev.type === 'PC';
            const isSmart = dev.type === 'Smartphone';

            return (
              <div
                key={dev.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`p-3 rounded-xl ${
                    dev.statut === 'Actif'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {isPc ? <Laptop className="w-5 h-5" /> : isSmart ? <Smartphone className="w-5 h-5" /> : <Tablet className="w-5 h-5" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {dev.nomAppareil}
                      </h4>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-semibold ${
                        dev.statut === 'Actif'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {dev.statut}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 font-mono">
                      <span>Utilisateur : <strong className="text-slate-300 font-sans">{dev.utilisateur}</strong></span>
                      <span>•</span>
                      <span>IP : <span className="text-emerald-400">{dev.adresseIp}</span></span>
                      <span>•</span>
                      <span>Dernière activité : {new Date(dev.derniereConnexion).toLocaleTimeString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => onToggleDevice(dev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      dev.statut === 'Actif'
                        ? 'bg-slate-800 hover:bg-rose-950 text-rose-400 border-slate-700 hover:border-rose-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{dev.statut === 'Actif' ? 'Désactiver l\'accès' : 'Réactiver l\'appareil'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
