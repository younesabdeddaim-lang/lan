import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  GraduationCap,
  CalendarCheck,
  Activity,
  FileText,
  BarChart3,
  Database,
  Smartphone,
  Server,
  UserCheck,
  Settings,
  Wifi,
  ChevronRight
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'beneficiaires'
  | 'dossiers'
  | 'formations'
  | 'presences'
  | 'activites'
  | 'documents'
  | 'rapports'
  | 'sauvegardes'
  | 'appareils'
  | 'serveur'
  | 'utilisateurs'
  | 'parametres'
  | 'connecter';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isServerMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  isServerMode
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'beneficiaires', label: 'Bénéficiaires', icon: Users },
    { id: 'dossiers', label: 'Dossiers', icon: FolderOpen },
    { id: 'formations', label: 'Formations', icon: GraduationCap },
    { id: 'presences', label: 'Présences', icon: CalendarCheck },
    { id: 'activites', label: 'Activités', icon: Activity },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'rapports', label: 'Rapports & Stats', icon: BarChart3 },
    { id: 'sauvegardes', label: 'Sauvegardes', icon: Database, badge: 'PC' },
    { id: 'appareils', label: 'Appareils connectés', icon: Smartphone },
    { id: 'serveur', label: 'Administration Serveur', icon: Server, highlight: true },
    { id: 'utilisateurs', label: 'Utilisateurs & Rôles', icon: UserCheck },
    { id: 'parametres', label: 'Paramètres', icon: Settings },
  ];

  const handleSelect = (tab: any) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Overlay Mobile */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Gestion du Centre
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : item.highlight
                    ? 'text-indigo-400 hover:bg-slate-800/80 hover:text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pied de Sidebar : Carte Réseau Local */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50">
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Réseau LAN / Wi-Fi</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-medium">
                0.0.0.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Ce PC agit en tant que serveur central. Données locales sécurisées.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
