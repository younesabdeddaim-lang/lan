const { app, BrowserWindow, Tray, Menu, nativeImage, shell, dialog } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow = null;
let tray = null;
let serverProcess = null;
const PORT = process.env.PORT || 3000;

function startEmbeddedServer() {
  const serverScript = path.join(__dirname, '../server.ts');
  console.log('Démarrage du processus serveur local:', serverScript);

  try {
    // Dans l'environnement packagé, exécuter avec tsx ou node
    serverProcess = fork(serverScript, [], {
      env: { ...process.env, PORT, NODE_ENV: 'production' }
    });

    serverProcess.on('error', (err) => {
      console.error('Erreur du serveur local:', err);
    });
  } catch (err) {
    console.error('Impossible de lancer le serveur local:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: 'Gestion Centre Deuxième Chance - Serveur Local',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      if (tray) {
        tray.displayBalloon?.({
          title: 'Serveur Actif',
          content: 'Le serveur continue de tourner en arrière-plan pour les smartphones et PC connectés.'
        });
      }
    }
    return false;
  });
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'icon.png'));
  tray = new Tray(icon);
  tray.setToolTip('🟢 Serveur Gestion Deuxième Chance (Port 3000)');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🟢 Serveur Actif (Port 3000)',
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Afficher l\'application',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Ouvrir dans le navigateur par défaut',
      click: () => {
        shell.openExternal(`http://localhost:${PORT}`);
      }
    },
    {
      label: 'Page de Connexion Smartphone (QR Code)',
      click: () => {
        shell.openExternal(`http://localhost:${PORT}/#connecter-appareil`);
      }
    },
    { type: 'separator' },
    {
      label: 'Quitter complètement le serveur',
      click: () => {
        app.isQuitting = true;
        if (serverProcess) serverProcess.kill();
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  startEmbeddedServer();
  // Laisser 1.5s au serveur pour démarrer
  setTimeout(() => {
    createWindow();
    createTray();
  }, 1500);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (serverProcess) {
    serverProcess.kill();
  }
});
