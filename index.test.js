const request = require('supertest');
const app = require('./index');

describe('Testes da API de Livraria', () => {
    
    it('Deve listar todos os livros (GET /api/livros)', async () => {
        const res = await request(app).get('/api/livros');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('Deve criar um novo livro com sucesso (POST /api/livros)', async () => {
        const res = await request(app)
            .post('/api/livros')
            .send({
                titulo: "Código Limpo",
                autor: "Robert C. Martin"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    it('Deve barrar a criação de livro com título inválido (Zod Check)', async () => {
        const res = await request(app)
            .post('/api/livros')
            .send({
                titulo: "Oi",
                autor: "Autor Teste"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.status).toBe("Erro de Validação");
    });
});