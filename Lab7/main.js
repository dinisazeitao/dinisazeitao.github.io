// main.js - CÓDIGO FINAL E COMPLETO
// Com gestão de Local Storage, Carregamento via API (fetch), Pesquisa, Filtro, Ordenação e Compra.

const LOCAL_STORAGE_KEY = 'produtos-selecionados';
// Base da API corrigida (sem o # no final, que é para navegação)
const API_BASE_URL = 'https://deisishop.pythonanywhere.com'; 
const API_URL_PRODUTOS = `${API_BASE_URL}/produtos`;
const API_URL_CATEGORIAS = `${API_BASE_URL}/categorias`;
const API_URL_COMPRA = `${API_BASE_URL}/buy`; 

// Armazena todos os produtos obtidos via API
let todosProdutos = []; 

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
    atualizaCesto(); 
}

function adicionarAoCesto(produto) {
    let cesto = obterCesto();
    // Verifica se o produto já existe no cesto se for preciso acumular,
    // mas aqui apenas adiciona o objeto.
    cesto.push(produto); 
    guardarCesto(cesto);
    console.log(`[Cesto] Adicionado: ${produto.title}. Total: ${cesto.length}`);
}

function removerDoCesto(produtoId) {
    let cesto = obterCesto();
    // Remove APENAS A PRIMEIRA OCORRÊNCIA do produto com o ID especificado
    const indexParaRemover = cesto.findIndex(p => p.id === produtoId);
    
    if (indexParaRemover > -1) {
        cesto.splice(indexParaRemover, 1); 
        guardarCesto(cesto);
        console.log(`[Cesto] Item com ID ${produtoId} removido.`);
    }
}

// =================================================================
// RENDERIZAÇÃO DE PRODUTOS DA LOJA
// =================================================================

/**
 * Cria e configura um elemento <article> HTML para um único produto (CARD DA LOJA).
 */
function criarProduto(produto) {
    const articleProduto = document.createElement('article');
    articleProduto.classList.add('produto-card');
    articleProduto.dataset.id = produto.id;

    const titulo = document.createElement('h3'); 
    titulo.textContent = produto.title;

    const figura = document.createElement('figure');
    const imagem = document.createElement('img');
    imagem.src = produto.image || 'img/placeholder.jpg'; 
    imagem.alt = `Imagem de ${produto.title}`;
    imagem.classList.add('produto-imagem');
    figura.appendChild(imagem);
    
    const precoDisplay = document.createElement('p');
    const preco = parseFloat(produto.preco); 
    if(!isNaN(preco)) { 
        precoDisplay.innerHTML = `Preço: <strong>${preco.toFixed(2)} €</strong>`; 
    } else {
        precoDisplay.innerHTML = `Preço: <strong>N/D</strong>`; 
    }
    
    const botaoCesto = document.createElement('button');
    botaoCesto.textContent = '+ Adicionar ao Cesto';
    botaoCesto.dataset.produtoId = produto.id;

    botaoCesto.addEventListener('click', () => {
        const id = produto.id;
        // Encontra o objeto completo para adicionar ao cesto
        const produtoParaAdicionar = todosProdutos.find(p => p.id === id); 
        if (produtoParaAdicionar) {
            adicionarAoCesto(produtoParaAdicionar); 
        }
    });

    articleProduto.appendChild(titulo);
    articleProduto.appendChild(figura); 
    articleProduto.appendChild(precoDisplay);
    articleProduto.appendChild(botaoCesto);
    
    return articleProduto;
}

/**
 * Itera sobre a lista de produtos (filtrada/ordenada) e os insere no DOM.
 * Garante que os cards da loja são criados e inseridos no wrapper correto.
 */
function carregarProdutos(listaProdutos) {
    const containerProdutos = document.getElementById('produtos');
    if (!containerProdutos) return;
    
    let produtosWrapper = containerProdutos.querySelector('.produtos-wrapper');
    if (!produtosWrapper) {
        produtosWrapper = document.createElement('div');
        produtosWrapper.classList.add('produtos-wrapper');
        containerProdutos.appendChild(produtosWrapper);
    }
    
    produtosWrapper.innerHTML = ''; 
    
    if (!Array.isArray(listaProdutos) || listaProdutos.length === 0) {
        produtosWrapper.innerHTML = '<p>Nenhum produto encontrado com os filtros selecionados.</p>';
        return;
    }

    listaProdutos.forEach(produto => {
        const elementoProduto = criarProduto(produto);
        produtosWrapper.appendChild(elementoProduto);
    });
    console.log(`[Loja] ${listaProdutos.length} produtos carregados/filtrados/ordenados.`);
}


// =================================================================
// RENDERIZAÇÃO E LÓGICA DO CESTO E COMPRA
// =================================================================

/**
 * Cria o elemento <article> para um produto DENTRO DO CESTO.
 */
function criaProdutoCesto(produto) {
    const articleCestoItem = document.createElement('article');
    articleCestoItem.classList.add('cesto-item');
    articleCestoItem.dataset.produtoId = produto.id; 

    const titulo = document.createElement('h4');
    titulo.textContent = produto.title;

    const precoUnitario = document.createElement('p');
    const preco = parseFloat(produto.preco);
    precoUnitario.textContent = `${!isNaN(preco) ? preco.toFixed(2) : 'N/D'} €`;
    
    const botaoRemover = document.createElement('button');
    botaoRemover.textContent = 'Remover (1)';
    botaoRemover.classList.add('btn-remover');
    
    // Liga o botão à função de remoção
    botaoRemover.addEventListener('click', () => removerDoCesto(produto.id));

    articleCestoItem.appendChild(titulo);
    articleCestoItem.appendChild(precoUnitario);
    articleCestoItem.appendChild(botaoRemover);

    return articleCestoItem;
}

/**
 * Cria os elementos HTML para o formulário de checkout.
 */
function criaCheckoutForm() {
    const formDiv = document.createElement('div');
    formDiv.classList.add('cesto-checkout');
    formDiv.innerHTML = `
        <h3>Opções de Desconto</h3>
        <label>
            <input type="checkbox" id="is-student"> Sou Estudante (Desconto Aplicável)
        </label>
        <div style="margin: 10px 0;">
            <label for="coupon-code">Cupão de Desconto:</label>
            <input type="text" id="coupon-code" placeholder="Insira o código do cupão">
        </div>
        <button id="btn-comprar" class="btn-comprar">FINALIZAR COMPRA</button>
        <div id="compra-mensagem" class="compra-mensagem" style="margin-top: 15px; padding: 10px; border: 1px solid #ccc; background-color: #f9f9f9;">
        </div>
    `;

    const btnComprar = formDiv.querySelector('#btn-comprar');
    btnComprar.addEventListener('click', finalizarCompra);
    
    return formDiv;
}

/**
 * Envia o pedido POST para o endpoint /buy e processa a resposta.
 */
async function finalizarCompra() {
    const cesto = obterCesto();
    const isStudent = document.getElementById('is-student').checked;
    const couponCode = document.getElementById('coupon-code').value.trim();
    const mensagemDiv = document.getElementById('compra-mensagem');
    
    mensagemDiv.innerHTML = '<p>A processar a compra...</p>';
    
    if (cesto.length === 0) {
        mensagemDiv.innerHTML = '<p style="color: red;">O seu cesto está vazio. Adicione produtos antes de comprar.</p>';
        return;
    }

    const purchaseData = {
        student: isStudent,
        coupon: couponCode || null, 
        items: cesto.map(p => ({
            id: p.id,
            preco: parseFloat(p.preco) 
        })) 
    };

    try {
        const response = await fetch(API_URL_COMPRA, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(purchaseData),
        });

        const result = await response.json();

        if (response.ok) {
            // SUCESSO
            const totalFormatado = parseFloat(result.total_final).toFixed(2);
            
            mensagemDiv.innerHTML = `
                <p style="color: green; font-weight: bold;">✅ Compra Processada com Sucesso!</p>
                <p><strong>Referência de Pagamento:</strong> ${result.reference}</p>
                <p><strong>Total Final a Pagar:</strong> <strong style="color: darkgreen;">${totalFormatado} €</strong></p>
            `;
            // Limpa o cesto e atualiza a interface
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
            atualizaCesto(); 

        } else {
            // ERRO
            const errorMessage = result.message || 'Erro desconhecido ao processar a compra.';
            const errorCode = result.error ? ` [${result.error}]` : '';

            mensagemDiv.innerHTML = `
                <p style="color: red; font-weight: bold;">❌ Erro na Compra${errorCode}</p>
                <p>${errorMessage}</p>
            `;
        }

    } catch (error) {
        console.error("Erro de rede ou API:", error);
        mensagemDiv.innerHTML = '<p style="color: red;">❌ Erro de conexão com o servidor. Verifique a sua ligação e tente novamente.</p>';
    }
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
        // CORRETO: Usa a função para criar o ITEM do cesto.
        const cestoItemElement = criaProdutoCesto(produto);
        containerCesto.appendChild(cestoItemElement);
        
        const preco = parseFloat(produto.preco);
        if (!isNaN(preco)) {
            precoTotal += preco;
        }
    });

    const totalDisplay = document.createElement('p');
    totalDisplay.classList.add('cesto-total');
    totalDisplay.innerHTML = `<strong>Subtotal:</strong> ${precoTotal.toFixed(2)} € (${cesto.length} itens)`;
    
    containerCesto.appendChild(totalDisplay);
    
    // Adiciona o formulário de checkout
    containerCesto.appendChild(criaCheckoutForm());
}


// =================================================================
// LÓGICA DE FILTRO, ORDENAÇÃO E PESQUISA
// =================================================================

/**
 * Aplica sequencialmente a Pesquisa, o Filtro de Categoria e a Ordenação por Preço.
 */
function aplicarFiltroEOrdenacao() {
    // Começa com uma cópia limpa do array principal
    let produtosAtuais = [...todosProdutos]; 
    
    // 1. PESQUISA POR NOME
    const inputPesquisa = document.getElementById('pesquisa-nome');
    const termoPesquisa = inputPesquisa ? inputPesquisa.value.toLowerCase().trim() : '';

    if (termoPesquisa) {
        produtosAtuais = produtosAtuais.filter(produto => 
            produto.title.toLowerCase().includes(termoPesquisa)
        );
    }

    // 2. FILTRAGEM POR CATEGORIA
    const selectFiltro = document.getElementById('filtro-categoria');
    const categoriaSelecionada = selectFiltro ? selectFiltro.value : 'todos';
    
    if (categoriaSelecionada !== 'todos') {
        produtosAtuais = produtosAtuais.filter(produto => 
            produto.category && produto.category.toLowerCase() === categoriaSelecionada.toLowerCase()
        );
    }
    
    // 3. ORDENAÇÃO POR PREÇO
    const selectOrdem = document.getElementById('ordenar-produtos');
    const ordemSelecionada = selectOrdem ? selectOrdem.value : 'nenhum';

    if (ordemSelecionada !== 'nenhum') {
        produtosAtuais = ordenarProdutos(produtosAtuais, ordemSelecionada);
    }

    // 4. RENDERIZAÇÃO
    carregarProdutos(produtosAtuais);
}

/**
 * Ordena a lista de produtos por preço.
 */
function ordenarProdutos(lista, ordem) {
    return lista.slice().sort((a, b) => {
        const precoA = parseFloat(a.preco) || 0;
        const precoB = parseFloat(b.preco) || 0;

        if (ordem === 'asc') {
            return precoA - precoB; 
        } else if (ordem === 'desc') {
            return precoB - precoA; 
        }
        return 0;
    });
}


// =================================================================
// OBTENÇÃO DE DADOS DA API E LISTENERS
// =================================================================

/**
 * Obtém a lista de produtos da API. Ponto crucial para carregar os produtos.
 */
async function obterProdutosDaAPI() {
    console.log('[API] A tentar obter produtos...');
    const containerProdutos = document.getElementById('produtos');
    const filtroContainer = document.getElementById('filtro-container');
    
    // Mensagem de carregamento visual
    if (filtroContainer) {
        filtroContainer.insertAdjacentHTML('afterend', '<p id="loading-msg">A carregar produtos...</p>');
    } else if (containerProdutos) {
        containerProdutos.innerHTML = '<h2>Produtos da LOLja</h2><p id="loading-msg">A carregar produtos...</p>';
    }

    try {
        const response = await fetch(API_URL_PRODUTOS);
        
        if (!response.ok) {
            throw new Error(`Erro de HTTP! Status: ${response.status}`);
        }

        todosProdutos = await response.json(); 
        
        // Remove a mensagem de carregamento
        const loadingMsg = document.getElementById('loading-msg');
        if (loadingMsg) loadingMsg.remove();
        
        // Carrega (e exibe) a lista inicial
        carregarProdutos(todosProdutos); 

    } catch (error) {
        console.error("Erro ao carregar produtos da API:", error);
        
        const loadingMsg = document.getElementById('loading-msg');
        if (loadingMsg) loadingMsg.remove();

        const msg = '<p style="color: red;">Ocorreu um erro ao carregar os produtos da loja. Verifique a sua ligação e o URL da API.</p>';
        if (filtroContainer) {
            filtroContainer.insertAdjacentHTML('afterend', msg);
        } else if (containerProdutos) {
            containerProdutos.innerHTML += msg;
        }
    }
}


function popularFiltroCategorias(categorias) {
    const selectFiltro = document.getElementById('filtro-categoria');
    if (!selectFiltro) return;

    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectFiltro.appendChild(option);
    });
    
    selectFiltro.addEventListener('change', aplicarFiltroEOrdenacao);
}

async function obterCategoriasDaAPI() {
    try {
        const response = await fetch(API_URL_CATEGORIAS);
        if (response.ok) {
            const categorias = await response.json(); 
            popularFiltroCategorias(categorias); 
        }
    } catch (error) {
        console.error("Erro ao carregar categorias da API:", error);
    }
}

function configurarPesquisaListener() {
    const inputPesquisa = document.getElementById('pesquisa-nome');
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', aplicarFiltroEOrdenacao);
    }
}

function configurarOrdenacaoListener() {
    const selectOrdem = document.getElementById('ordenar-produtos');
    if (selectOrdem) {
        selectOrdem.addEventListener('change', aplicarFiltroEOrdenacao);
    }
}


// =================================================================
// INICIALIZAÇÃO DA APP
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Local Storage
    inicializarCesto(); 

    // 2. Configura os listeners de filtros/pesquisa/ordenação
    configurarPesquisaListener(); 
    configurarOrdenacaoListener();

    // 3. Carrega as categorias (assíncrono)
    obterCategoriasDaAPI(); 

    // 4. Carrega os produtos (assíncrono - Inicia o ciclo de renderização)
    obterProdutosDaAPI();

    // 5. Carrega o estado inicial do cesto
    atualizaCesto(); 
});