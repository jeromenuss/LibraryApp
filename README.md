# Installation de l'application Library

Ce guide vous explique comment installer et configurer l'application Library, qui se compose d'une API NestJS et d'une application Angular.

## Prérequis

- Node.js et npm installés
- Un compte Firebase
- Git

## Étapes d'installation

### 1. Cloner le projet

```bash
git clone https://github.com/jeromenuss/LibraryApp.git
cd library
```

### 2. Installer les dépendances

```bash
# Dans le répertoire racine
npm install

# Dans le répertoire webapi (NestJS)
cd webapi
npm install
cd ..

# Dans le répertoire webapp (Angular)
cd webapp
npm install
cd ..
```

### 3. Configurer Firebase
1. Accédez à [la console Firebase](https://console.firebase.google.com/u/0/)
2. Créez un nouveau projet ou utilisez un projet existant
4. Configurez les services suivants :
    * Web App : Ajoutez une application web à votre projet
    * Hosting : Activez l'hébergement Firebase
    * Firestore : Créez une base de données Firestore
    * Authentication : Activez l'authentification par email/mot de passe

### 4. Configurer l'API (webapi)

Créez un fichier .env dans le répertoire webapi avec les variables suivantes :

`FIREBASE_PROJECT_ID=votre_project_id`
`FIREBASE_PRIVATE_KEY=votre_private_key`
`FIREBASE_CLIENT_EMAIL=votre_client_email`

**Comment obtenir les informations Firebase :**

1. Dans la console Firebase, accédez à Paramètres du projet > Comptes de service
2. Sélectionnez Firebase Admin SDK
3. Cliquez sur Générer une nouvelle clé privée
4. Un fichier JSON sera téléchargé, contenant les informations nécessaires :
    - `project_id` → FIREBASE_PROJECT_ID
    - `private_key` → FIREBASE_PRIVATE_KEY (incluez la clé entière avec les guillemets et les sauts de ligne)
    - `client_email` → FIREBASE_CLIENT_EMAIL

### 5. Configurer l'application Angular (webapp)

Créez un fichier `environment.development.ts` dans le répertoire `webapp/src/environments/` avec le contenu suivant :

```typescript
import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3001', // URL de votre API NestJS
  applicationName: 'Library',
  firebaseApp: {
    apiKey: 'votre_api_key',
    authDomain: 'votre_project_id.firebaseapp.com',
    projectId: 'votre_project_id',
    storageBucket: 'votre_project_id.appspot.com',
    messagingSenderId: 'votre_messaging_sender_id',
    appId: 'votre_app_id'
  }
};
```

Pour obtenir ces informations :

1. Dans [la console Firebase](https://console.firebase.google.com/u/0/), accédez à Paramètres du projet > Général
2. Faites défiler jusqu'à la section Vos applications
3. Sélectionnez votre application web
4. Les informations de configuration Firebase sont affichées sous forme d'objet JavaScript

### 6. Exécuter l'application

Pour lancer l'application en mode debug, exécutez la commande suivante depuis le répertoire racine :

```bash
npm run start:debug
```
Cette commande lancera simultanément l'API NestJS et l'application Angular.

## Accès à l'application
- **API NestJS** : http://localhost:3001
- **Application Angular** : http://localhost:4200

## Résolution des problèmes courants
- Si vous rencontrez des erreurs liées à Firebase, vérifiez que les clés d'API et les identifiants sont correctement configurés.
- Assurez-vous que les règles de sécurité Firestore sont configurées pour permettre l'accès à votre application.
- Pour les problèmes de CORS, vérifiez la configuration de votre API NestJS.
