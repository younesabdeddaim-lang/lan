import os from 'os';
import qrcode from 'qrcode';

export interface NetworkInterfaceInfo {
  name: string;
  address: string;
  family: string;
  internal: boolean;
  type: 'wifi' | 'ethernet' | 'loopback' | 'autre';
}

export interface ServerStatus {
  status: 'actif' | 'maintenance' | 'arret';
  port: number;
  host: string;
  serverIp: string;
  serverUrl: string;
  allIps: NetworkInterfaceInfo[];
  uptimeSeconds: number;
  startTime: string;
  connectedDevicesCount: number;
  databaseStatus: 'operationnelle' | 'synchronisation' | 'erreur';
  lastBackupDate: string | null;
  centerName: string;
  localMode: boolean;
  internetAvailable: boolean;
}

const startTime = new Date().toISOString();

/**
 * Détecte les adresses IPv4 locales du PC serveur (Wi-Fi, Ethernet)
 */
export function getLocalNetworkInterfaces(): NetworkInterfaceInfo[] {
  const interfaces = os.networkInterfaces();
  const results: NetworkInterfaceInfo[] = [];

  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;

    for (const iface of ifaceList) {
      // Ignorer IPv6 et les adresses internes non utilisables
      if (iface.family === 'IPv4') {
        const lowerName = name.toLowerCase();
        let type: 'wifi' | 'ethernet' | 'loopback' | 'autre' = 'autre';
        if (iface.internal) {
          type = 'loopback';
        } else if (lowerName.includes('wi-fi') || lowerName.includes('wlan') || lowerName.includes('wireless')) {
          type = 'wifi';
        } else if (lowerName.includes('eth') || lowerName.includes('ethernet') || lowerName.includes('lan') || lowerName.includes('en')) {
          type = 'ethernet';
        }

        results.push({
          name,
          address: iface.address,
          family: iface.family,
          internal: iface.internal,
          type,
        });
      }
    }
  }

  return results;
}

/**
 * Sélectionne la meilleure adresse IP LAN pour que les smartphones et autres PC puissent joindre le serveur
 */
export function getPreferredLanIp(): string {
  const all = getLocalNetworkInterfaces();
  // Priorité 1: Wi-Fi non-interne
  const wifi = all.find(i => !i.internal && i.type === 'wifi' && !i.address.startsWith('127.'));
  if (wifi) return wifi.address;

  // Priorité 2: Ethernet non-interne
  const eth = all.find(i => !i.internal && i.type === 'ethernet' && !i.address.startsWith('127.'));
  if (eth) return eth.address;

  // Priorité 3: Tout IPv4 privé (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  const privateIp = all.find(i => !i.internal && (
    i.address.startsWith('192.168.') ||
    i.address.startsWith('10.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(i.address)
  ));
  if (privateIp) return privateIp.address;

  // Fallback si pas de carte réseau externe détectée
  const anyNonInternal = all.find(i => !i.internal);
  if (anyNonInternal) return anyNonInternal.address;

  return '127.0.0.1';
}

/**
 * Génère le QR Code en Base64 Data URL pour la connexion des smartphones
 */
export async function generateServerQrCode(url: string): Promise<string> {
  try {
    return await qrcode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Erreur génération QR Code:', err);
    return '';
  }
}
