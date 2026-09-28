import React, { useState } from 'react';
import { UserCheck, Shield, Key, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Utilisateur } from '../types';

interface UtilisateursViewProps {
  utilisateurs: Utilisateur[];
}

export const UtilisateursView: React.FC<UtilisateursViewProps> = ({ utilisateurs }) => {
  const rolesPermissions = [
    { role: 'Administrateur', desc: 'Accès total, gestion des utilisateurs, sauvegardes, configuration serveur, rapports.' },
    { role: 'Directeur', desc: 'Supervision globale, consultation des dossiers, validation des bilans et statistiques.' },
    { role: 'Gestionnaire', desc: 'Gestion administrative des bénéficiaires, dossiers et programmes de formation.' },
    { role: 'Éducateur', desc: 'Accompagnement individuel, rédaction des bilans sociaux et organisation des activités.' },
    { role: 'Formateur', desc: 'Pointage quotidien des présences (émargement), suivi pédagogique en atelier.' },
    { role: 'Agent', desc: 'Accueil, saisie initiale des dossiers et fiches bénéficiaires.' },
    { role: 'Consultation', desc: 'Accès en lecture seule sans droits de modification.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <span>Utilisateurs & Rôles d'Accès</span>
        </h2>
        <p className="text-xs text-slate-400">
          Gestion des comptes du personnel du centre et droits d'accès sur le réseau local
        </p>
      </div>

      {/* Grille des comptes existants */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Comptes Enregistrés ({utilisateurs.length})
        </div>

        <div className="divide-y divide-slate-800/80">
          {utilisateurs.map((u) => (
            <div key={u.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-sm">
                  {u.prenom[0]}{u.nom[0]}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">
                    {u.prenom} {u.nom}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {u.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {u.role}
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Actif</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tableau des Rôles & Permissions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span>Matrice des Rôles & Permissions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {rolesPermissions.map((r, i) => (
            <div key={i} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-indigo-400 block text-sm">
                {r.role}
              </span>
              <p className="text-slate-400 leading-snug">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
