import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/api';
import { getPreferredLanIp, getLocalNetworkInterfaces } from './server/server-core';
import { localDb } from './server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = '0.0.0.0'; // Écoute sur toutes les interfaces réseau pour le LAN

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Montage de l'API locale
  app.use('/api', apiRouter);

  // Serveur de fichiers statiques ou Vite dev middleware
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    const lanIp = getPreferredLanIp();
    const interfaces = getLocalNetworkInterfaces();
    const dbData = localDb.getData();

    console.log('\n============================================================');
    console.log('   🟢 SERVEUR LOCAL : GESTION CENTRE DEUXIÈME CHANCE');
    console.log('============================================================');
    console.log(` Centre : ${dbData.parametres.nomCentre}`);
    console.log(` Port   : ${PORT}`);
    console.log(` Host   : ${HOST} (Accessible sur tout le réseau local Wi-Fi/LAN)`);
    console.log('------------------------------------------------------------');
    console.log(` 👉 ACCÈS LOCAL SUR CE PC :`);
    console.log(`    http://localhost:${PORT}`);
    console.log(`    http://127.0.0.1:${PORT}`);
    console.log('------------------------------------------------------------');
    console.log(` 📱 ACCÈS SMARTPHONES ET AUTRES PC DU CENTRE :`);
    console.log(`    http://${lanIp}:${PORT}`);
    console.log('------------------------------------------------------------');
    console.log(' Interfaces réseau détectées :');
    interfaces.forEach(i => {
      console.log(`  - [${i.type.toUpperCase()}] ${i.name}: http://${i.address}:${PORT}`);
    });
    console.log('============================================================\n');
  });
}

startServer().catch(err => {
  console.error('Erreur fatale au démarrage du serveur local:', err);
  process.exit(1);
});
