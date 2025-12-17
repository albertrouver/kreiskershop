const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_CODE = process.env.SECRET_CODE || '091220101551';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Données en mémoire (en production, utiliser une vraie base de données)
let users = [];
let orders = [];

// ========== PRODUITS ==========
const products = [
    { id: 1, name: "Sweat Blanc", category: "Sweats", color: "Blanc", price: 49.99, description: "Sweat confortable blanc", image: "images/sweat-blanc.png" },
    { id: 2, name: "Sweat Gris", category: "Sweats", color: "Gris", price: 49.99, description: "Sweat confortable gris", image: "images/sweat-gris.png" },
    { id: 3, name: "Sweat Rose", category: "Sweats", color: "Rose", price: 49.99, description: "Sweat confortable rose", image: "images/sweat-rose.png" },
    { id: 4, name: "T-Shirt Blanc", category: "T-Shirts", color: "Blanc", price: 24.99, description: "T-Shirt 100% coton blanc", image: "images/tee-shirt-blanc.png" },
    { id: 5, name: "T-Shirt Vert Foncé", category: "T-Shirts", color: "Vert Foncé", price: 24.99, description: "T-Shirt 100% coton vert foncé", image: "images/tee-shirt-vert-fonce.png" },
    { id: 6, name: "T-Shirt Noir", category: "T-Shirts", color: "Noir", price: 24.99, description: "T-Shirt 100% coton noir", image: "images/tee-shirt-noir.png" },
    { id: 7, name: "Casquette Marron", category: "Casquettes", color: "Marron", price: 29.99, description: "Casquette marron", image: "images/casquette-marron.png" },
    { id: 8, name: "Casquette Noir", category: "Casquettes", color: "Noir", price: 29.99, description: "Casquette noire", image: "images/casquette-noir.png" },
    { id: 9, name: "Casquette Gris", category: "Casquettes", color: "Gris", price: 29.99, description: "Casquette grise", image: "images/casquette-gris.png" }
];

// ========== ROUTES PUBLIQUES ==========

// Récupérer tous les produits
app.get('/api/products', (req, res) => {
    res.json(products);
});

// ========== AUTHENTIFICATION ==========

// Inscription
app.post('/api/auth/register', (req, res) => {
    const { email, password, secretCode, isAdmin } = req.body;

    // Vérifier le code secret
    if (secretCode !== SECRET_CODE) {
        return res.status(403).json({ error: 'Code secret invalide' });
    }

    // Vérifier si l'utilisateur existe déjà
    if (users.find(u => u.email === email)) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    // Créer un nouvel utilisateur
    const newUser = {
        id: uuidv4(),
        email,
        password, // ⚠️ EN PRODUCTION: hasher avec bcrypt
        isAdmin: isAdmin || false,
        createdAt: new Date().toISOString(),
        orders: []
    };

    users.push(newUser);
    res.status(201).json({ id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin });
});

// Connexion
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    res.json({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
    });
});

// ========== UTILISATEURS ==========

// Récupérer le profil de l'utilisateur
app.get('/api/users/:userId', (req, res) => {
    const user = users.find(u => u.id === req.params.userId);
    if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        orderCount: user.orders.length
    });
});

// Supprimer un utilisateur
app.delete('/api/users/:userId', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.userId);
    if (index === -1) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const deletedUser = users.splice(index, 1);
    res.json({ message: 'Utilisateur supprimé', user: deletedUser[0].email });
});

// ========== COMMANDES ==========

// Créer une commande
app.post('/api/orders', (req, res) => {
    const { userId, items, totalPrice } = req.body;

    if (!userId || !items || !totalPrice) {
        return res.status(400).json({ error: 'Données manquantes' });
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const newOrder = {
        id: uuidv4(),
        userId,
        items,
        totalPrice,
        status: 'En attente',
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    user.orders.push(newOrder.id);

    res.status(201).json(newOrder);
});

// Récupérer les commandes d'un utilisateur
app.get('/api/users/:userId/orders', (req, res) => {
    const user = users.find(u => u.id === req.params.userId);
    if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const userOrders = orders.filter(o => o.userId === req.params.userId);
    res.json(userOrders);
});

// ========== PANEL ADMIN ==========

// Récupérer tous les utilisateurs (admin seulement)
app.get('/api/admin/users', (req, res) => {
    const adminEmail = req.query.adminEmail;
    const admin = users.find(u => u.email === adminEmail && u.isAdmin);

    if (!admin) {
        return res.status(403).json({ error: 'Accès refusé' });
    }

    res.json(users.map(u => ({
        id: u.id,
        email: u.email,
        isAdmin: u.isAdmin,
        createdAt: u.createdAt,
        orderCount: u.orders.length
    })));
});

// Récupérer toutes les commandes (admin seulement)
app.get('/api/admin/orders', (req, res) => {
    const adminEmail = req.query.adminEmail;
    const admin = users.find(u => u.email === adminEmail && u.isAdmin);

    if (!admin) {
        return res.status(403).json({ error: 'Accès refusé' });
    }

    const stats = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
        orders: orders
    };

    res.json(stats);
});

// Mettre à jour le statut d'une commande (admin seulement)
app.patch('/api/admin/orders/:orderId', (req, res) => {
    const adminEmail = req.query.adminEmail;
    const admin = users.find(u => u.email === adminEmail && u.isAdmin);

    if (!admin) {
        return res.status(403).json({ error: 'Accès refusé' });
    }

    const order = orders.find(o => o.id === req.params.orderId);
    if (!order) {
        return res.status(404).json({ error: 'Commande non trouvée' });
    }

    order.status = req.body.status;
    res.json(order);
});

// ========== DÉMARRAGE DU SERVEUR ==========
app.listen(PORT, () => {
    console.log(`🚀 Serveur Kreisker Shop lancé sur http://localhost:${PORT}`);
});
