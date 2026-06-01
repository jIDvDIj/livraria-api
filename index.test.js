const request = require('supertest');
const app = require('./index');

describe('Testes da API de Livraria', () => {
    
    it('Deve retornar um livro pelo ID (GET /api/livros/:id)', async () => {
        const resCreate = await request(app).post('/api/livros').send({ titulo: 'Livro ID Teste', autor: 'Autor Teste' });
        const id = resCreate.body.id;

        const res = await request(app).get(`/api/livros/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toBe(id);
        expect(res.body.titulo).toBe('Livro ID Teste');
    });

    it('Deve retornar 404 ao buscar livro inexistente por ID', async () => {
        const res = await request(app).get('/api/livros/99999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('Livro não encontrado');
    });

    it('Deve listar todos os livros com paginação (GET /api/livros)', async () => {
        const res = await request(app).get('/api/livros');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.pagination).toHaveProperty('total');
        expect(res.body.pagination).toHaveProperty('page');
        expect(res.body.pagination).toHaveProperty('limit');
        expect(res.body.pagination).toHaveProperty('totalPages');
    });

    it('Deve respeitar parâmetros de paginação (GET /api/livros?page=1&limit=2)', async () => {
        const res = await request(app).get('/api/livros?page=1&limit=2');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length).toBeLessThanOrEqual(2);
        expect(res.body.pagination.limit).toBe(2);
        expect(res.body.pagination.page).toBe(1);
    });

    it('Deve criar um novo livro com sucesso (POST /api/livros)', async () => {
        const res = await request(app)
            .post('/api/livros')
            .send({
                titulo: 'Código Limpo',
                autor: 'Robert C. Martin'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    it('Deve criar livro com campo ano (POST /api/livros)', async () => {
        const res = await request(app)
            .post('/api/livros')
            .send({ titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', ano: 1954 });
        expect(res.statusCode).toEqual(201);
        expect(res.body.ano).toBe(1954);
    });

    it('Deve rejeitar ano inválido (POST /api/livros)', async () => {
        const res = await request(app)
            .post('/api/livros')
            .send({ titulo: 'Livro Futuro', autor: 'Autor Teste', ano: 9999 });
        expect(res.statusCode).toEqual(400);
    });

    it('Deve barrar a criação de livro com título inválido (Zod Check)', async () => {
        const res = await request(app)
            .post('/api/livros')
            .send({
                titulo: 'Oi',
                autor: 'Autor Teste'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.status).toBe('Erro de Validação');
    });

    it('Deve atualizar um livro com sucesso (PUT /api/livros/:id)', async () => {
        const resCreate = await request(app).post('/api/livros').send({ titulo: 'Livro Antigo', autor: 'Autor Antigo' });
        const id = resCreate.body.id;

        const resUpdate = await request(app)
            .put(`/api/livros/${id}`)
            .send({ titulo: 'Novo Titulo' });
        
        expect(resUpdate.statusCode).toEqual(200);
        expect(resUpdate.body.titulo).toBe('Novo Titulo');
        expect(resUpdate.body.autor).toBe('Autor Antigo');
    });

    it('Deve retornar 404 ao atualizar livro inexistente', async () => {
        const res = await request(app).put('/api/livros/9999').send({ titulo: 'Qualquer' });
        expect(res.statusCode).toEqual(404);
    });
    
    it('Deve retornar erro de validação ao atualizar com dados inválidos', async () => {
        const resCreate = await request(app).post('/api/livros').send({ titulo: 'Livro Valido', autor: 'Autor Valido' });
        const id = resCreate.body.id;

        const resUpdate = await request(app).put(`/api/livros/${id}`).send({ titulo: 'A' }); 
        expect(resUpdate.statusCode).toEqual(400);
    });

    it('Deve deletar um livro com sucesso e retornar 204 (DELETE /api/livros/:id)', async () => {
        const resCreate = await request(app).post('/api/livros').send({ titulo: 'Livro para deletar', autor: 'Autor Teste' });
        const id = resCreate.body.id;

        const resDelete = await request(app).delete(`/api/livros/${id}`);
        expect(resDelete.statusCode).toEqual(204);
    });

    it('Deve retornar 404 ao deletar livro inexistente (DELETE /api/livros/:id)', async () => {
        const res = await request(app).delete('/api/livros/99999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('Livro não encontrado');
    });

    it('Deve filtrar livros por título (GET /api/livros?titulo=)', async () => {
        await request(app).post('/api/livros').send({ titulo: 'Dom Casmurro', autor: 'Machado de Assis' });
        const res = await request(app).get('/api/livros?titulo=Dom');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.some(l => l.titulo === 'Dom Casmurro')).toBe(true);
    });

    it('Deve filtrar livros por autor (GET /api/livros?autor=)', async () => {
        await request(app).post('/api/livros').send({ titulo: 'Memórias Póstumas', autor: 'Machado de Assis' });
        const res = await request(app).get('/api/livros?autor=Machado');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.some(l => l.autor === 'Machado de Assis')).toBe(true);
    });

    it('Deve filtrar livros por título e autor combinados (GET /api/livros?titulo=&autor=)', async () => {
        await request(app).post('/api/livros').send({ titulo: 'Quincas Borba', autor: 'Machado de Assis' });
        const res = await request(app).get('/api/livros?titulo=Quincas&autor=Machado');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.some(l => l.titulo === 'Quincas Borba')).toBe(true);
    });
});