document.addEventListener('DOMContentLoaded', () => {
    const storeList = document.getElementById('store-list');
    const addressInput = document.getElementById('address-input');
    const searchAddressBtn = document.getElementById('search-address-btn');
    const useLocationBtn = document.getElementById('use-location-btn');
    let stores = JSON.parse(localStorage.getItem('stores')) || [];

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
        }, 500);
    }

    async function searchAddress() {
        if (!addressInput.value) { alert('Digite um endereço.'); return; }
        searchAddressBtn.disabled = true;
        searchAddressBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput.value)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const location = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
                localStorage.setItem('userLocation', JSON.stringify(location));
                renderStores();
            } else {
                alert('Endereço não encontrado.');
            }
        } catch (error) {
            alert('Erro ao buscar o endereço.');
        } finally {
            searchAddressBtn.disabled = false;
            searchAddressBtn.innerHTML = 'Buscar';
        }
    }

    function useCurrentLocation() {
        useLocationBtn.disabled = true;
        navigator.geolocation.getCurrentPosition(pos => {
            const location = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            localStorage.setItem('userLocation', JSON.stringify(location));
            renderStores();
            useLocationBtn.disabled = false;
        }, () => {
            alert('Não foi possível obter sua localização.');
            useLocationBtn.disabled = false;
        });
    }

    searchAddressBtn.addEventListener('click', searchAddress);
    useLocationBtn.addEventListener('click', useCurrentLocation);
    
    renderStores();
});