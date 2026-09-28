import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, Smartphone, Laptop, ShieldCheck, X, RefreshCw } from 'lucide-react';
import { ServerStatusData } from '../types';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverStatus: ServerStatusData | null;
  onRefreshQr?: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  serverStatus,
  onRefreshQr
}) => {
  const [copied, setCopied] = useState(false);
  const [manualIp, setManualIp] = useState('');
  const [manualPort, setManualPort] = useState('3000');

  if (!isOpen) return null;

  const currentUrl = serverStatus?.serverUrl || 'http://192.168.1.100:3000';
  const qrImage = serverStatus?.qrCodeDataUrl || '';

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* En-tête */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Connecter un Appareil au Serveur Local
              </h2>
              <p className="text-xs text-slate-400">
                {serverStatus?.centerName || 'Gestion Centre Deuxième Chance'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Bloc QR Code Central */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
            <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-200">
              {qrImage ? (
                <img
                  src={qrImage}
                  alt="QR Code Connexion Réseau Local"
                  className="w-52 h-52 object-contain"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center bg-slate-100 text-slate-500 font-mono text-xs">
                  Génération du QR Code...
                </div>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-400 max-w-xs">
              Scannez ce QR Code avec l'appareil photo d'un smartphone connecté au même Wi-Fi.
            </p>
          </div>

          {/* Adresse URL directe */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Adresse HTTP du Serveur sur le Réseau Local :
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-emerald-400 select-all font-semibold">
                {currentUrl}
              </div>
              <button
                onClick={copyUrl}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guide de connexion étape par étape */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Guide Smartphone */}
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>Pour les Smartphones Android</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400">
                <li>Connectez-vous au <strong className="text-slate-300">Wi-Fi du centre</strong>.</li>
                <li>Scannez le QR Code ci-dessus.</li>
                <li>L'application s'ouvre et s'associe au serveur local.</li>
              </ol>
            </div>

            {/* Guide PC Client */}
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Laptop className="w-4 h-4 text-emerald-400" />
                <span>Pour les autres PC du Centre</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400">
                <li>Connectez le PC au réseau local (Câble ou Wi-Fi).</li>
                <li>Ouvrez Edge ou Chrome.</li>
                <li>Entrez l'adresse : <strong className="text-emerald-400 font-mono">{currentUrl}</strong></li>
              </ol>
            </div>
          </div>

          {/* Information Pare-feu */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              Le serveur écoute sur <span className="font-mono font-semibold">0.0.0.0:3000</span>.
              Si les smartphones ne parviennent pas à se connecter, lancez <span className="font-mono text-slate-200">scripts\installer-firewall.bat</span> sur ce PC serveur pour autoriser le port dans le pare-feu Windows.
            </p>
          </div>
        </div>

        {/* Pied de page */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            État : <span className="text-emerald-400 font-medium">Prêt pour les connexions LAN</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
