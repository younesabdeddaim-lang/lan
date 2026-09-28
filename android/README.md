# Application Mobile Android : Gestion_Centre_Deuxieme_Chance.apk

Cette application est conçue pour fonctionner avec le serveur local du centre via le réseau Wi-Fi local.

## 📱 Fonctionnalités mobiles
- **Détection automatique ou scan QR Code** de l'adresse du serveur local (`http://192.168.x.x:3000`).
- **Mémorisation de l'adresse du serveur** pour reconnexion instantanée au Wi-Fi du centre.
- **Mode hors-ligne temporaire** : Si le Wi-Fi est coupé temporairement, les saisies de présences et notes sont stockées dans la file d'attente locale du smartphone.
- **Synchronisation automatique** dès que la connexion au PC serveur est rétablie.

## 🛠️ Instructions de compilation de l'APK

1. Compiler le frontend web :
   ```bash
   npm run build
   ```

2. Ajouter la plateforme Android (si premier démarrage) :
   ```bash
   npx cap add android
   ```

3. Synchroniser les assets :
   ```bash
   npx cap copy android
   ```

4. Générer l'APK avec Gradle ou Android Studio :
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   L'APK produit se trouvera dans :
   `android/app/build/outputs/apk/release/Gestion_Centre_Deuxieme_Chance.apk`
