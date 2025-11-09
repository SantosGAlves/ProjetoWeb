# 🍏 HortFast - Prototipagem de Interface de Usuário para E-commerce de Hortifrúti

## 📜 Descrição do Projeto

O **HortFast** é um **protótipo de interface de usuário (UI Mockup)** para um sistema de **compras online especializado em hortifrútis**. Ele simula uma plataforma onde clientes podem realizar pedidos em lojas locais (hortifrútis, sacolões) e agendar a entrega.

Este projeto foca primariamente na **Experiência do Usuário (UX)** e **Usabilidade** de um *e-commerce* de nicho. Ele contém a estrutura de *frontend* de diversas telas essenciais, incluindo:

  * **Páginas de Autenticação:** Login e Registro de usuários.
  * **Comércio Eletrônico:** **Loja (`store.html`)** com a listagem dos produtos (frutas, verduras e legumes), Carrinho de Compras e **Checkout** para finalização do pedido.
  * **Área Restrita:** **Painel de Controle/Dashboard** para que o usuário acompanhe o status de seus pedidos e gerencie seu perfil.

O desenvolvimento concentra-se na aplicação prática de **princípios de Design Centrado no Usuário (DCU)** para criar um fluxo de compra intuitivo e eficiente, sem a implementação de lógica de *backend* (servidor ou banco de dados) para processar transações reais.

-----

## 💡 Contexto: Interação Humano-Computador (IHC)

Este trabalho foi desenvolvido como **projeto final da disciplina de Interação Humano-Computador (IHC)**.

O projeto HortFast demonstra a aplicação prática de conhecimentos em:

  * **Usabilidade:** Foco na facilidade de navegação pelo catálogo de produtos e no processo de adição ao carrinho.
  * **Arquitetura da Informação:** Estruturação clara e lógica das categorias de hortifrúti e o fluxo linear de compra (`store.html` -\> Carrinho -\> `checkout.html`).
  * **Design de Interface:** Utilização de elementos visuais adequados para um sistema de alimentos (cores, ícones e tipografia).

O objetivo central é validar a **prototipagem de alta fidelidade** como ferramenta para comunicar e testar a solução de design para um *e-commerce* de hortifrúti, garantindo que o cliente possa encontrar e comprar seus produtos frescos com o mínimo de esforço cognitivo.

-----

## 🛠️ Tecnologias Utilizadas

O projeto é inteiramente baseado em tecnologias de **Frontend (Lado do Cliente)**:

| Tecnologia | Descrição |
| :--- | :--- |
| **HTML5** | Estrutura semântica e esqueleto das páginas do HortFast. |
| **CSS3** | Estilização visual, layout e responsividade para garantir que a loja funcione bem em diferentes dispositivos. |
| **JavaScript (Vanilla JS)** | Lógica de interação básica (e.g., manipulação de elementos da interface e simulação de validações). |

-----

## ⚙️ Como Testar e Executar o Projeto

Como este é um protótipo estático de *frontend*, a execução é extremamente simples e não requer a instalação de servidores ou dependências.

### 1\. Clonar o Repositório

Use o `git` para baixar o código:

```bash
git clone https://github.com/SantosGAlves/ProjetoWeb
```

### 2\. Abrir no Navegador

1.  Acesse a pasta do projeto: `cd ProjetoWeb`
2.  Localize o arquivo principal: **`index.html`**
3.  **Abra o `index.html`** diretamente no seu navegador de preferência (Google Chrome, Firefox, Edge, etc.).

Você poderá simular toda a jornada do usuário no HortFast, desde o cadastro até a visualização do painel.

-----

## 🗺️ Estrutura do Projeto

```
ProjetoWeb/
├── css/              # Estilos visuais do HortFast
├── js/               # Lógica de interatividade (ex: simulação de carrinho)
├── checkout.html     # Tela de finalização de compra (Pagamento e Entrega)
├── dashboard.html    # Painel do usuário (acompanhamento de pedidos)
├── index.html        # Página inicial (Apresentação do HortFast)
├── login.html        # Tela de acesso de clientes
├── register.html     # Tela de cadastro de novos clientes
└── store.html        # Catálogo de produtos (Hortifrúti)
```
