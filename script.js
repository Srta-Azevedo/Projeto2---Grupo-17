/* capturando elementos pelo seu id */
const modelo = document.getElementById('model');
const campo_pergunta = document.getElementById('userInput');
const campo_chave = document.getElementById('apiKey');
const campo_resposta = document.getElementById('responseBox');
const botao_pergunta = document.getElementById('askButton');
const botao_copiar = document.getElementById('copy_button');
const botao_tema = document.getElementById('botao_tema');
const botaoLimpar = document.querySelector(".botao-novo");
const formulario = document.querySelector("form");

/* pegando a chave salva */
const chave_salva = localStorage.getItem('chave');
if (chave_salva) {
    campo_chave.value = chave_salva;
}

/* carregando o tema salvo */
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

/* evento para perguntar */
botao_pergunta.addEventListener('click', async () => {
    const modelo_selecionado = modelo.value;
    const texto_chave = campo_chave.value;
    const texto_pergunta = campo_pergunta.value;

    if (texto_chave === '' || texto_pergunta === '') {
        alert("Por favor, preencha a chave da API e a pergunta!");
        return;
    }

    botao_pergunta.disabled = true;
    botao_pergunta.textContent = "Pensando...";
    campo_resposta.textContent = "";

    localStorage.setItem('chave', texto_chave);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo_selecionado}:generateContent?key=${texto_chave}`;

        const requestBody = {
            contents: [{
                parts: [{ text: texto_pergunta }]
            }]
        };

        const resposta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!resposta.ok) {
            const erroData = await resposta.json();
            throw new Error(erroData.error.message);
        }

        const dados = await resposta.json();
        campo_resposta.textContent = dados.candidates[0].content.parts[0].text;

    } catch (erro) {
        console.error("A requisição falhou!", erro);
        campo_resposta.textContent = "Desculpe, ocorreu um erro: " + erro.message;
    } finally {
        botao_pergunta.disabled = false;
        botao_pergunta.textContent = "Perguntar";
    }
});

/* evento para copiar */
botao_copiar.addEventListener('click', async () => {
    const texto_copiado = campo_resposta.textContent;

    if (!texto_copiado) {
        alert("Não há texto para copiar!");
        return;
    }

    try {
        await navigator.clipboard.writeText(texto_copiado);
        alert("Resposta copiada para a área de transferência!");
    } catch (err) {
        console.error("Falha ao copiar.", err);
        alert("Não foi possível copiar a resposta.");
    }
});

/* evento para limpar formulário */
if (botaoLimpar && formulario) {
    botaoLimpar.addEventListener("click", function () {
        formulario.reset();
        campo_resposta.textContent = ""; // limpa também a resposta
    });
}

/* evento para alterar o tema */
botao_tema.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});
