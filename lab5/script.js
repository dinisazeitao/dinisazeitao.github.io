

// 1. Texto que muda ao passar o rato
const textoHover = document.getElementById("textoHover");

// 2. Pintar o texto
const textoCor = document.getElementById("textoCor");
const botoesCor = document.querySelectorAll("button.color");

// 3. Caixa que muda de cor
const caixaColorida = document.getElementById("caixaColorida");
const cores = ["red", "green", "blue", "orange", "purple", "brown"];
let indice = 0;

// 5. Contador Manual (COM LOCAL STORAGE)
const botaoContador = document.getElementById("botaoContador");
const contadorDisplay = document.getElementById("contador");

// Inicialização Manual: Se não existe 'counter' em localStorage, criamos a chave com o valor 0.
if (!localStorage.getItem('counter')) {
    localStorage.setItem('counter', 0);
}
// Atualizar o display do contador manual com o valor guardado ao carregar a página
contadorDisplay.innerText = localStorage.getItem('counter');


// 6. Formulário Nome e Idade
const nomeInput = document.getElementById("nomeInput");
const idadeInput = document.getElementById("idadeInput");
const resultadoFormulario = document.getElementById("resultadoFormulario");


// 7. Contador Automático (COM LOCAL STORAGE)
const autoContadorDisplay = document.getElementById("autoContadorDisplay");

// Inicialização Automática: Se não existe 'autoCounter' em localStorage, criamos a chave com o valor 0.
if (!localStorage.getItem('autoCounter')) {
    localStorage.setItem('autoCounter', 0);
}
// Atualizar o display do contador automático com o valor guardado ao carregar a página
autoContadorDisplay.innerText = localStorage.getItem('autoCounter');


// 1. Texto que muda ao passar o rato
const mudarTexto = () => {
    textoHover.innerText = "Obrigado por passares!";
}
const restaurarTexto = () => {
    textoHover.innerText = "Passa por aqui!";
}

// 3. Mudar cor da caixa a cada letra
const mudarCorCaixa = () => {
    caixaColorida.style.backgroundColor = cores[indice];
    indice = (indice + 1) % cores.length;
}

// 4. Mudar cor de fundo da página (Implementação com SELECT e THIS)
const mudarCorPaginaSelect = (selectElement) => {
    const cor = selectElement.value;
    document.body.style.backgroundColor = cor;
}

// 5. Contador Manual (COM LOCAL STORAGE)
const contarComLocalStorage = () => {
    // Obter o valor atual
    let contador = parseInt(localStorage.getItem('counter')); 
    
    // Incrementar
    contador++;
    
    // Atualizar HTML e localStorage
    contadorDisplay.innerText = contador;
    localStorage.setItem('counter', contador);
};


// 6. Formulário Nome e Idade
const submeterFormulario = (e) => {
    e.preventDefault(); 
    const nome = nomeInput.value;
    const idade = idadeInput.value;
    const mensagem = `Olá, o ${nome} tem ${idade}!`;
    resultadoFormulario.innerText = mensagem;
}

// 7. Contador Automático 
const contarAutomaticamente = () => {
    // Obter o valor atual
    let contador = parseInt(localStorage.getItem('autoCounter')); 
    
    // Incrementar
    contador++;
    
    // Atualizar HTML e localStorage
    autoContadorDisplay.innerText = contador;
    localStorage.setItem('autoCounter', contador);
};




// 1. Texto que muda ao passar o rato
textoHover.addEventListener("mouseover", mudarTexto);
textoHover.addEventListener("mouseout", restaurarTexto);

// 2. Pintar o texto
botoesCor.forEach((botao) => {
    botao.addEventListener("click", () => {
        const cor = botao.dataset.color;
        textoCor.style.color = cor;
    });
});

// 3. Mudar cor da caixa a cada letra
caixaColorida.addEventListener("input", mudarCorCaixa);

// 5. Contador Manual
botaoContador.addEventListener("click", contarComLocalStorage);


// Inicia a função de contagem a ser chamada a cada 1000ms (1 segundo)
setInterval(contarAutomaticamente, 1000); 
