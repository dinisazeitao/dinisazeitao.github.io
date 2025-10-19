// main.js - CÓDIGO FINAL E COMPLETO

const LOCAL_STORAGE_KEY = 'produtos-selecionados';

// =================================================================
// GESTÃO DO LOCAL STORAGE E CESTO
// =================================================================

function inicializarCesto() {
    if (localStorage.getItem(LOCAL_STORAGE_KEY) === null) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    }
}

function obterCesto() {
    const cestoJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    return cestoJSON ? JSON.parse(cestoJSON) : [];
}

function guardarCesto(cesto) {
    const cestoJSON = JSON.stringify(cesto);
    localStorage.setItem(LOCAL_STORAGE_KEY, cestoJSON);
    
    // Chama a função para renderizar o cesto após qualquer alteração
    atualizaCesto(); 
}

function adicionarAoCesto(produto) {
    let cesto = obterCesto();
    cesto.push(produto); 
    guardarCesto(cesto);
    console.log(`[Cesto] Adicionado: ${produto.title}. Total: ${cesto.length}`);
}

function removerDoCesto(produtoId) {
    let cesto = obterCesto();
    // Encontra o índice da primeira ocorrência do produto com o ID dado
    const indexParaRemover = cesto.findIndex(p => p.id === produtoId);
    
    if (indexParaRemover > -1) {
        cesto.splice(indexParaRemover, 1); // Remove 1 elemento no índice
        guardarCesto(cesto);
        console.log(`[Cesto] Item com ID ${produtoId} removido.`);
    }
}


// =================================================================
// RENDERIZAÇÃO DE PRODUTOS DA LOJA (COM IMAGEM)
// =================================================================

/**
 * Cria e configura um elemento <article> HTML para um único produto,
 * incluindo o botão "+ Adicionar ao cesto" e a imagem.
 * @param {Object} produto - Objeto produto da lista 'produtos'.
 * @returns {HTMLElement} - O elemento <article> totalmente construído.
 */
function criarProduto(produto) {
    const articleProduto = document.createElement('article');
    articleProduto.classList.add('produto-card');
    articleProduto.dataset.id = produto.id;

    const titulo = document.createElement('h3'); 
    titulo.textContent = produto.title;

    // Elementos para a Imagem
    const figura = document.createElement('figure');
    const imagem = document.createElement('img');
    
    // Define o caminho da imagem (assume-se que produto.image existe)
    imagem.src = produto.image || 'img/placeholder.jpg'; 
    imagem.alt = `Imagem de ${produto.title}`;
    imagem.classList.add('produto-imagem');
    
    figura.appendChild(imagem);
    
    const precoDisplay = document.createElement('p');
    if(produto.preco) { 
        precoDisplay.innerHTML = `Preço: <strong>${produto.preco.toFixed(2)} €</strong>`; 
    } else {
        precoDisplay.innerHTML = `Preço: <strong>N/D</strong>`; 
    }
    
    const botaoCesto = document.createElement('button');
    botaoCesto.textContent = '+ Adicionar ao Cesto';
    botaoCesto.dataset.produtoId = produto.id;

    botaoCesto.addEventListener('click', () => {
        const id = produto.id;
        const produtoParaAdicionar = produtos.find(p => p.id === id); 
        if (produtoParaAdicionar) {
            adicionarAoCesto(produtoParaAdicionar); 
        }
    });

    // Ordem de Inserção: Título -> Imagem -> Preço -> Botão
    articleProduto.appendChild(titulo);
    articleProduto.appendChild(figura); // <--- A figura com a imagem é inserida aqui
    articleProduto.appendChild(precoDisplay);
    articleProduto.appendChild(botaoCesto);
    
    return articleProduto;
}

/**
 * Itera sobre a lista de produtos e os insere na secção #produtos no DOM.
 */
function carregarProdutos(produtos) {
    const containerProdutos = document.getElementById('produtos');
    
    if (!containerProdutos) return;
    if (typeof produtos === 'undefined' || !Array.isArray(produtos) || produtos.length === 0) {
        console.warn("Nenhum produto encontrado. Verifique 'produtos.js'.");
        containerProdutos.innerHTML = '<h2>Produtos da LOLja</h2><p>Nenhum produto disponível.</p>';
        return;
    }

    containerProdutos.innerHTML = '<h2>Produtos da LOLja</h2>'; 
    
    produtos.forEach(produto => {
        const elementoProduto = criarProduto(produto);
        containerProdutos.appendChild(elementoProduto);
    });
    console.log(`[Loja] ${produtos.length} produtos carregados.`);
}


// =================================================================
// RENDERIZAÇÃO DO CESTO
// =================================================================

/**
 * Cria o elemento <article> para um produto DENTRO DO CESTO, incluindo o botão de remoção.
 */
function criaProdutoCesto(produto) {
    const articleCestoItem = document.createElement('article');
    articleCestoItem.classList.add('cesto-item');
    articleCestoItem.dataset.produtoId = produto.id; 

    const titulo = document.createElement('h4');
    titulo.textContent = produto.title;

    const precoUnitario = document.createElement('p');
    precoUnitario.textContent = `${produto.preco.toFixed(2)} €`;
    
    const botaoRemover = document.createElement('button');
    botaoRemover.textContent = 'Remover (1)';
    botaoRemover.classList.add('btn-remover');
    botaoRemover.dataset.produtoId = produto.id; 
    
    botaoRemover.addEventListener('click', (evento) => {
        const id = parseInt(evento.currentTarget.dataset.produtoId);
        removerDoCesto(id);
    });

    articleCestoItem.appendChild(titulo);
    articleCestoItem.appendChild(precoUnitario);
    articleCestoItem.appendChild(botaoRemover);

    return articleCestoItem;
}

/**
 * Função principal para buscar a lista do Local Storage e atualizar a secção #cesto no DOM.
 */
function atualizaCesto() {
    const cesto = obterCesto(); 
    const containerCesto = document.getElementById('cesto');

    if (!containerCesto) return;
    
    containerCesto.innerHTML = '<h2>O Seu Cesto de Compras</h2>'; 
    
    let precoTotal = 0;

    if (cesto.length === 0) {
        containerCesto.innerHTML += '<p>O seu cesto está vazio.</p>';
        return;
    }

    cesto.forEach((produto) => {
        const cestoItemElement = criaProdutoCesto(produto);
        containerCesto.appendChild(cestoItemElement);
        
        precoTotal += produto.preco;
    });

    const totalDisplay = document.createElement('p');
    totalDisplay.classList.add('cesto-total');
    totalDisplay.innerHTML = `<strong>Total:</strong> ${precoTotal.toFixed(2)} € (${cesto.length} itens)`;
    
    containerCesto.appendChild(totalDisplay);
}


// =================================================================
// INICIALIZAÇÃO DA APP
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Local Storage
    inicializarCesto(); 

    // 2. Carrega os produtos da loja
    if (typeof produtos !== 'undefined') {
        carregarProdutos(produtos);
    } else {
        console.error("FATAL ERROR: Variável 'produtos' não encontrada. Verifique a ordem dos scripts no HTML.");
    }

    // 3. Carrega o estado inicial do cesto
    atualizaCesto(); 
});