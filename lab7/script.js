
// A. Estado e Variáveis

let produtosSelecionados = JSON.parse(
    localStorage.getItem("produtos-selecionados")
) || [];

const containerProdutos = document.querySelector("#produtos");
const containerCesto = document.querySelector("#produtos-selecionados");
const elementoTotal = document.querySelector("#preco-total");


// B. Funções utilitárias

function guardarProdutosSelecionados() {
    localStorage.setItem(
        "produtos-selecionados",
        JSON.stringify(produtosSelecionados)
    );
}

function criarProduto(produto) {
    const article = document.createElement("article");

    const imagem = document.createElement("img");
    imagem.src = produto.image;
    imagem.alt = produto.title;

    const titulo = document.createElement("h2");
    titulo.textContent = produto.title;

    const descricao = document.createElement("p");
    descricao.textContent = produto.description;

    const preco = document.createElement("p");
    preco.textContent = `${produto.price} €`;

    const botaoCesto = document.createElement("button");
    botaoCesto.textContent = "+ Adicionar ao cesto";

    botaoCesto.addEventListener("click", () => {
        produtosSelecionados.push(produto);
        guardarProdutosSelecionados();
        atualizaCesto();
    });

    article.append(imagem, titulo, descricao, preco, botaoCesto);

    return article;
}

function criaProdutoCesto(produto, indice) {
    const article = document.createElement("article");

    const titulo = document.createElement("h2");
    titulo.textContent = produto.title;

    const preco = document.createElement("p");
    preco.textContent = `${produto.price} €`;

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";

    botaoRemover.addEventListener("click", () => {
        produtosSelecionados.splice(indice, 1);

        guardarProdutosSelecionados();
        atualizaCesto();
    });

    article.append(titulo, preco, botaoRemover);

    return article;
}

function atualizaCesto() {
    produtosSelecionados = JSON.parse(
        localStorage.getItem("produtos-selecionados")
    ) || [];

    containerCesto.innerHTML = "";

    produtosSelecionados.forEach((produto, indice) => {
        const article = criaProdutoCesto(produto, indice);
        containerCesto.append(article);
    });

    const total = produtosSelecionados.reduce(
        (soma, produto) => soma + produto.price,
        0
    );

    elementoTotal.textContent = `Total: ${total.toFixed(2)} €`;
}


// C. Event handlers

function renderizarProdutos(produtos) {
    containerProdutos.innerHTML = "";

    produtos.forEach((produto) => {
        const article = criarProduto(produto);
        containerProdutos.append(article);
    });
}


// D. Event Listeners


// E. Inicialização

renderizarProdutos(produtos);
atualizaCesto();
