# 🛍️ Kreisker Shop - Backend Setup

## 📋 Fichiers Backend créés

- **server.js** : Serveur Express principal avec toutes les routes API
- **package.json** : Dépendances Node.js
- **.env** : Variables d'environnement (code secret, port)
- **.env.example** : Modèle pour les variables d'environnement
- **api.js** : Client API pour le frontend (importer et utiliser les services)

## 🚀 Lancer le Backend

### En développement avec rechargement automatique
```bash
npm run dev
```

### En production
```bash
npm start
```

Le serveur démarre sur : **http://localhost:3000**

## 📡 Routes API disponibles

### Publiques
- `GET /api/products` - Lister tous les produits

### Authentification
- `POST /api/auth/register` - Inscription (avec code secret)
- `POST /api/auth/login` - Connexion

### Utilisateurs
- `GET /api/users/:userId` - Récupérer le profil
- `DELETE /api/users/:userId` - Supprimer un compte

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/users/:userId/orders` - Récupérer les commandes d'un utilisateur

### Admin (authentification requise)
- `GET /api/admin/users` - Lister tous les utilisateurs
- `GET /api/admin/orders` - Récupérer toutes les commandes
- `PATCH /api/admin/orders/:orderId` - Mettre à jour le statut d'une commande

## 🔒 Sécurité

⚠️ **Important pour la production :**

1. **Hash des mots de passe** : Installer `bcrypt`
   ```bash
   npm install bcrypt
   ```
   Et modifier `server.js` pour hasher les passwords

2. **Sessions/JWT** : Ajouter JWT pour les tokens authentifiés
   ```bash
   npm install jsonwebtoken
   ```

3. **Base de données** : Remplacer les arrays par MongoDB ou PostgreSQL
   ```bash
   npm install mongoose
   # ou
   npm install pg
   ```

4. **CORS** : Restreindre les domaines autorisés

## 🎯 Utiliser l'API dans le frontend

Importer `api.js` dans `index.html` :
```html
<script src="api.js"></script>
```

Puis utiliser les services :
```javascript
// Inscription
const user = await AuthService.register('user@example.com', 'password123', '091220101551');

// Connexion
const user = await AuthService.login('user@example.com', 'password123');

// Créer une commande
const order = await OrderService.create(userId, cartItems, totalPrice);

// Récupérer les produits
const products = await ProductService.getAll();
```

## 📦 Déployer le backend

### Heroku
```bash
npm install -g heroku
heroku login
heroku create kreiskershop-backend
git push heroku main
```

### Vercel
```bash
npm i -g vercel
vercel
```

### Railway
Connecter votre repo GitHub sur [railway.app](https://railway.app)

### Fly.io
```bash
npm install -g @flydotio/flyctl
flyctl launch
flyctl deploy
```

## 🔑 Code secret

Le code secret est dans `.env` :
```
SECRET_CODE=091220101551
```

**Ne jamais commiter le fichier `.env` en production !**
