import React, { useState } from 'react';
import { FolderOpen, Plus, Search, Filter, FileText, CheckCircle2, Clock, X, Save } from 'lucide-react';
import { Dossier, Beneficiaire } from '../types';

interface DossiersViewProps {
  dossiers: Dossier[];
  beneficiaires: Beneficiaire[];
  onAddDossier: (d: Partial<Dossier>) => Promise<void>;
  onUpdateDossier: (id: string, d: Partial<Dossier>) => Promise<void>;
}

export const DossiersView: React.FC<DossiersViewProps> = ({
  dossiers,
  beneficiaires,
  onAddDossier,
  onUpdateDossier
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Dossier>>({
    beneficiaireId: beneficiaires[0]?.id || '',
    type: 'Formation professionnelle',
    description: '',
    responsable: 'Yassine El Idrissi',
    statut: 'Ouvert',
    notes: ''
  });

  const filtered = dossiers.filter(d => {
    const matchesSearch =
      d.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.beneficiaireNom && d.beneficiaireNom.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatut = filterStatut === 'Tous' || d.statut === filterStatut;
    return matchesSearch && matchesStatut;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddDossier(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-amber-400" />
            <span>Gestion des Dossiers Individuels</span>
          </h2>
          <p className="text-xs text-slate-400">
            Suivi des parcours, orientation, démarches administratives et stages
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold shadow-lg shadow-amber-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ouvrir un Nouveau Dossier</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par numéro de dossier, bénéficiaire, mot-clé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-hidden"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Ouvert">Ouvert</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="Clôturé">Clôturé</option>
          </select>
        </div>
      </div>

      {/* Cartes des dossiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-sm space-y-3 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {d.numero}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                d.statut === 'En cours' ? 'bg-indigo-500/20 text-indigo-300' :
                d.statut === 'Ouvert' ? 'bg-amber-500/20 text-amber-300' :
                'bg-emerald-500/20 text-emerald-300'
              }`}>
                {d.statut}
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400">Bénéficiaire</div>
              <div className="text-base font-bold text-white">
                {d.beneficiaireNom || d.beneficiaireId}
              </div>
            </div>

            <div className="text-xs text-slate-300 line-clamp-2">
              {d.description}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Resp: <strong className="text-slate-300">{d.responsable}</strong></span>
              <div className="flex items-center gap-1 text-indigo-400">
                <FileText className="w-3.5 h-3.5" />
                <span>{d.documentsCount || 1} doc(s)</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nouveau Dossier */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Ouvrir un Nouveau Dossier
              </h3>
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
                <label className="text-slate-300 font-semibold mb-1 block">Bénéficiaire *</label>
                <select
                  required
                  value={formData.beneficiaireId}
                  onChange={(e) => setFormData({ ...formData, beneficiaireId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                >
                  {beneficiaires.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.prenom} {b.nom} ({b.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Type de Dossier</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  >
                    <option value="Accompagnement social">Accompagnement social</option>
                    <option value="Formation professionnelle">Formation professionnelle</option>
                    <option value="Insertion emploi">Insertion emploi</option>
                    <option value="Orientation">Orientation</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Responsable</label>
                  <input
                    type="text"
                    value={formData.responsable || ''}
                    onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Description du projet d'accompagnement *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="Objectifs, démarches prévues..."
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
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Créer le Dossier</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
