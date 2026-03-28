const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

let livros = [
    { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis" }
];

// Rota GET: Obter produtos
app.get('/api/livros', (req, res) => {
    res.status(200).json(livros);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Rota POST: Armazenar um produto
app.post('/api/livros', (req, res) => {
    const { titulo, autor } = req.body;
    const novoLivro = { id: livros.length + 1, titulo, autor };
    livros.push(novoLivro);
    res.status(201).json({ message: "Livro cadastrado!", livro: novoLivro });
});

// Rota DELETE: Remover um produto pelo ID
app.delete('/api/livros/:id', (req, res) => {
    const { id } = req.params;
    const index = livros.findIndex(l => l.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ message: "Livro não encontrado!" });
    }

    const livroRemovido = livros.splice(index, 1);
    res.status(200).json({ 
        message: "Livro removido com sucesso!", 
        livro: livroRemovido[0] 
    });
});

// Rota PUT: Atualizar um livro existente pelo ID
app.put('/api/livros/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, autor } = req.body;
    
    const livro = livros.find(l => l.id === parseInt(id));

    if (!livro) {
        return res.status(404).json({ message: "Livro não encontrado para atualização!" });
    }

    // Atualiza apenas os campos enviados
    if (titulo) livro.titulo = titulo;
    if (autor) livro.autor = autor;

    res.status(200).json({ message: "Livro atualizado com sucesso!", livro });
});