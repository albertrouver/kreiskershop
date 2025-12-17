// Configuration de l'API
const API_URL = 'http://localhost:3000/api';

// Service API pour l'authentification
const AuthService = {
    async register(email, password, secretCode) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, secretCode, isAdmin: false })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        return response.json();
    },

    async login(email, password) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        return response.json();
    }
};

// Service API pour les produits
const ProductService = {
    async getAll() {
        const response = await fetch(`${API_URL}/products`);
        return response.json();
    }
};

// Service API pour les utilisateurs
const UserService = {
    async getProfile(userId) {
        const response = await fetch(`${API_URL}/users/${userId}`);
        return response.json();
    },

    async delete(userId) {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};

// Service API pour les commandes
const OrderService = {
    async create(userId, items, totalPrice) {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, items, totalPrice })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        return response.json();
    },

    async getUserOrders(userId) {
        const response = await fetch(`${API_URL}/users/${userId}/orders`);
        return response.json();
    }
};

// Service API Admin
const AdminService = {
    async getUsers(adminEmail) {
        const response = await fetch(`${API_URL}/admin/users?adminEmail=${adminEmail}`);
        if (!response.ok) throw new Error('Accès refusé');
        return response.json();
    },

    async getOrders(adminEmail) {
        const response = await fetch(`${API_URL}/admin/orders?adminEmail=${adminEmail}`);
        if (!response.ok) throw new Error('Accès refusé');
        return response.json();
    },

    async updateOrderStatus(orderId, status, adminEmail) {
        const response = await fetch(`${API_URL}/admin/orders/${orderId}?adminEmail=${adminEmail}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour');
        return response.json();
    }
};
