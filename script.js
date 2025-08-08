/* capturando elementos pelo seu id */
const modelo = document.getElementById('model');
const campo_pergunta = document.getElementById('userInput');
const campo_chave = document.getElementById('apiKey');
const campo_resposta = document.getElementById('responseBox');
const botao_pergunta = document.getElementById('askButton');
const botao_copiar = document.getElementById('copyButton');
const botao_tema_site = document.getElementById('botao_tema');

/* pegando a chave salva */
const chave_salva = localStorage.getItem('chave');
if (chave_salva) {
    campo_chave.value = chave_salva;
}

/* carregando o tema salvo */
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

/* adicionado evento ao botão de perguntar */
botao_pergunta.addEventListener('click', async () => {
    const modelo_selecionado = modelo.value;
    const texto_chave = campo_chave.value;
    const texto_pergunta = campo_pergunta.value;

    /* verificando se os campos estão vazios */
    if (texto_chave === '' || texto_pergunta === '') {
        alert("Por favor, preencha a chave da API e a pergunta!");
        return;
    }

    botao_pergunta.disabled = true;
    botao_pergunta.textContent = "Pensando...";
    campo_resposta.textContent = "";

    /* salvando a chave no localStorage */
    localStorage.setItem('chave', texto_chave);

    /* chamando a API do Google Gemini */
    try {
        const apiKey = texto_chave;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo_selecionado}:generateContent?key=${apiKey}`;

        // O corpo da requisição do Gemini
        const requestBody = {
            contents: [{
                parts: [{
                    text: texto_pergunta
                }]
            }]
        };

        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!resposta.ok) {
            const erroData = await resposta.json();
            throw new Error(erroData.error.message);
        }

        const dados = await resposta.json();
        
        // O caminho para pegar a resposta no Gemini
        const texto_resposta = dados.candidates[0].content.parts[0].text;
        campo_resposta.textContent = texto_resposta;
        
    } catch (erro) {
        console.error("A requisição falhou!", erro);
        campo_resposta.textContent = "Desculpe, ocorreu um erro: " + erro.message;
    } finally {
        botao_pergunta.disabled = false;
        botao_pergunta.textContent = "Perguntar";
    }
});

/* adicionado evento ao botão de tema */
botao_tema_site.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // salva a escolha no localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
