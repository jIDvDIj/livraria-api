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