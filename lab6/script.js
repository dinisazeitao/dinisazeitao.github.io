
const nodeInputNumero = document.querySelector("#colecao form input[type='number']");
const nodeInputSubmit = document.querySelector("#colecao form input[type='submit']");
const nodeUlColecao = document.querySelector("#colecao ul");
const nodeTotalColecao = document.querySelector("#total-colecao");


const nodeUlRepetidos = document.querySelector("#lista-repetidos");
const nodeTotalRepetidos = document.querySelector("#total-repetidos");


const colecao = JSON.parse(localStorage.getItem("colecao")) || [];
const repetidos = JSON.parse(localStorage.getItem("repetidos")) || [];

const salvarESincronizar = () => {
    localStorage.setItem("colecao", JSON.stringify(colecao));
    localStorage.setItem("repetidos", JSON.stringify(repetidos));
};



const guardaCarta = () => {
    const numero = Number(nodeInputNumero.value);

    if (!nodeInputNumero.value) return;

    if (colecao.includes(numero)) {

        repetidos.push(numero);
        repetidos.sort((a, b) => a - b);
        atualizaLista(repetidos, nodeUlRepetidos);
        nodeTotalRepetidos.textContent = repetidos.length;
    } else {

        colecao.push(numero);
        colecao.sort((a, b) => a - b);
        atualizaLista(colecao, nodeUlColecao);
        nodeTotalColecao.textContent = colecao.length;
    }


    salvarESincronizar();

    nodeInputNumero.value = "";
    nodeInputNumero.focus();
};

const atualizaLista = (lista, elementoUl) => {

    elementoUl.innerHTML = "";

    lista.forEach((numero, index) => {
        const li = document.createElement("li");

        if (elementoUl === nodeUlRepetidos) {
            li.innerHTML = `Cromo nº ${numero} <button class="btn-eliminar" data-index="${index}">Eliminar</button>`;
        } else {
            li.textContent = `Cromo nº ${numero}`;
        }

        elementoUl.appendChild(li);
    });


    if (elementoUl === nodeUlRepetidos) {
        const botoesEliminar = elementoUl.querySelectorAll(".btn-eliminar");

        botoesEliminar.forEach(botao => {
            botao.onclick = (event) => {
                const indiceParaRemover = Number(event.target.getAttribute("data-index"));


                repetidos.splice(indiceParaRemover, 1);


                atualizaLista(repetidos, nodeUlRepetidos);
                nodeTotalRepetidos.textContent = repetidos.length;
                salvarESincronizar();
            };
        });
    }
};



const form = document.querySelector("form");

form.onsubmit = (event) => {
    event.preventDefault();
    guardaCarta();
};



document.addEventListener("DOMContentLoaded", () => {
    atualizaLista(colecao, nodeUlColecao);
    nodeTotalColecao.textContent = colecao.length;

    atualizaLista(repetidos, nodeUlRepetidos);
    nodeTotalRepetidos.textContent = repetidos.length;
});
