import React, { useState } from 'react';
import { FileText, Plus, Upload, Download, Search, Filter, ShieldCheck, X, HardDrive } from 'lucide-react';
import { DocumentItem, Beneficiaire, Dossier } from '../types';

interface DocumentsViewProps {
  documents: DocumentItem[];
  beneficiaires: Beneficiaire[];
  dossiers: Dossier[];
  onAddDocument: (doc: Partial<DocumentItem>) => Promise<void>;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  beneficiaires,
  dossiers,
  onAddDocument
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<DocumentItem>>({
    nom: '',
    type: 'CIN',
    beneficiaireId: beneficiaires[0]?.id || '',
    dossierId: dossiers[0]?.id || '',
    tailleKo: 250
  });

  const filtered = documents.filter(doc => {
    const matchesSearch = doc.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Tous' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddDocument({
      ...formData,
      nomFichier: `${formData.nom?.replace(/\s+/g, '_')}.pdf`,
      dateUpload: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Gestion des Documents Numérisés</span>
          </h2>
          <p className="text-xs text-slate-400">
            Pièces d'identité, attestations de scolarité, certificats médicaux stockés sur le disque local du PC Serveur
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Joindre un Document</span>
        </button>
      </div>

      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3 text-xs text-slate-300">
        <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Emplacement physique de stockage sur le PC Serveur : <code className="font-mono text-emerald-400 font-semibold">C:\GestionDeuxiemeChance\Documents\</code> (Indépendant d'Internet).
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un document par nom ou référence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-hidden"
          >
            <option value="Tous">Tous les types</option>
            <option value="CIN">CIN</option>
            <option value="Certificat">Certificat</option>
            <option value="Attestation">Attestation</option>
            <option value="Photo">Photo</option>
            <option value="Document administratif">Document administratif</option>
          </select>
        </div>
      </div>

      {/* Grille des documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => {
          const benef = beneficiaires.find(b => b.id === doc.beneficiaireId);

          return (
            <div
              key={doc.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {doc.type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {doc.tailleKo} Ko
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {doc.nom}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {benef ? `${benef.prenom} ${benef.nom}` : 'Non assigné'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Ajouté le {doc.dateUpload}</span>
                <button
                  onClick={() => alert(`Document : ${doc.nom}\nStocké localement sur le PC Serveur.`)}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ouvrir</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Ajout Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Joindre un Document</h3>
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
                <label className="text-slate-300 font-semibold mb-1 block">Titre du document *</label>
                <input
                  type="text"
                  required
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="Ex : Copie CIN recto-verso"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Type de pièce</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                >
                  <option value="CIN">CIN / Identifiant</option>
                  <option value="Certificat">Certificat médical / Scolaire</option>
                  <option value="Attestation">Attestation de stage</option>
                  <option value="Photo">Photo d'identité</option>
                  <option value="Document administratif">Document administratif</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Bénéficiaire rattaché</label>
                <select
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
                <Upload className="w-3.5 h-3.5" />
                <span>Enregistrer sur le Serveur</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
