
document.addEventListener('DOMContentLoaded', () => {
    function getFullPath(page) { return window.location.href.replace(/[^/]*$/, page); }
    const params = new URLSearchParams(window.location.search);
    const storeId = parseInt(params.get('id'));

    if (!storeId) {
        window.location.href = getFullPath('index.html');
        return;
    }

    const stores = JSON.parse(localStorage.getItem('stores')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const store = stores.find(s => s.id === storeId);
    if (!store) {
        alert('Loja não encontrada.');
        window.location.href = getFullPath('index.html');
        return;
    }
    
    const storeProducts = products.filter(p => p.storeId === storeId);

    document.title = `${store.name} - Hortifast`;
    document.getElementById('store-header').innerHTML = `<h1>${store.name}</h1><p class="lead text-muted"><i class="bi bi-geo-alt"></i> ${store.address}</p>`;

    const productList = document.getElementById('store-product-list');
    productList.innerHTML = '';

    if (storeProducts.length === 0) {
        productList.innerHTML = '<p class="text-center col-12">Esta loja ainda não tem produtos cadastrados.</p>';
    } else {
        storeProducts.forEach(product => {
            productList.innerHTML += `
                <div class="col-md-4 col-lg-3">
                    <div class="card h-100 shadow-sm">
                        <img src="${product.imageUrl || 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=Sem+Foto'}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text fw-bold text-success fs-5 mt-auto">R$ ${Number(product.price).toFixed(2)} <span class="text-muted fs-6">/ ${product.unit}</span></p>
                        </div>
                        ${currentUser && currentUser.role === 'customer' ? `
                        <div class="card-footer p-0">
                            <button class="btn btn-success w-100 rounded-0 add-to-cart-btn" data-product-id="${product.id}">Adicionar</button>
                        </div>
                        ` : ''}
                    </div>
                </div>`;
        });
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.currentTarget;
            const productId = parseInt(button.dataset.productId);
            
            // Chama a função global para adicionar ao carrinho
            addToCart(productId);
            
            // Animação de feedback visual no botão
            button.disabled = true;
            button.innerHTML = '<i class="bi bi-check-lg"></i> Adicionado!';
            
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = 'Adicionar';
            }, 1500); // Reseta o botão após 1.5 segundos
        });
    });
});