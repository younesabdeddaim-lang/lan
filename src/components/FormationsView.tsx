import React, { useState } from 'react';
import { GraduationCap, Plus, Users, Calendar, MapPin, UserPlus, Check, X, Save } from 'lucide-react';
import { Formation, Beneficiaire } from '../types';

interface FormationsViewProps {
  formations: Formation[];
  beneficiaires: Beneficiaire[];
  onAddFormation: (f: Partial<Formation>) => Promise<void>;
  onInscrire: (formationId: string, beneficiaireId: string) => Promise<void>;
}

export const FormationsView: React.FC<FormationsViewProps> = ({
  formations,
  beneficiaires,
  onAddFormation,
  onInscrire
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inscrireModalFormation, setInscrireModalFormation] = useState<Formation | null>(null);
  const [selectedBeneficiaireId, setSelectedBeneficiaireId] = useState('');

  const [formData, setFormData] = useState<Partial<Formation>>({
    titre: '',
    formateur: '',
    dateDebut: '2026-04-01',
    dateFin: '2026-09-30',
    lieu: 'Atelier Technique',
    capacite: 15,
    statut: 'En cours',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddFormation(formData);
    setIsModalOpen(false);
  };

  const handleInscrire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inscrireModalFormation && selectedBeneficiaireId) {
      await onInscrire(inscrireModalFormation.id, selectedBeneficiaireId);
      setInscrireModalFormation(null);
      setSelectedBeneficiaireId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Formations & Qualifications Métiers</span>
          </h2>
          <p className="text-xs text-slate-400">
            Filières d'apprentissage, gestion des cohortes et inscriptions des bénéficiaires
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Formation</span>
        </button>
      </div>

      {/* Cartes des Formations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {formations.map((f) => {
          const inscritsCount = f.inscritsIds?.length || 0;
          const tauxRemplissage = Math.round((inscritsCount / f.capacite) * 100);

          return (
            <div
              key={f.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {f.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {f.statut}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {f.titre}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {f.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Formateur :</span>
                  <span className="font-semibold text-white">{f.formateur}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{f.lieu}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Du {f.dateDebut} au {f.dateFin}</span>
                </div>

                {/* Barre de capacité */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Inscrits : {inscritsCount} / {f.capacite}</span>
                    <span className="text-indigo-400 font-semibold">{tauxRemplissage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(tauxRemplissage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setInscrireModalFormation(f);
                    setSelectedBeneficiaireId(beneficiaires[0]?.id || '');
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-400 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Inscrire un bénéficiaire</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Inscription */}
      {inscrireModalFormation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleInscrire}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Inscrire un Bénéficiaire</h3>
                <p className="text-xs text-indigo-400">{inscrireModalFormation.titre}</p>
              </div>
              <button
                type="button"
                onClick={() => setInscrireModalFormation(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">
                  Sélectionner le bénéficiaire à inscrire :
                </label>
                <select
                  required
                  value={selectedBeneficiaireId}
                  onChange={(e) => setSelectedBeneficiaireId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                >
                  {beneficiaires.map((b) => {
                    const dejaInscrit = inscrireModalFormation.inscritsIds?.includes(b.id);
                    return (
                      <option key={b.id} value={b.id} disabled={dejaInscrit}>
                        {b.prenom} {b.nom} {dejaInscrit ? '(Déjà inscrit)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-800 border-t border-slate-700 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInscrireModalFormation(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirmer l'inscription</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Création Formation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Créer une Nouvelle Formation</h3>
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
                <label className="text-slate-300 font-semibold mb-1 block">Titre de la Formation *</label>
                <input
                  type="text"
                  required
                  value={formData.titre || ''}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="Ex : Réparation Appareils Électroménagers"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Formateur référent *</label>
                  <input
                    type="text"
                    required
                    value={formData.formateur || ''}
                    onChange={(e) => setFormData({ ...formData, formateur: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Lieu / Atelier</label>
                  <input
                    type="text"
                    value={formData.lieu || ''}
                    onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Date début</label>
                  <input
                    type="date"
                    value={formData.dateDebut || ''}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Capacité maximale</label>
                  <input
                    type="number"
                    value={formData.capacite || 15}
                    onChange={(e) => setFormData({ ...formData, capacite: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Programme & Objectifs</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="Compétences visées..."
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
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Enregistrer la Formation</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
