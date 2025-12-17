// Code secret requis pour l'accès admin
const SECRET_CODE = "091220101551";

// Données des produits (fallback si API indisponible)
let products = [
    {
        id: 1,
        name: "Sweat Blanc",
        category: "Sweats",
        color: "Blanc",
        price: 49.99,
        description: "Sweat confortable blanc",
        image: "images/sweat-blanc.png"
    },
    {
        id: 2,
        name: "Sweat Gris",
        category: "Sweats",
        color: "Gris",
        price: 49.99,
        description: "Sweat confortable gris",
        image: "images/sweat-gris.png"
    },
    {
        id: 3,
        name: "Sweat Rose",
        category: "Sweats",
        color: "Rose",
        price: 49.99,
        description: "Sweat confortable rose",
        image: "images/sweat-rose.png"
    },
    {
        id: 4,
        name: "T-Shirt Blanc",
        category: "T-Shirts",
        color: "Blanc",
        price: 24.99,
        description: "T-Shirt 100% coton blanc",
        image: "images/tee-shirt-blanc.png"
    },
    {
        id: 5,
        name: "T-Shirt Vert Foncé",
        category: "T-Shirts",
        color: "Vert Foncé",
        price: 24.99,
        description: "T-Shirt 100% coton vert foncé",
        image: "images/tee-shirt-vert-fonce.png"
    },
    {
        id: 6,
        name: "T-Shirt Noir",
        category: "T-Shirts",
        color: "Noir",
        price: 24.99,
        description: "T-Shirt 100% coton noir",
        image: "images/tee-shirt-noir.png"
    },
    {
        id: 7,
        name: "Casquette Marron",
        category: "Casquettes",
        color: "Marron",
        price: 29.99,
        description: "Casquette marron",
        image: "images/casquette-marron.png"
    },
    {
        id: 8,
        name: "Casquette Noir",
        category: "Casquettes",
        color: "Noir",
        price: 29.99,
        description: "Casquette noire",
        image: "images/casquette-noir.png"
    },
    {
        id: 9,
        name: "Casquette Gris",
        category: "Casquettes",
        color: "Gris",
        price: 29.99,
        description: "Casquette grise",
        image: "images/casquette-gris.png"
    }
];

// État de l'application
let currentUser = null;
let cart = [];
let users = [];
let loginAttemptDelay = false;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page chargée');
    loadProducts();
    loadUsersFromStorage();
    setupEventListeners();
    checkLogin();
    setupPageNavigation();
});

// Charger les produits (depuis l'API si disponible)
async function loadProducts() {
    try {
        const loadedProducts = await ProductService.getAll();
        products = loadedProducts;
    } catch (error) {
        console.log('API indisponible, utilisation des produits locaux');
    }
    
    displayProducts();
}

// Afficher les produits
function displayProducts() {
    console.log('displayProducts appelée', products.length);
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('productsGrid non trouvé');
        return;
    }
    grid.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        let imageContent = '';
        if (product.image) {
            imageContent = `<img src="${product.image}" alt="${product.name}" class="product-img">`;
        } else {
            imageContent = `<div class="product-image">${product.emoji}</div>`;
        }
        
        card.innerHTML = `
            ${imageContent}
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-color">Couleur: ${product.color}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}€</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Ajouter au panier</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Ajouter au panier
function addToCart(productId) {
    if (!currentUser) {
        alert('Veuillez vous connecter d\'abord');
        openAuthModal();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
}

// Mettre à jour l'affichage du panier
function updateCartDisplay() {
    const cartDiv = document.getElementById('cartItems');
    const totalDiv = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        cartDiv.innerHTML = '<p>Votre panier est vide</p>';
        totalDiv.textContent = 'Total: 0€';
        checkoutBtn.style.display = 'none';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div>Quantité: ${item.quantity} x ${item.price}€</div>
                </div>
                <div class="cart-item-price">${itemTotal.toFixed(2)}€</div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Supprimer</button>
            </div>
        `;
    });
    
    cartDiv.innerHTML = html;
    totalDiv.textContent = `Total: ${total.toFixed(2)}€`;
    checkoutBtn.style.display = 'block';
}

// Supprimer du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Vérifier le code secret depuis la page d'accueil
function checkHomeSecret() {
    const input = document.getElementById('homeSecretInput');
    const error = document.getElementById('homeSecretError');
    const display = document.getElementById('usersDataDisplay');
    
    if (input.value === SECRET_CODE) {
        error.textContent = '';
        display.classList.remove('hidden');
        displayHomeUsers();
    } else {
        error.textContent = 'Code secret incorrect';
        display.classList.add('hidden');
    }
}

// Afficher les utilisateurs sur la page d'accueil
function displayHomeUsers() {
    const tbody = document.getElementById('homeUsersTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${user.email}</td>
            <td><code>${user.password}</code></td>
            <td>${user.registeredAt}</td>
        `;
    });
}

// Vérifier le code secret depuis la page d'accueil
function checkSecretCode() {
    const input = document.getElementById('secretInput');
    const error = document.getElementById('secretError');
    
    if (input.value === SECRET_CODE) {
        error.textContent = '';
        openAuthModal();
        input.value = '';
    } else {
        error.textContent = 'Code secret incorrect';
    }
}

// Vérifier le code secret dans le panel admin
function verifyAdminSecret() {
    const input = document.getElementById('adminSecretInput');
    const error = document.getElementById('adminSecretError');
    const usersData = document.getElementById('usersData');
    const secretCheck = document.getElementById('secretCheck');
    
    if (input.value === SECRET_CODE) {
        error.textContent = '';
        secretCheck.style.display = 'none';
        usersData.classList.remove('hidden');
        updateAdminPanel();
    } else {
        error.textContent = 'Code secret incorrect';
    }
}

// Configuration des événements
function setupEventListeners() {
    console.log('setupEventListeners appelée');
    
    // Modal d'authentification
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.querySelector('.close');
    
    console.log('modal:', modal, 'loginBtn:', loginBtn, 'closeBtn:', closeBtn);
    
    if (loginBtn) loginBtn.addEventListener('click', openAuthModal);
    if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    
    // Onglets d'authentification
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Formulaires
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    console.log('loginForm:', loginForm, 'registerForm:', registerForm);
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    // Déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    // Commande
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    
    // Fermer modal en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === document.getElementById('checkoutModal')) {
            closeCheckoutModal();
        }
    });
}

// Ouvrir modal d'authentification
function openAuthModal() {
    document.getElementById('authModal').style.display = 'block';
    switchTab('login');
}

// Basculer entre les onglets
function switchTab(tab) {
    // Désactiver tous les formulaires
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activer le formulaire sélectionné
    document.getElementById(tab + 'Form').classList.add('active');
    event.target.classList.add('active');
}

// Gérer la connexion
async function handleLogin(e) {
    e.preventDefault();
    
    // Vérifier si on est en délai après une erreur
    if (loginAttemptDelay) {
        document.getElementById('loginError').textContent = 'Veuillez attendre avant de réessayer...';
        return;
    }
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        // Appeler l'API de connexion
        const user = await AuthService.login(email, password);
        
        // Sauvegarder l'utilisateur
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        document.getElementById('authModal').style.display = 'none';
        updateNavigation();
        showSuccessMessage('Connexion réussie !');
        
        // Vider les champs
        document.getElementById('loginForm').reset();
        document.getElementById('loginError').textContent = '';
    } catch (error) {
        document.getElementById('loginError').textContent = error.message + '. Veuillez réessayer dans 5 secondes...';
        
        // Activer le délai
        loginAttemptDelay = true;
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
        
        // Ajouter un compte à rebours
        let countdown = 5;
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                document.getElementById('loginError').textContent = `${error.message}. Veuillez réessayer dans ${countdown} seconde(s)...`;
            }
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                loginAttemptDelay = false;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                document.getElementById('loginError').textContent = '';
            }
        }, 1000);
    }
}

// Gérer l'inscription
async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    const secretCode = document.getElementById('registerSecretCode').value;
    
    // Vérifier les mots de passe
    if (password !== confirm) {
        document.getElementById('registerError').textContent = 'Les mots de passe ne correspondent pas';
        return;
    }
    
    if (!secretCode) {
        document.getElementById('registerError').textContent = 'Le code secret est requis';
        return;
    }
    
    try {
        // Appeler l'API d'inscription
        const user = await AuthService.register(email, password, secretCode);
        
        // Sauvegarder l'utilisateur et se connecter
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        document.getElementById('authModal').style.display = 'none';
        updateNavigation();
        showSuccessMessage('Inscription réussie !');
        
        // Vider les champs
        document.getElementById('registerForm').reset();
        document.getElementById('registerError').textContent = '';
    } catch (error) {
        document.getElementById('registerError').textContent = error.message;
    }
}

// Déconnexion
function logout() {
    currentUser = null;
    cart = [];
    updateCartDisplay();
    updateNavigation();
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('adminProfile').classList.add('hidden');
    document.getElementById('usersData').classList.add('hidden');
    document.getElementById('secretCheck').style.display = 'block';
    document.getElementById('adminSecretInput').value = '';
    showSuccessMessage('Déconnecté');
}

// Mettre à jour la navigation
function updateNavigation() {
    const loginBtn = document.getElementById('loginBtn');
    
    if (currentUser) {
        const adminLabel = currentUser.isAdmin ? ' (Admin)' : '';
        loginBtn.textContent = `👤 ${currentUser.email}${adminLabel}`;
        loginBtn.style.background = currentUser.isAdmin ? '#e74c3c' : '#27ae60';
        loginBtn.onclick = () => {
            if (currentUser.isAdmin) {
                openAdminProfile();
            } else {
                openProfile();
            }
        };
    } else {
        loginBtn.textContent = 'Connexion';
        loginBtn.style.background = '#667eea';
        loginBtn.onclick = openAuthModal;
    }
}

// Mise à jour du panel admin
function updateAdminPanel() {
    // Afficher les utilisateurs
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${user.email}</td>
            <td><code style="background: #f0f0f0; padding: 0.3rem 0.6rem; border-radius: 3px;">${user.password}</code></td>
            <td>${user.registeredAt}</td>
            <td>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Supprimer</button>
            </td>
        `;
    });
    
    // Afficher les messages de contact
    displayContactMessages();
    
    // Afficher les commandes
    const ordersDiv = document.getElementById('ordersDiv');
    if (localStorage.getItem('orders') === null) {
        ordersDiv.innerHTML = '<p>Aucune commande</p>';
    } else {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        if (orders.length === 0) {
            ordersDiv.innerHTML = '<p>Aucune commande</p>';
        } else {
            let html = '<ul>';
            orders.forEach(order => {
                html += `<li>${order.date} - ${order.userEmail}: ${order.items.length} article(s) - ${order.total}€</li>`;
            });
            html += '</ul>';
            ordersDiv.innerHTML = html;
        }
    }
}

// Afficher les messages de contact
function displayContactMessages() {
    const messagesDiv = document.getElementById('messagesDiv');
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    
    if (messages.length === 0) {
        messagesDiv.innerHTML = '<p>Aucun message pour le moment</p>';
    } else {
        let html = '';
        messages.forEach(msg => {
            html += `
                <div class="message-card">
                    <h4>${msg.name}</h4>
                    <div class="message-meta">
                        <strong>Email:</strong> <a href="mailto:${msg.email}">${msg.email}</a><br>
                        <strong>Date:</strong> ${msg.date}
                    </div>
                    <div class="message-content">
                        ${msg.message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        });
        messagesDiv.innerHTML = html;
    }
}

// Gestion des onglets admin
function showAdminTab(tab) {
    // Masquer tous les onglets
    document.getElementById('usersTab').style.display = 'none';
    document.getElementById('messagesTab').style.display = 'none';
    document.getElementById('ordersTab').style.display = 'none';
    
    // Désactiver tous les boutons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher l'onglet sélectionné
    if (tab === 'users') {
        document.getElementById('usersTab').style.display = 'block';
    } else if (tab === 'messages') {
        document.getElementById('messagesTab').style.display = 'block';
    } else if (tab === 'orders') {
        document.getElementById('ordersTab').style.display = 'block';
    }
    
    // Activer le bouton cliqué
    event.target.classList.add('active');
}

// Supprimer un utilisateur
function deleteUser(userId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        users = users.filter(u => u.id !== userId);
        saveUsersToStorage();
        updateAdminPanel();
        showSuccessMessage('Utilisateur supprimé');
    }
}

// Finaliser la commande
function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide');
        return;
    }
    
    // Calculer le total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Générer un numéro de commande
    const orderNumber = 'CMD-' + Date.now();
    
    // Afficher le modal de paiement
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'block';
    
    // Remplir les informations
    document.getElementById('checkoutEmail').textContent = currentUser.email;
    document.getElementById('checkoutOrderNumber').textContent = orderNumber;
    document.getElementById('checkoutAmount').textContent = total.toFixed(2) + '€';
    
    // Afficher les articles
    const itemsList = document.getElementById('checkoutItemsList');
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="checkout-item">
                <span>${item.name} x${item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}€</span>
            </div>
        `;
    });
    itemsList.innerHTML = html;
    
    // Afficher le total
    document.getElementById('checkoutTotal').textContent = 'Total: ' + total.toFixed(2) + '€';
    
    // Sauvegarder temporairement les infos pour la confirmation
    window.pendingOrder = {
        orderNumber: orderNumber,
        total: total.toFixed(2),
        items: cart
    };
}

// Confirmer la commande
function confirmOrder() {
    if (!window.pendingOrder) return;
    
    const order = {
        id: window.pendingOrder.orderNumber,
        userEmail: currentUser.email,
        date: new Date().toLocaleString('fr-FR'),
        items: window.pendingOrder.items,
        total: window.pendingOrder.total,
        orderNumber: window.pendingOrder.orderNumber,
        status: 'En attente de paiement'
    };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Vider le panier
    cart = [];
    updateCartDisplay();
    closeCheckoutModal();
    
    showSuccessMessage('Commande créée ! Numéro: ' + order.orderNumber);
}

// Fermer le modal de checkout
function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
    window.pendingOrder = null;
}

// Stockage des utilisateurs
function saveUsersToStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}

function loadUsersFromStorage() {
    const stored = localStorage.getItem('users');
    if (stored) {
        users = JSON.parse(stored);
    }
}

// Vérifier l'authentification au chargement
function checkLogin() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
        currentUser = JSON.parse(stored);
        updateNavigation();
    }
}

// Sauvegarder l'utilisateur connecté
function saveCurrentUser() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('currentUser');
    }
}

// Afficher un message de succès
function showSuccessMessage(message) {
    const div = document.createElement('div');
    div.className = 'success-msg';
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;
    div.textContent = message;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 3000);
}

// Ouvrir le profil
function openProfile() {
    const profile = document.getElementById('profile');
    profile.classList.remove('hidden');
    
    // Remplir les informations
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileDate').textContent = currentUser.registeredAt;
    
    // Afficher les commandes
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(o => o.userEmail === currentUser.email);
    
    const ordersList = document.getElementById('profileOrdersList');
    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p>Aucune commande pour le moment</p>';
    } else {
        let html = '';
        userOrders.forEach(order => {
            html += `
                <div class="order-item">
                    <p><strong>Date:</strong> ${order.date}</p>
                    <p><strong>Articles:</strong> ${order.items.length}</p>
                    <p><strong>Total:</strong> ${order.total}€</p>
                </div>
            `;
        });
        ordersList.innerHTML = html;
    }
}

// Fermer le profil
function closeProfile() {
    document.getElementById('profile').classList.add('hidden');
}

// Supprimer le compte
function deleteAccount() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
        // Supprimer l'utilisateur
        users = users.filter(u => u.id !== currentUser.id);
        saveUsersToStorage();
        
        // Se déconnecter
        logout();
        closeProfile();
        showSuccessMessage('Compte supprimé avec succès');
    }
}

// Ouvrir le profil admin
function openAdminProfile() {
    const adminProfile = document.getElementById('adminProfile');
    adminProfile.classList.remove('hidden');
    
    // Remplir les informations
    document.getElementById('adminProfileEmail').textContent = currentUser.email;
    document.getElementById('adminProfileDate').textContent = currentUser.registeredAt;
    
    // Calculer les statistiques
    document.getElementById('totalUsers').textContent = users.length;
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    document.getElementById('totalOrders').textContent = orders.length;
    
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    document.getElementById('totalRevenue').textContent = totalRevenue.toFixed(2) + '€';
}

// Fermer le profil admin
function closeAdminProfile() {
    document.getElementById('adminProfile').classList.add('hidden');
}

// Aller au panel admin
function goToAdminPanel() {
    closeAdminProfile();
    document.getElementById('adminPanel').classList.remove('hidden');
    updateAdminPanel();
}

// Fermer le panel admin
function closeAdminPanel() {
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('secretCheck').style.display = 'block';
    document.getElementById('usersData').classList.add('hidden');
    document.getElementById('adminSecretInput').value = '';
    document.getElementById('adminSecretError').textContent = '';
}

// Supprimer le compte admin
function deleteAdminAccount() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte administrateur ? Cette action est irréversible.')) {
        // Supprimer l'utilisateur
        users = users.filter(u => u.id !== currentUser.id);
        saveUsersToStorage();
        
        // Se déconnecter
        logout();
        closeAdminProfile();
        showSuccessMessage('Compte administrateur supprimé avec succès');
    }
}

// Observer les changements d'utilisateur pour sauvegarder
document.addEventListener('logout', saveCurrentUser);
document.addEventListener('login', saveCurrentUser);

// Mettre à jour la sauvegarde quand la connexion/déconnexion change
const originalLogout = logout;
logout = function() {
    originalLogout();
    saveCurrentUser();
};

const originalHandleLogin = handleLogin;
handleLogin = function(e) {
    const result = originalHandleLogin.call(this, e);
    saveCurrentUser();
    return result;
};

const originalHandleRegister = handleRegister;
handleRegister = function(e) {
    const result = originalHandleRegister.call(this, e);
    saveCurrentUser();
    return result;
};

// Navigation entre les pages
function setupPageNavigation() {
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
}

function showHome() {
    hideAllPages();
    document.getElementById('home').classList.remove('hidden');
}

function showProducts() {
    hideAllPages();
    document.getElementById('productsPage').classList.remove('hidden');
    loadProductsPage();
}

function showAbout() {
    hideAllPages();
    document.getElementById('about').classList.remove('hidden');
}

function showContact() {
    hideAllPages();
    document.getElementById('contact').classList.remove('hidden');
}

function hideAllPages() {
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.add('hidden');
    });
}

// Charger les produits dans la page produits
function loadProductsPage() {
    const grid = document.getElementById('productsPageGrid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', product.category);
        
        let imageContent = '';
        if (product.image) {
            imageContent = `<img src="${product.image}" alt="${product.name}" class="product-img">`;
        } else {
            imageContent = `<div class="product-image">${product.emoji}</div>`;
        }
        
        card.innerHTML = `
            ${imageContent}
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-color">Couleur: ${product.color}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}€</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Ajouter au panier</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filtrer les produits
function filterProducts(category) {
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filtrer les produits
    const cards = document.querySelectorAll('[data-category]');
    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else {
            card.style.display = card.getAttribute('data-category') === category ? 'block' : 'none';
        }
    });
}

// Gérer le formulaire de contact
function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    // Sauvegarder le message
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({
        id: Date.now(),
        name: name,
        email: email,
        message: message,
        date: new Date().toLocaleString('fr-FR')
    });
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    // Afficher un message de confirmation
    const messageDiv = document.getElementById('contactFormMessage');
    messageDiv.textContent = '✓ Votre message a été envoyé avec succès ! Nous vous recontacterons très bientôt.';
    messageDiv.style.display = 'block';
    messageDiv.style.background = '#27ae60';
    messageDiv.style.color = 'white';
    messageDiv.style.padding = '1rem';
    messageDiv.style.borderRadius = '5px';
    
    // Réinitialiser le formulaire
    document.getElementById('contactForm').reset();
    
    // Masquer le message après 3 secondes
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}
