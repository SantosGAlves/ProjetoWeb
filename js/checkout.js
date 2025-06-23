// js/checkout.js
document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products'));

    const itemList = document.getElementById('checkout-item-list');
    const cartCount = document.getElementById('checkout-cart-count');
    const totalPriceEl = document.getElementById('checkout-total-price');
    const checkoutForm = document.getElementById('checkout-form');
    
    // Se o carrinho estiver vazio, redireciona para a página inicial
    if (cart.length === 0) {
        window.location.href = window.location.href.replace(/[^/]*$/, 'index.html');
        return;
    }

    function renderCheckoutSummary() {
        itemList.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                total += product.price * item.quantity;
                itemCount += item.quantity;
                
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between lh-sm';
                li.innerHTML = `
                    <div>
                        <h6 class="my-0">${product.name}</h6>
                        <small class="text-muted">Qtd: ${item.quantity}</small>
                    </div>
                    <span class="text-muted">R$ ${(product.price * item.quantity).toFixed(2)}</span>
                `;
                itemList.appendChild(li);
            }
        });
        
        cartCount.textContent = itemCount;
        totalPriceEl.textContent = `R$ ${total.toFixed(2)}`;
    }

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simplesmente mostra a mensagem de sucesso
        const checkoutContent = document.getElementById('checkout-content');
        const successMessage = document.getElementById('success-message');

        checkoutContent.classList.add('d-none');
        successMessage.classList.remove('d-none');
        
        // Limpa o carrinho
        localStorage.setItem('cart', JSON.stringify([]));
    });

    renderCheckoutSummary();
});