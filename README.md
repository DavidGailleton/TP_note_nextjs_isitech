## 📋 Fonctionnalités

### Gestion des utilisateurs
- Système d'authentification complet avec rôles distincts (Admin, Professeur, Élève)
- Redirection intelligente selon le rôle de l'utilisateur

### Interface Professeur
- Dashboard avec vue d'ensemble des cours
- Gestion complète des cours (création, modification, suppression)
- Évaluation des progrès des élèves

### Interface Élève
- Inscription aux cours disponibles
- Consultation des évaluations et suivi de progression
- Historique des cours suivis

### Administration
- Gestion complète des utilisateurs
- Attribution des rôles

## 🚀 Installation

### Prérequis
- Node.js 18 ou plus récent
- npm, yarn ou pnpm
- Une base de données PostgreSQL

### Étapes d'installation

1. **Cloner le dépôt**
   ```bash
   git clone <url-du-repo>
   cd musilearn
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Configuration des variables d'environnement**

   Créez un fichier `.env.local` à la racine du projet avec les informations suivantes:
   ```
   # Base de données
   POSTGRES_URL="postgres://<user>:<password>@<host>:<port>/<database>?sslmode=require"
   
   # NextAuth
   AUTH_SECRET="votre-clé-secrète-très-sécurisée"
   AUTH_URL=http://localhost:3000
   ```

4. **Initialiser la base de données**

   L'application dispose d'une route API pour initialiser automatiquement la structure de la base de données. Après avoir démarré l'application, visitez:
   ```
   http://localhost:3000/api/seed
   ```
   Cette route créera les tables nécessaires et ajoutera des utilisateurs de test.

5. **Lancer l'application en mode développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

   L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔑 Utilisateurs par défaut

Après avoir initialisé la base de données, vous pouvez vous connecter avec les utilisateurs suivants:

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| jean.dupont@test.com | Test@1234! | Admin |
| amy.burns@test.com | Test@1234! | Professeur |
| balazs.orban@test.com | Test@1234! | Professeur |
| jhon.doh@test.com | Test@1234! | Élève |
| lee.robinson@test.com | Test@1234! | Élève |
| evil.rabbit@test.com | Test@1234! | Élève |

## 🏗️ Structure du projet

```
/app
  /(auth)             # Pages d'authentification
    /login
    /register
  /(dashboard)        # Pages du tableau de bord
    /teacher          # Interface professeur
      /courses
      /evaluations
    /student          # Interface élève
      /courses
      /progress
    /admin            # Interface administrateur
      /users
  /api                # Routes API
  /lib                # Logique métier
    /actions.ts       # Server Actions
    /data.ts          # Requêtes à la base de données
    /definitions.ts   # Types TypeScript
  /ui                 # Composants UI
    /components       # Composants partagés
    /courses          # Composants spécifiques aux cours
    /auth             # Composants d'authentification
    /dashboard        # Composants du tableau de bord
    /evalutations     # Composants d'évaluation
    /student          # Composants spécifiques aux élèves
```

## 🧭 Guide d'utilisation

### Connexion et navigation

1. Accédez à l'application et connectez-vous via la page de connexion
2. Vous serez automatiquement redirigé vers le tableau de bord correspondant à votre rôle
3. Utilisez la barre de navigation latérale pour accéder aux différentes fonctionnalités

### Fonctionnalités Administrateur

- **Gestion des utilisateurs**: Consultez, modifiez, supprimez ou créez des utilisateurs
- **Attribution des rôles**: Modifiez les rôles des utilisateurs existants

### Fonctionnalités Professeur

- **Gestion des cours**: Créez, modifiez ou supprimez des cours
- **Évaluations**: Évaluez la progression des élèves inscrits à vos cours

### Fonctionnalités Élève

- **Inscription aux cours**: Consultez et inscrivez-vous aux cours disponibles
- **Suivi de progression**: Visualisez vos évaluations et votre progression

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte aux écrans de toutes tailles, des smartphones aux grands écrans d'ordinateur.

## 🔧 Technologies utilisées

- **Next.js 15**: Framework React avec server-side rendering
- **TypeScript**: Typage statique pour un code plus robuste
- **Tailwind CSS**: Framework CSS utility-first
- **NextAuth.js**: Solution d'authentification complète
- **PostgreSQL**: Base de données relationnelle
- **Zod**: Validation de schémas
- **Turbopack**: Bundler pour un développement rapide
et est sous licence MIT. Voir le fichier LICENSE pour plus de détails.