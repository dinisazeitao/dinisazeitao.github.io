// Seleção de elementos
const img = document.getElementById("misterio");
const botaoClick = document.getElementById("botaoClick");
const botaoDblClick = document.getElementById("botaoDblClick");
const botaoContador = document.getElementById("botaoContador");
const contadorSpan = document.getElementById("contador");
const mensagem = document.getElementById("mensagem");

let contador = 0;

// Evento: click
botaoClick.onclick = () => {
    mensagem.textContent = "Foste rápido! Um clique certeiro!";
    mensagem.style.color = "#d32f2f";
};

// Evento: duplo clique
botaoDblClick.ondblclick = () => {
    mensagem.textContent = "WOW! Um duplo clique de mestre!";
    mensagem.style.color = "#1976d2";
};

// Evento: contador (click)
botaoContador.addEventListener("click", () => {
    contador++;
    contadorSpan.textContent = contador;
    mensagem.textContent = `Já clicaste ${contador} vez(es) no contador!`;
    mensagem.style.color = "#388e3c";
});

// Evento: mouseover
img.addEventListener("mouseover", () => {
    mensagem.textContent = "A imagem está viva! 👀";
    img.style.transform = "scale(1.1)";
});

// Evento: mouseout
img.addEventListener("mouseout", () => {
    mensagem.textContent = "A imagem voltou ao normal.";
    img.style.transform = "scale(1)";
});

// Evento: mousemove
img.addEventListener("mousemove", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    mensagem.textContent = `O rato está em (${x}, ${y}) sobre a imagem!`;
});
