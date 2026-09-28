import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, Printer, Users, CalendarCheck, FolderOpen, GraduationCap, CheckCircle } from 'lucide-react';
import { Beneficiaire, Formation, Presence, Dossier, Activite } from '../types';

interface RapportsViewProps {
  beneficiaires: Beneficiaire[];
  formations: Formation[];
  presences: Presence[];
  dossiers: Dossier[];
  activites: Activite[];
}

export const RapportsView: React.FC<RapportsViewProps> = ({
  beneficiaires,
  formations,
  presences,
  dossiers,
  activites
}) => {
  const [rapportType, setRapportType] = useState<'beneficiaires' | 'formations' | 'presences' | 'dossiers' | 'activites'>('beneficiaires');

  const exportCsv = (type: string) => {
    let rows: string[][] = [];
    let filename = `rapport_${type}_${new Date().toISOString().split('T')[0]}.csv`;

    if (type === 'beneficiaires') {
      rows.push(['ID', 'Nom', 'Prenom', 'CIN', 'Telephone', 'Statut', 'Ville', 'Niveau Scolaire']);
      beneficiaires.forEach(b => {
        rows.push([b.id, b.nom, b.prenom, b.cin, b.telephone, b.statut, b.ville, b.niveauScolaire]);
      });
    } else if (type === 'formations') {
      rows.push(['ID', 'Titre', 'Formateur', 'Lieu', 'Capacite', 'Inscrits', 'Statut']);
      formations.forEach(f => {
        rows.push([f.id, f.titre, f.formateur, f.lieu, String(f.capacite), String(f.inscritsIds?.length || 0), f.statut]);
      });
    } else if (type === 'presences') {
      rows.push(['Date', 'Seance', 'Beneficiaire ID', 'Formation ID', 'Statut', 'Commentaire']);
      presences.forEach(p => {
        rows.push([p.date, p.seance, p.beneficiaireId, p.formationId, p.statut, p.commentaire || '']);
      });
    } else if (type === 'dossiers') {
      rows.push(['Numero', 'Beneficiaire ID', 'Type', 'Statut', 'Responsable', 'Date']);
      dossiers.forEach(d => {
        rows.push([d.numero, d.beneficiaireId, d.type, d.statut, d.responsable, d.dateCreation]);
      });
    } else if (type === 'activites') {
      rows.push(['Nom', 'Type', 'Date', 'Responsable', 'Participants Count', 'Resultat']);
      activites.forEach(a => {
        rows.push([a.nom, a.type, a.date, a.responsable, String(a.participantsIds?.length || 0), a.resultat || '']);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(';')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Rapports d'Activité & Exports</span>
          </h2>
          <p className="text-xs text-slate-400">
            Génération de bilans périodiques pour la direction et les partenaires institutionnels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCsv(rapportType)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exporter CSV / Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Onglets de types de rapports */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
        {[
          { id: 'beneficiaires', label: 'Bénéficiaires', icon: Users, count: beneficiaires.length },
          { id: 'formations', label: 'Formations', icon: GraduationCap, count: formations.length },
          { id: 'presences', label: 'Présences', icon: CalendarCheck, count: presences.length },
          { id: 'dossiers', label: 'Dossiers', icon: FolderOpen, count: dossiers.length },
          { id: 'activites', label: 'Activités', icon: CheckCircle, count: activites.length },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = rapportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setRapportType(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950/60 text-[10px] font-mono font-normal">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Aperçu du rapport sélectionné */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base capitalize">
              Rapport : {rapportType}
            </h3>
            <span className="text-xs text-slate-400">
              Généré le {new Date().toLocaleDateString('fr-FR')} • Base Locale PC Serveur
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            Données certifiées conformes
          </span>
        </div>

        {/* Tableau d'aperçu rapide */}
        <div className="overflow-x-auto text-xs">
          {rapportType === 'beneficiaires' && (
            <table className="w-full text-left">
              <thead className="text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2">ID</th>
                  <th className="py-2">Nom & Prénom</th>
                  <th className="py-2">CIN</th>
                  <th className="py-2">Téléphone</th>
                  <th className="py-2">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {beneficiaires.map(b => (
                  <tr key={b.id} className="text-slate-300">
                    <td className="py-2 font-mono text-indigo-400">{b.id}</td>
                    <td className="py-2 font-medium text-white">{b.prenom} {b.nom}</td>
                    <td className="py-2 font-mono">{b.cin}</td>
                    <td className="py-2 font-mono">{b.telephone}</td>
                    <td className="py-2">{b.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {rapportType === 'formations' && (
            <table className="w-full text-left">
              <thead className="text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2">ID</th>
                  <th className="py-2">Formation</th>
                  <th className="py-2">Formateur</th>
                  <th className="py-2">Lieu</th>
                  <th className="py-2">Inscrits / Capacité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {formations.map(f => (
                  <tr key={f.id} className="text-slate-300">
                    <td className="py-2 font-mono text-indigo-400">{f.id}</td>
                    <td className="py-2 font-medium text-white">{f.titre}</td>
                    <td className="py-2">{f.formateur}</td>
                    <td className="py-2">{f.lieu}</td>
                    <td className="py-2 font-mono">{f.inscritsIds?.length || 0} / {f.capacite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {rapportType === 'presences' && (
            <table className="w-full text-left">
              <thead className="text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2">Date</th>
                  <th className="py-2">Séance</th>
                  <th className="py-2">Bénéficiaire ID</th>
                  <th className="py-2">Formation ID</th>
                  <th className="py-2">Statut</th>
                  <th className="py-2">Observation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {presences.map(p => (
                  <tr key={p.id} className="text-slate-300">
                    <td className="py-2 font-mono">{p.date}</td>
                    <td className="py-2">{p.seance}</td>
                    <td className="py-2 font-mono text-indigo-400">{p.beneficiaireId}</td>
                    <td className="py-2 font-mono">{p.formationId}</td>
                    <td className="py-2">
                      <span className={`font-semibold ${
                        p.statut === 'Présent' ? 'text-emerald-400' :
                        p.statut === 'Absent' ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {p.statut}
                      </span>
                    </td>
                    <td className="py-2 text-slate-400">{p.commentaire || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {rapportType === 'dossiers' && (
            <table className="w-full text-left">
              <thead className="text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2">Numéro</th>
                  <th className="py-2">Bénéficiaire</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Responsable</th>
                  <th className="py-2">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {dossiers.map(d => (
                  <tr key={d.id} className="text-slate-300">
                    <td className="py-2 font-mono text-amber-400">{d.numero}</td>
                    <td className="py-2">{d.beneficiaireNom || d.beneficiaireId}</td>
                    <td className="py-2">{d.type}</td>
                    <td className="py-2">{d.responsable}</td>
                    <td className="py-2">{d.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {rapportType === 'activites' && (
            <table className="w-full text-left">
              <thead className="text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2">Activité</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Responsable</th>
                  <th className="py-2">Résultat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {activites.map(a => (
                  <tr key={a.id} className="text-slate-300">
                    <td className="py-2 font-medium text-white">{a.nom}</td>
                    <td className="py-2">{a.type}</td>
                    <td className="py-2 font-mono">{a.date}</td>
                    <td className="py-2">{a.responsable}</td>
                    <td className="py-2 text-emerald-400">{a.resultat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
