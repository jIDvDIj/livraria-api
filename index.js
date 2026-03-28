const express = require('express');
const setupDb = require('./database');
const app = express();
const PORT = 8080;

app.use(express.json());

let db;

// Inicializa o banco e as rotas
(async () => {
    db = await setupDb();

    app.get('/api/livros', async (req, res) => {
        const livros = await db.all('SELECT * FROM livros');
        res.json(livros);
    });

    app.post('/api/livros', async (req, res) => {
        const { titulo, autor } = req.body;
        const result = await db.run('INSERT INTO livros (titulo, autor) VALUES (?, ?)', [titulo, autor]);
        res.status(201).json({ id: result.lastID, titulo, autor });
    });

    app.delete('/api/livros/:id', async (req, res) => {
        await db.run('DELETE FROM livros WHERE id = ?', [req.params.id]);
        res.json({ message: "Livro removido!" });
    });

    app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));
})();