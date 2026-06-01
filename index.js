const express = require('express');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const setupDb = require('./database');

const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Muitas requisições, tente novamente mais tarde.' },
    skip: () => process.env.NODE_ENV === 'test'
});
app.use('/api', limiter);

const livroSchema = z.object({
    titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
    autor: z.string().min(3, 'O nome do autor deve ter pelo menos 3 caracteres'),
    ano: z.number().int().min(1000).max(new Date().getFullYear()).optional()
});

let db;

const dbPromise = setupDb().then(database => {
    db = database;
    if (process.env.NODE_ENV !== 'test') {
        app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
    }
    return database;
});

app.use(async (req, res, next) => {
    if (!db) await dbPromise;
    next();
});

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Livraria REST',
            version: '1.0.0',
        },
    },
    apis: ['./index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @openapi
 * /api/livros:
 *   get:
 *     summary: Retorna todos os livros ou filtra por título/autor
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Parte do título do livro
 *       - in: query
 *         name: autor
 *         schema:
 *           type: string
 *         description: Parte do nome do autor
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página (padrão 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Itens por página (padrão 10)
 *     responses:
 *       '200':
 *         description: Lista de livros filtrada ou completa com paginação.
 */
app.get('/api/livros', async (req, res) => {
    try {
        const { titulo, autor } = req.query;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        const offset = (page - 1) * limit;

        let whereClause = '';
        let params = [];

        if (titulo || autor) {
            whereClause += ' WHERE';
            if (titulo) {
                whereClause += ' titulo LIKE ?';
                params.push(`%${titulo}%`);
            }
            if (titulo && autor) whereClause += ' AND';
            if (autor) {
                whereClause += ' autor LIKE ?';
                params.push(`%${autor}%`);
            }
        }

        const total = await db.get(`SELECT COUNT(*) as count FROM livros${whereClause}`, params);
        const livros = await db.all(`SELECT * FROM livros${whereClause} LIMIT ? OFFSET ?`, [...params, limit, offset]);

        res.json({
            data: livros,
            pagination: {
                total: total.count,
                page,
                limit,
                totalPages: Math.ceil(total.count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

/**
 * @openapi
 * /api/livros/{id}:
 *   get:
 *     summary: Retorna um livro pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Livro encontrado.
 *       '404':
 *         description: Livro não encontrado.
 */
app.get('/api/livros/:id', async (req, res) => {
    try {
        const livro = await db.get('SELECT * FROM livros WHERE id = ?', [req.params.id]);
        if (!livro) return res.status(404).json({ message: 'Livro não encontrado' });
        res.json(livro);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.post('/api/livros', async (req, res) => {
    try {
        const dadosValidados = livroSchema.parse(req.body);
        const result = await db.run('INSERT INTO livros (titulo, autor, ano) VALUES (?, ?, ?)', [dadosValidados.titulo, dadosValidados.autor, dadosValidados.ano ?? null]);
        res.status(201).json({ id: result.lastID, ...dadosValidados });
    } catch (error) {
        res.status(400).json({ status: 'Erro de Validação', detalhes: error.errors });
    }
});

app.put('/api/livros/:id', async (req, res) => {
    try {
        const partialSchema = livroSchema.partial();
        const dadosValidados = partialSchema.parse(req.body);
        const livroExistente = await db.get('SELECT * FROM livros WHERE id = ?', [req.params.id]);
        if (!livroExistente) return res.status(404).json({ message: 'Livro não encontrado' });
        
        const novoTitulo = dadosValidados.titulo || livroExistente.titulo;
        const novoAutor = dadosValidados.autor || livroExistente.autor;
        const novoAno = dadosValidados.ano !== undefined ? dadosValidados.ano : livroExistente.ano;

        await db.run('UPDATE livros SET titulo = ?, autor = ?, ano = ? WHERE id = ?', [novoTitulo, novoAutor, novoAno, req.params.id]);
        res.json({ id: req.params.id, titulo: novoTitulo, autor: novoAutor, ano: novoAno });
    } catch (error) {
        res.status(400).json({ status: 'Erro de Validação', detalhes: error.errors });
    }
});

app.delete('/api/livros/:id', async (req, res) => {
    try {
        const livro = await db.get('SELECT * FROM livros WHERE id = ?', [req.params.id]);
        if (!livro) return res.status(404).json({ message: 'Livro não encontrado' });
        await db.run('DELETE FROM livros WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = app;