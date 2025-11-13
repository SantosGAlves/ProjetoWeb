document.addEventListener('DOMContentLoaded', () => {
    const storeList = document.getElementById('store-list');
    const useLocationBtn = document.getElementById('use-location-btn');
    
    // Novos elementos
    const cepInput = document.getElementById('cep-input');
    const searchCepBtn = document.getElementById('search-cep-btn');
    
    let stores = JSON.parse(localStorage.getItem('stores')) || [];

    // Função para rolar a tela suavemente para a lista de lojas
    function scrollToStores() {
        const storeListElement = document.getElementById('stores-section'); // Mudado para a seção
        if (storeListElement) {
            storeListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function renderStores() {
        const userLocation = JSON.parse(localStorage.getItem('userLocation'));
        if (!userLocation) {
            storeList.innerHTML = '<div class="col-12 text-center text-muted"><p>Informe seu endereço ou CEP para vermos as lojas mais próximas.</p></div>';
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

    // NOVA FUNÇÃO para buscar por CEP
    async function searchByCep() {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) {
            alert('Por favor, digite um CEP válido.');
            return;
        }

        searchCepBtn.disabled = true;
        searchCepBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

        try {
            // 1. Buscar endereço no ViaCEP
            const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const viaCepData = await viaCepResponse.json();

            if (viaCepData.erro) {
                throw new Error('CEP não encontrado.');
            }

            // 2. Buscar lat/lon no Nominatim com base no endereço do ViaCEP
            const query = `${viaCepData.logradouro}, ${viaCepData.localidade}, ${viaCepData.uf}`;
            const nominatimResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const nominatimData = await nominatimResponse.json();

            if (!nominatimData || nominatimData.length === 0) {
                throw new Error('Não foi possível geolocalizar o endereço deste CEP.');
            }

            const { lat, lon } = nominatimData[0];
            const location = { lat: parseFloat(lat), lon: parseFloat(lon) };
            
            localStorage.setItem('userLocation', JSON.stringify(location));
            renderStores();

        } catch (error) {
            alert(`Erro ao buscar CEP: ${error.message}`);
        } finally {
            searchCepBtn.disabled = false;
            searchCepBtn.innerHTML = '<i class="bi bi-search"></i>';
        }
    }

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

    // Adiciona o listener para o novo botão
    searchCepBtn.addEventListener('click', searchByCep);
    
    useLocationBtn.addEventListener('click', useCurrentLocation);
    
    renderStores();
});