import React, { useState } from 'react';
import { Settings, Save, CheckCircle, Server, ShieldCheck, HardDrive } from 'lucide-react';

interface ParametresViewProps {
  initialData: any;
  onSave: (data: any) => Promise<void>;
}

export const ParametresView: React.FC<ParametresViewProps> = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData || {
    nomCentre: "Centre Deuxième Chance - Espoir & Avenir",
    slogan: "Insertion, Formation et Accompagnement Professionnel",
    adresse: "12 Avenue de l'Éducation et du Travail",
    ville: "Casablanca",
    telephone: "+212 5 22 00 11 22",
    email: "contact@centre-deuxieme-chance.ma",
    directeur: "M. Khalid Amrani",
    portServeur: 3000,
    sauvegardesAutomatiques: true,
    frequenceSauvegardeHeures: 2,
    modeLocalStrict: true
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <span>Paramètres Généraux du Centre & du Serveur</span>
        </h2>
        <p className="text-xs text-slate-400">
          Identité de l'établissement, port d'écoute et configuration de persistance locale
        </p>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Paramètres mis à jour avec succès sur le PC Serveur !</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
            Coordonnées du Centre
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Nom de l'Établissement</label>
              <input
                type="text"
                value={formData.nomCentre}
                onChange={(e) => setFormData({ ...formData, nomCentre: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Slogan / Sous-titre</label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Directeur du Centre</label>
              <input
                type="text"
                value={formData.directeur}
                onChange={(e) => setFormData({ ...formData, directeur: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Téléphone</label>
              <input
                type="text"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Adresse physique</label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Ville</label>
              <input
                type="text"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
            Configuration Technique Serveur Réseau Local
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Port d'écoute TCP (Défaut : 3000)</label>
              <input
                type="number"
                value={formData.portServeur}
                onChange={(e) => setFormData({ ...formData, portServeur: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Fréquence de Sauvegarde Automatique</label>
              <select
                value={formData.frequenceSauvegardeHeures}
                onChange={(e) => setFormData({ ...formData, frequenceSauvegardeHeures: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
              >
                <option value={1}>Toutes les heures</option>
                <option value={2}>Toutes les 2 heures</option>
                <option value={6}>Toutes les 6 heures</option>
                <option value={24}>Une fois par jour</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200 font-medium">
              <input
                type="checkbox"
                checked={formData.sauvegardesAutomatiques}
                onChange={(e) => setFormData({ ...formData, sauvegardesAutomatiques: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
              />
              <span>Activer les sauvegardes automatiques planifiées sur le PC Serveur</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200 font-medium">
              <input
                type="checkbox"
                checked={formData.modeLocalStrict}
                onChange={(e) => setFormData({ ...formData, modeLocalStrict: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
              />
              <span>Mode 100% Autonome (Zéro télémétrie ni dépendance cloud externe)</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les Paramètres</span>
          </button>
        </div>
      </form>
    </div>
  );
};
