document.addEventListener('DOMContentLoaded', () => {
    const storeList = document.getElementById('store-list');
    // const addressInput = document.getElementById('address-input'); // Removido
    // const searchAddressBtn = document.getElementById('search-address-btn'); // Removido
    const useLocationBtn = document.getElementById('use-location-btn');
    let stores = JSON.parse(localStorage.getItem('stores')) || [];

    // Função para rolar a tela suavemente para a lista de lojas
    function scrollToStores() {
        const storeListElement = document.getElementById('store-list'); 
        if (storeListElement) {
            storeListElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function renderStores() {
        const userLocation = JSON.parse(localStorage.getItem('userLocation'));
        if (!userLocation) {
            storeList.innerHTML = '<div class="col-12 text-center text-muted"><p>Informe seu endereço para vermos as lojas próximas.</p></div>';
            return;
        }

        storeList.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-success" role="status"></div></div>';

        setTimeout(() => {
            stores.forEach(store => {
                store.distance = getDistance(userLocation.lat, userLocation.lon, store.lat, store.lon);
            });
            stores.sort((a, b) => a.distance - b.distance);
            
            storeList.innerHTML = '';
            stores.forEach(store => {
                const distanceText = `<i class="bi bi-geo-alt-fill"></i> ${store.distance.toFixed(1)} km`;
                storeList.innerHTML += `
                    <div class="col-md-6 col-lg-4">
                        <a href="store.html?id=${store.id}" class="card-link">
                            <div class="card h-100 shadow-sm store-card">
                                <img src="${store.imageUrl || 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=Sem+Foto'}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${store.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${store.name}</h5>
                                    <p class="card-text text-muted">${store.address}</p>
                                </div>
                                <div class="card-footer bg-transparent border-0 text-end text-success fw-bold">${distanceText}</div>
                            </div>
                        </a>
                    </div>`;
            });

            // Rola a tela após os cards serem criados
            scrollToStores();

        }, 500);
    }

    // Função searchAddress removida

    function useCurrentLocation() {
        useLocationBtn.disabled = true;
        useLocationBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Buscando...'; 

        navigator.geolocation.getCurrentPosition(pos => {
            const location = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            localStorage.setItem('userLocation', JSON.stringify(location));
            renderStores();
            
            useLocationBtn.disabled = false;
            useLocationBtn.innerHTML = '<i class="bi bi-geo-alt-fill"></i> Ver Lojas Próximas';
        }, () => {
            alert('Não foi possível obter sua localização.');
            useLocationBtn.disabled = false;
            useLocationBtn.innerHTML = '<i class="bi bi-geo-alt-fill"></i> Ver Lojas Próximas';
        });
    }

    // searchAddressBtn.addEventListener('click', searchAddress); // Removido
    useLocationBtn.addEventListener('click', useCurrentLocation);
    
    renderStores();
});