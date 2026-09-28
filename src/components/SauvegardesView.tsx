import React, { useState } from 'react';
import { Database, Plus, RotateCcw, Download, CheckCircle, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Sauvegarde } from '../types';

interface SauvegardesViewProps {
  sauvegardes: Sauvegarde[];
  onCreateBackup: () => Promise<void>;
  onRestoreBackup: (backupId: string) => Promise<void>;
}

export const SauvegardesView: React.FC<SauvegardesViewProps> = ({
  sauvegardes,
  onCreateBackup,
  onRestoreBackup
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreate = async () => {
    setIsProcessing(true);
    await onCreateBackup();
    setIsProcessing(false);
    setMessage('Nouvelle sauvegarde créée avec succès sur le disque local du PC Serveur.');
    setTimeout(() => setMessage(null), 4000);
  };

  const handleRestore = async (id: string, nom: string) => {
    if (confirm(`Êtes-vous certain de vouloir restaurer la sauvegarde "${nom}" ?\nLes données actuelles seront remplacées par celles de cette sauvegarde.`)) {
      setIsProcessing(true);
      await onRestoreBackup(id);
      setIsProcessing(false);
      setMessage(`La base de données a été restaurée depuis ${nom}.`);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <span>Sauvegardes & Restauration du Serveur</span>
          </h2>
          <p className="text-xs text-slate-400">
            Gestion des instantanés locaux et historique des versions de la base de données
          </p>
        </div>

        <button
          onClick={handleCreate}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isProcessing ? 'Création en cours...' : 'Créer une Sauvegarde Maintenant'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Bannière Règles de Sauvegarde Locale */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Politique de conservation locale</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Toutes les sauvegardes sont archivées dans le dossier dédié du PC Serveur :
          <code className="mx-1 px-2 py-0.5 rounded bg-slate-950 text-emerald-400 font-mono font-bold">
            C:\GestionDeuxiemeChance\Backups\
          </code>.
          Les anciennes versions ne sont jamais effacées automatiquement afin de garantir un historique intègre en cas de panne matérielle ou coupure électrique.
        </p>
      </div>

      {/* Liste des Sauvegardes Disponibles */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <span>Historique des Sauvegardes ({sauvegardes.length})</span>
          <span>Emplacement : Disque Local PC Serveur</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {sauvegardes.map((s) => (
            <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">
                    {s.nomFichier}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    s.type === 'Automatique'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {s.type}
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-3 font-mono">
                  <span>Date : {new Date(s.date).toLocaleString('fr-FR')}</span>
                  <span>•</span>
                  <span>Taille : {s.tailleKo} Ko</span>
                  <span>•</span>
                  <span>{s.totalRecords} enregistrements</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestore(s.id, s.nomFichier)}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-white text-amber-400 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Restaurer cette sauvegarde"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
