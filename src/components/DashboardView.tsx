import React from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  FolderOpen,
  CheckCircle,
  Activity,
  Server,
  ArrowUpRight,
  TrendingUp,
  Smartphone,
  Plus,
  QrCode
} from 'lucide-react';
import { Beneficiaire, Dossier, Formation, Presence, ServerStatusData } from '../types';

interface DashboardViewProps {
  stats: any;
  serverStatus: ServerStatusData | null;
  onNavigate: (tab: any) => void;
  onOpenQr: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  serverStatus,
  onNavigate,
  onOpenQr
}) => {
  return (
    <div className="space-y-6">
      {/* Bannière Réseau Local & Information Serveur */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Serveur Central Local Actif sur 0.0.0.0:3000
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {serverStatus?.centerName || 'Centre Deuxième Chance'}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Système autonome de réinsertion professionnelle, qualification et accompagnement des jeunes.
              Données hébergées en local sur ce PC Serveur.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenQr}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Connecter un appareil</span>
            </button>
            <button
              onClick={() => onNavigate('serveur')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
            >
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Admin Serveur</span>
            </button>
          </div>
        </div>

        {/* Détails rapides de connectivité */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-400">Adresse IP LAN</div>
            <div className="font-mono text-emerald-400 font-bold text-sm">
              {serverStatus?.serverIp || '192.168.1.100'}
            </div>
          </div>
          <div>
            <div className="text-slate-400">Port d'écoute</div>
            <div className="font-mono text-slate-200 font-bold text-sm">
              {serverStatus?.port || 3000}
            </div>
          </div>
          <div>
            <div className="text-slate-400">Appareils connectés</div>
            <div className="text-indigo-400 font-bold text-sm">
              {serverStatus?.connectedDevicesCount || 3} appareils
            </div>
          </div>
          <div>
            <div className="text-slate-400">Base locale</div>
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Opérationnelle (PC)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cartes Métriques Principales (Section 18) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bénéficiaires */}
        <div
          onClick={() => onNavigate('beneficiaires')}
          className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Bénéficiaires
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">
              {stats?.totalBeneficiaires ?? 4}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats?.beneficiairesActifs ?? 4} actifs et motivés</span>
            </div>
          </div>
        </div>

        {/* Formations en cours */}
        <div
          onClick={() => onNavigate('formations')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Formations en cours
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">
              {stats?.formationsEnCours ?? 3}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Électricité, Bureautique, Couture
            </div>
          </div>
        </div>

        {/* Présences Aujourd'hui */}
        <div
          onClick={() => onNavigate('presences')}
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Présences aujourd'hui
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">
              {stats?.tauxPresence ?? 100}%
            </div>
            <div className="mt-1 text-xs text-blue-400">
              {stats?.presentsAujourdhuiCount ?? 3} émargements validés
            </div>
          </div>
        </div>

        {/* Dossiers en cours */}
        <div
          onClick={() => onNavigate('dossiers')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Dossiers Ouverts
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <FolderOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">
              {stats?.dossiersOuverts ?? 3}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {stats?.dossiersTermines ?? 0} dossiers clôturés
            </div>
          </div>
        </div>
      </div>

      {/* Rangée Double : Derniers Bénéficiaires & Activités Récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers Bénéficiaires Inscrits */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">
                Derniers Bénéficiaires
              </h3>
            </div>
            <button
              onClick={() => onNavigate('beneficiaires')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {stats?.derniersBeneficiaires?.map((b: any) => (
              <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400">
                    {b.prenom[0]}{b.nom[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {b.prenom} {b.nom}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="font-mono">{b.cin || b.id}</span>
                      <span>•</span>
                      <span>{b.profession || 'Sans emploi'}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {b.statut}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('beneficiaires')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Inscrire un nouveau bénéficiaire</span>
          </button>
        </div>

        {/* Activités Récentes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">
                Activités & Ateliers Récents
              </h3>
            </div>
            <button
              onClick={() => onNavigate('activites')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {stats?.activitesRecentes?.map((act: any) => (
              <div key={act.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white">
                    {act.nom}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {act.date}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {act.description}
                </p>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>{act.resultat}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
            <span>Présence quotidienne du centre :</span>
            <button
              onClick={() => onNavigate('presences')}
              className="font-semibold underline hover:text-white"
            >
              Ouvrir la feuille d'émargement &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
