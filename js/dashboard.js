document.addEventListener('DOMContentLoaded', () => {
    function getFullPath(page) { return window.location.href.replace(/[^/]*$/, page); }
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'owner') { alert('Acesso negado.'); window.location.href = getFullPath('index.html'); return; }
    
    let stores = JSON.parse(localStorage.getItem('stores'));
    let products = JSON.parse(localStorage.getItem('products'));
    const myStore = stores.find(s => s.ownerId === currentUser.id);
    if (!myStore) { alert('Erro: loja não encontrada.'); return; }
    
    const productListDashboard = document.getElementById('product-list-dashboard');
    const productForm = document.getElementById('product-form');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const deleteProductModal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
    let productIdToDelete = null;
    
    document.getElementById('editStoreName').value = myStore.name;
    document.getElementById('editStoreImage').value = myStore.imageUrl;
    document.getElementById('editStoreAddress').value = myStore.address;
    document.getElementById('edit-store-form').addEventListener('submit', (e) => {
        e.preventDefault();
        myStore.name = document.getElementById('editStoreName').value;
        myStore.imageUrl = document.getElementById('editStoreImage').value;
        localStorage.setItem('stores', JSON.stringify(stores));
        alert('Dados da loja atualizados!');
    });
    
    function renderProducts() {
        const myProducts = products.filter(p => p.storeId === myStore.id);
        if(myProducts.length === 0) { productListDashboard.innerHTML = '<p>Nenhum produto cadastrado.</p>'; return; }
        productListDashboard.innerHTML = `<table class="table table-hover align-middle"><thead><tr><th>Imagem</th><th>Produto</th><th>Preço</th><th>Ações</th></tr></thead><tbody>
            ${myProducts.map(p => `<tr>
                <td><img src="${p.imageUrl || 'https://placehold.co/100x100/CCCCCC/FFFFFF?text=Sem+Foto'}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
                <td>${p.name}</td><td>R$ ${Number(p.price).toFixed(2)} / ${p.unit}</td>
                <td><button class="btn btn-sm btn-primary edit-btn" data-id="${p.id}"><i class="bi bi-pencil-square"></i></button> <button class="btn btn-sm btn-danger delete-btn" data-id="${p.id}"><i class="bi bi-trash-fill"></i></button></td>
            </tr>`).join('')}
        </tbody></table>`;
    }

    productForm.addEventListener('submit', e => {
        e.preventDefault();
        const productId = document.getElementById('productId').value;
        const productData = { name: document.getElementById('productName').value, price: parseFloat(document.getElementById('productPrice').value), unit: document.getElementById('productUnit').value, imageUrl: document.getElementById('productImage').value, storeId: myStore.id };
        if (productId) { Object.assign(products.find(p => p.id == productId), productData); } 
        else { productData.id = Date.now(); products.push(productData); }
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        productModal.hide();
    });

    document.getElementById('add-product-btn').addEventListener('click', () => { productForm.reset(); document.getElementById('productId').value = ''; document.getElementById('productModalLabel').textContent = 'Adicionar Produto'; });

    productListDashboard.addEventListener('click', e => {
        const target = e.target.closest('button');
        if (!target) return;
        const id = target.dataset.id;
        if (target.classList.contains('edit-btn')) {
            const p = products.find(p => p.id == id);
            document.getElementById('productId').value = p.id; document.getElementById('productName').value = p.name; document.getElementById('productPrice').value = p.price; document.getElementById('productUnit').value = p.unit; document.getElementById('productImage').value = p.imageUrl;
            document.getElementById('productModalLabel').textContent = 'Editar Produto';
            productModal.show();
        }
        if (target.classList.contains('delete-btn')) { productIdToDelete = id; deleteProductModal.show(); }
    });

    document.getElementById('confirm-delete-product-btn').addEventListener('click', () => { products = products.filter(p => p.id != productIdToDelete); localStorage.setItem('products', JSON.stringify(products)); renderProducts(); deleteProductModal.hide(); });
    
    document.getElementById('confirm-delete-store-btn').addEventListener('click', () => {
        localStorage.setItem('products', JSON.stringify(JSON.parse(localStorage.getItem('products')).filter(p => p.storeId !== myStore.id)));
        localStorage.setItem('stores', JSON.stringify(JSON.parse(localStorage.getItem('stores')).filter(s => s.id !== myStore.id)));
        localStorage.setItem('users', JSON.stringify(JSON.parse(localStorage.getItem('users')).filter(u => u.id !== currentUser.id)));
        localStorage.removeItem('currentUser');
        alert('Sua conta foi excluída.');
        window.location.href = getFullPath('index.html');
    });

    renderProducts();
});