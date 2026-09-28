import React, { useState } from 'react';
import { CalendarCheck, Save, CheckCircle2, XCircle, Clock, AlertCircle, Filter, Calendar } from 'lucide-react';
import { Formation, Beneficiaire, Presence } from '../types';

interface PresencesViewProps {
  formations: Formation[];
  beneficiaires: Beneficiaire[];
  presences: Presence[];
  onSaveBatchPresences: (list: Partial<Presence>[]) => Promise<void>;
}

export const PresencesView: React.FC<PresencesViewProps> = ({
  formations,
  beneficiaires,
  presences,
  onSaveBatchPresences
}) => {
  const [selectedFormationId, setSelectedFormationId] = useState(formations[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSeance, setSelectedSeance] = useState<'Matin' | 'Après-midi' | 'Soir'>('Matin');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedFormation = formations.find(f => f.id === selectedFormationId);

  // Bénéficiaires inscrits à cette formation
  const inscrits = beneficiaires.filter(b => selectedFormation?.inscritsIds?.includes(b.id));

  // Statuts locaux pour la grille de pointage
  const [localStatuses, setLocalStatuses] = useState<Record<string, { statut: 'Présent' | 'Absent' | 'Retard' | 'Excusé'; commentaire: string }>>({});

  // Synchroniser avec les présences existantes si disponibles
  React.useEffect(() => {
    const map: Record<string, { statut: 'Présent' | 'Absent' | 'Retard' | 'Excusé'; commentaire: string }> = {};

    inscrits.forEach(b => {
      const existing = presences.find(
        p => p.date === selectedDate && p.seance === selectedSeance && p.beneficiaireId === b.id && p.formationId === selectedFormationId
      );
      if (existing) {
        map[b.id] = { statut: existing.statut, commentaire: existing.commentaire || '' };
      } else {
        map[b.id] = { statut: 'Présent', commentaire: '' };
      }
    });

    setLocalStatuses(map);
  }, [selectedFormationId, selectedDate, selectedSeance, presences]);

  const setStatus = (beneficiaireId: string, statut: 'Présent' | 'Absent' | 'Retard' | 'Excusé') => {
    setLocalStatuses(prev => ({
      ...prev,
      [beneficiaireId]: {
        ...prev[beneficiaireId],
        statut
      }
    }));
  };

  const setComment = (beneficiaireId: string, commentaire: string) => {
    setLocalStatuses(prev => ({
      ...prev,
      [beneficiaireId]: {
        ...prev[beneficiaireId],
        commentaire
      }
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const payload: Partial<Presence>[] = inscrits.map(b => {
      const entry = localStatuses[b.id] || { statut: 'Présent', commentaire: '' };
      return {
        date: selectedDate,
        seance: selectedSeance,
        beneficiaireId: b.id,
        formationId: selectedFormationId,
        statut: entry.statut,
        commentaire: entry.commentaire,
        enregistrePar: 'Formateur'
      };
    });

    await onSaveBatchPresences(payload);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-400" />
            <span>Feuille d'Émargement & Pointage Quotidien</span>
          </h2>
          <p className="text-xs text-slate-400">
            Contrôle des présences, retards et absences justifiées en salle ou atelier
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving || inscrits.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Enregistrement...' : "Valider l'Émargement"}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Feuille d'émargement enregistrée sur la base centrale du PC Serveur avec succès !</span>
        </div>
      )}

      {/* Sélecteurs Date, Séance et Formation */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">
            Formation concernée :
          </label>
          <select
            value={selectedFormationId}
            onChange={(e) => setSelectedFormationId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
          >
            {formations.map((f) => (
              <option key={f.id} value={f.id}>
                {f.titre} ({f.inscritsIds?.length || 0} inscrits)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">
            Date de la séance :
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">
            Créneau / Séance :
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Matin', 'Après-midi', 'Soir'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSeance(s)}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  selectedSeance === s
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des bénéficiaires pour émargement */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Liste des Apprenants Inscrits ({inscrits.length})
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const updated: any = {};
                inscrits.forEach(b => {
                  updated[b.id] = { ...(localStatuses[b.id] || {}), statut: 'Présent' };
                });
                setLocalStatuses(prev => ({ ...prev, ...updated }));
              }}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              Tous Présents
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {inscrits.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Aucun bénéficiaire n'est encore inscrit à cette formation.
            </div>
          ) : (
            inscrits.map((b) => {
              const currentStatus = localStatuses[b.id]?.statut || 'Présent';
              const currentComment = localStatuses[b.id]?.commentaire || '';

              return (
                <div key={b.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white text-sm">
                      {b.prenom} {b.nom}
                    </div>
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                      <span>{b.id}</span>
                      <span>•</span>
                      <span>{b.cin || 'Sans CIN'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Boutons d'émargement */}
                    <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                      <button
                        onClick={() => setStatus(b.id, 'Présent')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          currentStatus === 'Présent'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Présent</span>
                      </button>

                      <button
                        onClick={() => setStatus(b.id, 'Absent')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          currentStatus === 'Absent'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Absent</span>
                      </button>

                      <button
                        onClick={() => setStatus(b.id, 'Retard')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          currentStatus === 'Retard'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Retard</span>
                      </button>

                      <button
                        onClick={() => setStatus(b.id, 'Excusé')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          currentStatus === 'Excusé'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Excusé</span>
                      </button>
                    </div>

                    {/* Commentaire de justification */}
                    <input
                      type="text"
                      placeholder="Commentaire ou motif..."
                      value={currentComment}
                      onChange={(e) => setComment(b.id, e.target.value)}
                      className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 w-full sm:w-56 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
