import React, { useState } from 'react';
import { Activity, Plus, Calendar, User, Users, CheckCircle, X, Save } from 'lucide-react';
import { Activite, Beneficiaire } from '../types';

interface ActivitesViewProps {
  activites: Activite[];
  beneficiaires: Beneficiaire[];
  onAddActivite: (a: Partial<Activite>) => Promise<void>;
}

export const ActivitesView: React.FC<ActivitesViewProps> = ({
  activites,
  beneficiaires,
  onAddActivite
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Activite>>({
    nom: '',
    type: 'Atelier CV',
    date: new Date().toISOString().split('T')[0],
    responsable: 'Yassine El Idrissi',
    description: '',
    resultat: '',
    participantsIds: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddActivite(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Activités, Ateliers & Visites d'Entreprises</span>
          </h2>
          <p className="text-xs text-slate-400">
            Événements d'insertion, ateliers soft skills, sorties et interventions extérieures
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une Activité</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activites.map((act) => (
          <div
            key={act.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {act.type}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{act.date}</span>
              </span>
            </div>

            <h3 className="text-base font-bold text-white leading-snug">
              {act.nom}
            </h3>

            <p className="text-xs text-slate-300">
              {act.description}
            </p>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-semibold block">Résultat & Bilan :</span>
              <div className="text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{act.resultat || 'Activité planifiée.'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{act.responsable}</span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{act.participantsIds?.length || 0} participants</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Création Activité */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Ajouter une Activité</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Titre de l'activité *</label>
                <input
                  type="text"
                  required
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="Ex : Simulation d'entretien d'embauche"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  >
                    <option value="Atelier CV">Atelier CV</option>
                    <option value="Session motivation">Session motivation</option>
                    <option value="Visite entreprise">Visite entreprise</option>
                    <option value="Sport & Cohésion">Sport & Cohésion</option>
                    <option value="Conférence">Conférence</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Date</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Responsable de l'activité</label>
                <input
                  type="text"
                  value={formData.responsable || ''}
                  onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Description des objectifs</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="Déroulement, animateurs externes..."
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Résultat / Bilan</label>
                <input
                  type="text"
                  value={formData.resultat || ''}
                  onChange={(e) => setFormData({ ...formData, resultat: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="Ex : 10 jeunes ont finalisé leur CV"
                />
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-800 border-t border-slate-700 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Enregistrer</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
