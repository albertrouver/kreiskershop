# 🛍️ Kreisker Shop - E-commerce

Site de vente en ligne de vêtements (sweats, t-shirts, casquettes) avec système d'authentification et panel admin.

## 📋 Caractéristiques

### Produits
- **3 Sweats** : Premium, Classic, Sport
- **3 T-Shirts** : Premium, Classic, Sport  
- **3 Casquettes** : Premium, Classic, Sport

### Fonctionnalités
✅ Catalogue de produits avec descriptions et prix
✅ Panier d'achat fonctionnel
✅ Système d'inscription et connexion
✅ Code secret pour accès admin : 
✅ Panel admin pour gérer les utilisateurs et commandes
✅ Historique des commandes
✅ Interface responsive (mobile-friendly)
✅ Design moderne avec gradient et animations

## 🔐 Code Secret
```

```
Ce code est requis pour :
- S'inscrire
- Se connecter
- Accéder au panel admin

## 🚀 Comment démarrer

### Méthode 1 : Serveur Python (recommandé)
```bash
cd /workspaces/kreiskershop
python3 -m http.server 8000
```
Puis ouvrir : http://localhost:8000

### Méthode 2 : Serveur Node.js
```bash
npx http-server
```

### Méthode 3 : Ouvrir directement
Ouvrir `index.html` directement dans un navigateur (fonctionnalités limitées).

## 📖 Guide d'utilisation

### Pour les clients
1. Cliquer sur "Connexion" en haut à droite
2. Choisir "Inscription"
3. Entrer email, mot de passe et code secret ()
4. Parcourir les produits
5. Ajouter les articles au panier
6. Cliquer "Commander"

### Pour l'admin
1. Se connecter avec un compte (créé avec le code secret)
2. Cliquer sur "Email (Admin)" en haut à droite
3. Accéder au panel admin
4. Voir les utilisateurs inscrits
5. Voir l'historique des commandes
6. Gérer les utilisateurs

## 📁 Structure des fichiers
```
kreiskershop/
├── index.html       # Page principale
├── styles.css       # Styles CSS
├── app.js          # Logique JavaScript
└── README.md       # Documentation
```

## 💾 Stockage des données
Les données sont sauvegardées dans **localStorage** du navigateur :
- Liste des utilisateurs
- Utilisateur actuellement connecté
- Historique des commandes
- Panier

⚠️ **Note** : Les données sont supprimées si vous videz le cache du navigateur.

## 🎨 Couleurs du design
- Primaire : `#667eea` (bleu-violet)
- Secondaire : `#764ba2` (violet)
- Accent : `#e74c3c` (rouge)
- Texte : `#333` (gris foncé)

## 🛠️ Modifications possibles

### Ajouter de nouveaux produits
Modifiez le tableau `products` dans `app.js` :
```javascript
const products = [
    {
        id: 10,
        name: "Nouveau Produit",
        category: "Catégorie",
        price: 29.99,
        description: "Description",
        emoji: "🎯"
    },
    // ...
];
```

### Changer le code secret
Modifiez dans `app.js` :
```javascript
const SECRET_CODE =
```

### Personnaliser le design
Modifiez `styles.css` pour changer :
- Couleurs
- Polices
- Spacing
- Animations

## 📱 Responsive Design
Le site s'adapte automatiquement à :
- Desktop (1200px+)
- Tablette (768px - 1199px)
- Mobile (< 768px)

## 🔒 Sécurité
⚠️ **Important** : Ce site utilise localStorage pour le stockage. Pour une application en production :
- Utiliser une base de données
- Hasher les mots de passe
- Implémenter une authentification JWT
- Utiliser HTTPS
- Valider côté serveur

## 📝 Informations de contact
Site créé pour Kreisker Shop
Design et développement : 2025

---

**Besoin d'aide ?** Consultez la documentation du code dans les fichiers source.