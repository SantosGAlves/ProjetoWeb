const themeToggle = {
    applySavedTheme: () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        const toggleIcon = document.getElementById('theme-toggle-icon');
        if (toggleIcon) {
            toggleIcon.className = savedTheme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    },
    toggle: () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        document.getElementById('theme-toggle-icon').className = newTheme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }
};

themeToggle.applySavedTheme();

function getFullPath(page) {
    return window.location.href.replace(/[^/]*$/, page);
}

// --- FUNÇÕES GLOBAIS DO CARRINHO (Acessíveis por outros arquivos) ---

function addToCart(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'customer') {
        alert('Por favor, faça login como cliente para adicionar produtos ao carrinho.');
        window.location.href = getFullPath('login.html');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity++;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartBadge();
    renderCart();
    
    const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    cartOffcanvas.show();
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.remove('d-none');
        } else {
            badge.classList.add('d-none');
        }
    }
}

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products'));
    const modalBody = document.getElementById('cart-offcanvas-body');
    const modalFooter = document.getElementById('cart-offcanvas-footer');

    if (!modalBody || !modalFooter) return;

    if (cart.length === 0) {
        modalBody.innerHTML = '<p class="text-center my-4">Seu carrinho está vazio.</p>';
        modalFooter.innerHTML = '';
        return;
    }

    let total = 0;
    modalBody.innerHTML = `<div class="list-group list-group-flush">
        ${cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return '';
            total += product.price * item.quantity;
            return `<div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="my-0">${product.name}</h6>
                            <small class="text-muted">R$ ${product.price.toFixed(2)}</small>
                        </div>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary cart-quantity-btn" data-product-id="${product.id}" data-change="-1">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary cart-quantity-btn" data-product-id="${product.id}" data-change="1">+</button>
                        </div>
                        <button class="btn btn-sm btn-outline-danger remove-from-cart-btn" data-product-id="${product.id}"><i class="bi bi-trash"></i></button>
                    </div>`;
        }).join('')}
    </div>`;

    modalFooter.innerHTML = `
        <div class="d-flex justify-content-between w-100 mb-2">
            <span class="fw-bold">Total</span>
            <strong>R$ ${total.toFixed(2)}</strong>
        </div>
        <a href="checkout.html" class="btn btn-success w-100">Finalizar Pedido</a>
    `;
    
    document.querySelectorAll('.cart-quantity-btn').forEach(btn => btn.addEventListener('click', e => updateCartQuantity(parseInt(e.currentTarget.dataset.productId), parseInt(e.currentTarget.dataset.change))));
    document.querySelectorAll('.remove-from-cart-btn').forEach(btn => btn.addEventListener('click', e => removeFromCart(parseInt(e.currentTarget.dataset.productId))));
}

function updateCartQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

// --- LÓGICA EXECUTADA AO CARREGAR A PÁGINA ---

document.addEventListener('DOMContentLoaded', () => {
    
    function handleLogin(email, password, role) {
        const users = JSON.parse(localStorage.getItem('users'));
        const foundUser = users.find(u => u.email === email && u.password === password && u.role === role);
        const loginAlert = document.getElementById('login-alert');
        
        if (foundUser) {
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            if (role === 'customer') {
                localStorage.setItem('cart', JSON.stringify([]));
            }
            window.location.href = role === 'customer' ? getFullPath('index.html') : getFullPath('dashboard.html');
        } else {
            loginAlert.textContent = 'Credenciais inválidas.';
            loginAlert.classList.remove('d-none');
        }
    }

    function updateNavbar() {
        const navDynamic = document.getElementById('nav-dynamic');
        if (!navDynamic) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let navHTML = '';

        navHTML += `<li class="nav-item me-2">
                        <button class="btn btn-outline-secondary" id="theme-toggle-btn" onclick="themeToggle.toggle()">
                            <i id="theme-toggle-icon" class="bi bi-moon-fill"></i>
                        </button>
                    </li>`;

        if (currentUser) {
            navHTML += `<li class="nav-item"><a class="nav-link" href="index.html">Lojas</a></li>`;
            
            if (currentUser.role === 'owner') {
                navHTML += `<li class="nav-item"><a class="nav-link" href="dashboard.html">Meu Painel</a></li>`;
            } else {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
                navHTML += `<li class="nav-item">
                                <a class="nav-link position-relative" href="#" id="cart-icon" data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas">
                                    <i class="bi bi-cart-fill fs-5"></i>
                                    <span id="cart-badge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${totalItems === 0 ? 'd-none' : ''}">${totalItems}</span>
                                </a>
                            </li>`;
            }
            navHTML += `<li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Olá, ${currentUser.name.split(' ')[0]}</a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#" id="logout-btn">Sair</a></li>
                            </ul>
                        </li>`;
        } else {
            navHTML += `<li class="nav-item"><a class="nav-link" href="register.html">Para Empresas</a></li>
                        <li class="nav-item"><a class="nav-link" href="login.html">Entrar</a></li>
                        <li class="nav-item"><a class="btn btn-success" href="register.html">Criar conta</a></li>`;
        }
        
        navDynamic.innerHTML = navHTML;
        
        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userLocation');
            localStorage.removeItem('cart');
            window.location.href = getFullPath('index.html');
        });

        document.getElementById('cart-icon')?.addEventListener('click', renderCart);
    }

    document.getElementById('login-form-customer')?.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin(document.getElementById('email-customer').value, document.getElementById('password-customer').value, 'customer');
    });
    
    document.getElementById('login-form-owner')?.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin(document.getElementById('email-owner').value, document.getElementById('password-owner').value, 'owner');
    });

    document.getElementById('register-form-customer')?.addEventListener('submit', e => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users'));
        users.push({ id: Date.now(), name: document.getElementById('name-customer').value, email: document.getElementById('email-customer').value, password: document.getElementById('password-customer').value, role: 'customer' });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Cadastro realizado! Faça seu login.');
        window.location.href = getFullPath('login.html');
    });

    const cepInput = document.getElementById('storeCep');
    if (cepInput) {
        cepInput.addEventListener('blur', async () => {
            const cep = cepInput.value.replace(/\D/g, '');
            if (cep.length !== 8) return;
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (data.erro) {
                    alert('CEP não encontrado.');
                } else {
                    document.getElementById('storeStreet').value = data.logradouro;
                    document.getElementById('storeNeighborhood').value = data.bairro;
                    document.getElementById('storeCity').value = data.localidade;
                }
            } catch (error) {
                alert('Não foi possível buscar o CEP.');
            }
        });
    }

    document.getElementById('register-form-owner')?.addEventListener('submit', async e => {
        e.preventDefault();
        const registerBtn = document.getElementById('register-owner-btn');
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Validando...';
        
        const fullAddress = `${document.getElementById('storeStreet').value}, ${document.getElementById('storeNumber').value}, ${document.getElementById('storeCity').value}`;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`);
            const data = await response.json();
            if (!data || data.length === 0) { throw new Error('Endereço não pôde ser validado geograficamente.'); }
            
            const { lat, lon } = data[0];
            const users = JSON.parse(localStorage.getItem('users'));
            const stores = JSON.parse(localStorage.getItem('stores'));
            const newUser = { id: Date.now(), name: document.getElementById('name-owner').value, email: document.getElementById('email-owner').value, password: document.getElementById('password-owner').value, role: 'owner' };
            users.push(newUser);
            stores.push({ id: Date.now() + 1, ownerId: newUser.id, name: document.getElementById('storeName').value, address: fullAddress, lat: parseFloat(lat), lon: parseFloat(lon), imageUrl: document.getElementById('storeImage').value });
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('stores', JSON.stringify(stores));
            
            alert('Lojista cadastrado! Faça seu login.');
            window.location.href = getFullPath('login.html');
        } catch (error) {
            console.error("Erro no cadastro de lojista:", error);
            alert("Endereço inválido. Verifique os dados e tente novamente.");
            registerBtn.disabled = false;
            registerBtn.textContent = 'Cadastrar minha loja';
        }
    });

    updateNavbar();
});