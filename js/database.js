function initializeDatabase() {
    // Mantém os dados de usuários e lojas como estavam
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            { id: 1, name: 'Carlos Ferreira', email: 'carlos@quitanda.com', password: '123', role: 'owner' },
            { id: 2, name: 'Ana Souza', email: 'ana@verdao.com', password: '123', role: 'owner' },
            { id: 3, name: 'Mariana Lima', email: 'mariana@email.com', password: '123', role: 'customer' }
        ]));
    }
    if (!localStorage.getItem('stores')) {
        localStorage.setItem('stores', JSON.stringify([
            { id: 1, ownerId: 1, name: 'Quitanda do Carlos', address: 'Av. Dr. Adhemar de Barros, 500, São José dos Campos', lat: -23.1963, lon: -45.8883, imageUrl: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { id: 2, ownerId: 2, name: 'Verdão da Ana', address: 'Rua Sete de Setembro, 200, São José dos Campos', lat: -23.1895, lon: -45.8821, imageUrl: 'https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg?auto=compress&cs=tinysrgb&w=600' }
        ]));
    }

    // AQUI ESTÁ A MUDANÇA: Adicionamos as URLs das imagens e mais produtos
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([
            // Produtos da loja 1 (Quitanda do Carlos)
            { id: 1, storeId: 1, name: 'Maçã Gala', price: 8.99, unit: 'kg', imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { id: 2, storeId: 1, name: 'Alface Crespa', price: 3.50, unit: 'un', imageUrl: 'https://images.pexels.com/photos/2893635/pexels-photo-2893635.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { id: 5, storeId: 1, name: 'Cenoura', price: 4.20, unit: 'kg', imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=600'},
            { id: 6, storeId: 1, name: 'Brócolis', price: 6.00, unit: 'un', imageUrl: 'https://images.pexels.com/photos/4054353/pexels-photo-4054353.jpeg?auto=compress&cs=tinysrgb&w=600' },

            // Produtos da loja 2 (Verdão da Ana)
            { id: 3, storeId: 2, name: 'Banana Nanica', price: 6.50, unit: 'kg', imageUrl: 'https://images.pexels.com/photos/5945848/pexels-photo-5945848.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { id: 4, storeId: 2, name: 'Tomate Italiano', price: 9.80, unit: 'kg', imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { id: 7, storeId: 2, name: 'Batata Lavada', price: 5.50, unit: 'kg', imageUrl: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600'},
            { id: 8, storeId: 2, name: 'Laranja Pera', price: 4.80, unit: 'kg', imageUrl: 'https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg?auto=compress&cs=tinysrgb&w=600'}
        ]));
    }
}

// Garante que a função seja chamada para inicializar os dados
initializeDatabase();