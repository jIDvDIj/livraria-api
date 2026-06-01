const API_URL = '/api/livros';

const listaLivros = document.getElementById('lista-livros');
const btnCadastrar = document.getElementById('btn-cadastrar');
const inputTitulo = document.getElementById('titulo');
const inputAutor = document.getElementById('autor');

async function carregarLivros() {
    try {
        const res = await fetch(API_URL);
        const livros = await res.json();
        renderizarTabela(livros);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function renderizarTabela(livros) {
    listaLivros.innerHTML = livros.map(l => `
        <tr class="border-t animate-fade-in">
            <td class="p-4 text-gray-600">#${l.id}</td>
            <td class="p-4 font-medium text-gray-800">${l.titulo}</td>
            <td class="p-4 text-gray-700">${l.autor}</td>
            <td class="p-4 text-center">
                <button onclick="deletarLivro(${l.id})" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');
}

async function adicionarLivro() {
    const payload = {
        titulo: inputTitulo.value,
        autor: inputAutor.value
    };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        inputTitulo.value = '';
        inputAutor.value = '';
        carregarLivros();
    } else {
        const erro = await res.json();
        alert(`Erro: ${erro.detalhes?.[0]?.message || 'Verifique os dados'}`);
    }
}

// Exposta no window pois é chamada via onclick no HTML
window.deletarLivro = async function(id) {
    if (confirm('Tem certeza que deseja remover este livro?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        carregarLivros();
    }
};

btnCadastrar.addEventListener('click', adicionarLivro);
window.addEventListener('DOMContentLoaded', carregarLivros);