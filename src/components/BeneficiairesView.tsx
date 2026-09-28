import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Archive,
  Phone,
  Calendar,
  FileText,
  MapPin,
  CheckCircle,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import { Beneficiaire } from '../types';

interface BeneficiairesViewProps {
  beneficiaires: Beneficiaire[];
  onAddBeneficiaire: (b: Partial<Beneficiaire>) => Promise<void>;
  onUpdateBeneficiaire: (id: string, b: Partial<Beneficiaire>) => Promise<void>;
  onDeleteBeneficiaire: (id: string, permanent?: boolean) => Promise<void>;
  onSelectBeneficiaireDossiers: (beneficiaireId: string) => void;
}

export const BeneficiairesView: React.FC<BeneficiairesViewProps> = ({
  beneficiaires,
  onAddBeneficiaire,
  onUpdateBeneficiaire,
  onDeleteBeneficiaire,
  onSelectBeneficiaireDossiers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('Tous');
  const [selectedBeneficiaire, setSelectedBeneficiaire] = useState<Beneficiaire | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulaire d'édition / création
  const [formData, setFormData] = useState<Partial<Beneficiaire>>({
    nom: '',
    prenom: '',
    dateNaissance: '2006-01-01',
    cin: '',
    telephone: '',
    adresse: '',
    ville: 'Casablanca',
    situationFamiliale: 'Célibataire',
    niveauScolaire: 'Collège',
    profession: 'Sans emploi',
    statut: 'Actif',
    notes: ''
  });

  const filtered = beneficiaires.filter(b => {
    const matchesSearch =
      b.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.cin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.telephone.includes(searchTerm);

    const matchesStatut = filterStatut === 'Tous' || b.statut === filterStatut;
    return matchesSearch && matchesStatut;
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      nom: '',
      prenom: '',
      dateNaissance: '2006-01-01',
      cin: '',
      telephone: '',
      adresse: '',
      ville: 'Casablanca',
      situationFamiliale: 'Célibataire',
      niveauScolaire: 'Collège',
      profession: 'Sans emploi',
      statut: 'Actif',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: Beneficiaire) => {
    setEditingId(b.id);
    setFormData({ ...b });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await onUpdateBeneficiaire(editingId, formData);
    } else {
      await onAddBeneficiaire(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête du module */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Gestion des Bénéficiaires</span>
          </h2>
          <p className="text-xs text-slate-400">
            Enregistrement, suivi individuel et qualification des jeunes du centre
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Bénéficiaire</span>
        </button>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, CIN, ID ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-hidden focus:border-indigo-500"
          >
            <option value="Tous">Tous les statuts ({beneficiaires.length})</option>
            <option value="Actif">Actif</option>
            <option value="En formation">En formation</option>
            <option value="En attente">En attente</option>
            <option value="Diplômé">Diplômé</option>
            <option value="Archivé">Archivé</option>
          </select>
        </div>
      </div>

      {/* Tableau des bénéficiaires */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3.5">ID / CIN</th>
                <th className="px-4 py-3.5">Nom & Prénom</th>
                <th className="px-4 py-3.5">Téléphone / Ville</th>
                <th className="px-4 py-3.5">Niveau Scolaire</th>
                <th className="px-4 py-3.5">Statut</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Aucun bénéficiaire ne correspond aux critères.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs">
                      <div className="text-white font-semibold">{b.id}</div>
                      <div className="text-indigo-400">{b.cin || 'Non renseigné'}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">
                        {b.prenom} {b.nom}
                      </div>
                      <div className="text-xs text-slate-400">
                        Né(e) le {b.dateNaissance}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-300">
                      <div className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{b.telephone || '—'}</span>
                      </div>
                      <div className="text-slate-400 mt-0.5">{b.ville}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-300">
                      <div>{b.niveauScolaire}</div>
                      <div className="text-slate-400">{b.profession}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        b.statut === 'En formation' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        b.statut === 'Actif' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        b.statut === 'Diplômé' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        b.statut === 'Archivé' ? 'bg-slate-700/50 text-slate-400' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {b.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBeneficiaire(b)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                          title="Fiche détaillée"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 rounded-lg bg-slate-800 text-indigo-400 hover:text-indigo-300 hover:bg-slate-700 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectBeneficiaireDossiers(b.id)}
                          className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-700 transition-colors"
                          title="Voir les dossiers"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Voulez-vous archiver le bénéficiaire ${b.prenom} ${b.nom} ?`)) {
                              onDeleteBeneficiaire(b.id, false);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-rose-300 hover:bg-slate-700 transition-colors"
                          title="Archiver"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Fiche Détaillée */}
      {selectedBeneficiaire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Fiche Bénéficiaire : {selectedBeneficiaire.prenom} {selectedBeneficiaire.nom}
                </h3>
                <span className="text-xs font-mono text-indigo-400">
                  {selectedBeneficiaire.id} • CIN: {selectedBeneficiaire.cin}
                </span>
              </div>
              <button
                onClick={() => setSelectedBeneficiaire(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block">Date de naissance :</span>
                  <span className="text-white font-medium">{selectedBeneficiaire.dateNaissance}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Téléphone :</span>
                  <span className="text-white font-mono">{selectedBeneficiaire.telephone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Adresse & Ville :</span>
                  <span className="text-white font-medium">{selectedBeneficiaire.adresse}, {selectedBeneficiaire.ville}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Situation familiale :</span>
                  <span className="text-white font-medium">{selectedBeneficiaire.situationFamiliale}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Niveau scolaire :</span>
                  <span className="text-white font-medium">{selectedBeneficiaire.niveauScolaire}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Date d'inscription :</span>
                  <span className="text-white font-medium">{selectedBeneficiaire.dateInscription}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Notes & Observations pédagogiques :</span>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                  {selectedBeneficiaire.notes || 'Aucune note enregistrée.'}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-800 border-t border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => {
                  const b = selectedBeneficiaire;
                  setSelectedBeneficiaire(null);
                  openEditModal(b);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Modifier cette fiche
              </button>
              <button
                onClick={() => setSelectedBeneficiaire(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajout / Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Modifier le Bénéficiaire' : 'Ajouter un Nouveau Bénéficiaire'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.nom || ''}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom || ''}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">CIN / Identifiant</label>
                  <input
                    type="text"
                    value={formData.cin || ''}
                    onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Téléphone *</label>
                  <input
                    type="text"
                    required
                    value={formData.telephone || ''}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Date de Naissance</label>
                  <input
                    type="date"
                    value={formData.dateNaissance || ''}
                    onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Statut</label>
                  <select
                    value={formData.statut || 'Actif'}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En formation">En formation</option>
                    <option value="En attente">En attente</option>
                    <option value="Diplômé">Diplômé</option>
                    <option value="Archivé">Archivé</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Ville</label>
                  <input
                    type="text"
                    value={formData.ville || ''}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Niveau Scolaire</label>
                  <input
                    type="text"
                    value={formData.niveauScolaire || ''}
                    onChange={(e) => setFormData({ ...formData, niveauScolaire: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Adresse complète</label>
                <input
                  type="text"
                  value={formData.adresse || ''}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Notes & Objectifs d'insertion</label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="Compétences, motivation, parcours antérieur..."
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
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
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
