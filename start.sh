#!/bin/bash

# Script pour démarrer le backend Kreisker Shop

echo "🚀 Démarrage du serveur Kreisker Shop..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé. Création depuis .env.example..."
    cp .env.example .env
    echo "✅ Fichier .env créé. Veuillez vérifier les variables."
fi

# Lancer le serveur
echo "✅ Lancement du serveur sur http://localhost:3000"
npm start
