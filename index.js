const express = require('express');
const { z } = require('zod'); // Importando o Zod
const setupDb = require('./database');
const app = express();
const PORT = 8080;

app.use(express.json());

// Esquema de validação (Schema)
const livroSchema = z.object({
    titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
    autor: z.string().min(3, "O nome do autor deve ter pelo menos 3 caracteres")
});

let db;

(async () => {
    db = await setupDb();

    // Rota POST com Validação
    app.post('/api/livros', async (req, res) => {
        try {
            // Valida os dados antes de inserir
            const dadosValidados = livroSchema.parse(req.body);
            
            const result = await db.run(
                'INSERT INTO livros (titulo, autor) VALUES (?, ?)', 
                [dadosValidados.titulo, dadosValidados.autor]
            );
            res.status(201).json({ id: result.lastID, ...dadosValidados });
        } catch (error) {
            // Se a validação falhar, retorna o erro amigável
            res.status(400).json({ status: "Erro de Validação", detalhes: error.errors });
        }
    });

    // Rota PUT com Validação (Opcional nos campos)
    app.put('/api/livros/:id', async (req, res) => {
        try {
            const partialSchema = livroSchema.partial(); // Permite atualizar apenas um campo
            const dadosValidados = partialSchema.parse(req.body);

            const livroExistente = await db.get('SELECT * FROM livros WHERE id = ?', [req.params.id]);
            if (!livroExistente) return res.status(404).json({ message: "Livro não encontrado" });

            const novoTitulo = dadosValidados.titulo || livroExistente.titulo;
            const novoAutor = dadosValidados.autor || livroExistente.autor;

            await db.run('UPDATE livros SET titulo = ?, autor = ? WHERE id = ?', [novoTitulo, novoAutor, req.params.id]);
            res.json({ id: req.params.id, titulo: novoTitulo, autor: novoAutor });
        } catch (error) {
            res.status(400).json({ status: "Erro de Validação", detalhes: error.errors });
        }
    });

    /**
 * @openapi
 * /api/livros:
 * get:
 * summary: Retorna todos os livros ou filtra por título/autor
 * parameters:
 * - in: query
 * name: titulo
 * schema:
 * type: string
 * description: Parte do título do livro
 * - in: query
 * name: autor
 * schema:
 * type: string
 * description: Parte do nome do autor
 * responses:
 * 200:
 * description: Lista de livros filtrada ou completa.
 */
app.get('/api/livros', async (req, res) => {
    const { titulo, autor } = req.query;
    let query = 'SELECT * FROM livros';
    let params = [];

    if (titulo || autor) {
        query += ' WHERE';
        if (titulo) {
            query += ' titulo LIKE ?';
            params.push(`%${titulo}%`);
        }
        if (titulo && autor) query += ' AND';
        if (autor) {
            query += ' autor LIKE ?';
            params.push(`%${autor}%`);
        }
    }

    const livros = await db.all(query, params);
    res.json(livros);
});

    app.delete('/api/livros/:id', async (req, res) => {
        await db.run('DELETE FROM livros WHERE id = ?', [req.params.id]);
        res.json({ message: "Livro removido!" });
    });

    app.listen(PORT, () => console.log(`Servidor validado em http://localhost:${PORT}`));
})();

module.exports = app;