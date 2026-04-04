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

    it('Deve atualizar um livro com sucesso (PUT /api/livros/:id)', async () => {
        const resCreate = await request(app).post('/api/livros').send({ titulo: "Livro Antigo", autor: "Autor Antigo" });
        const id = resCreate.body.id;

        const resUpdate = await request(app)
            .put(`/api/livros/${id}`)
            .send({ titulo: "Novo Titulo" });
        
        expect(resUpdate.statusCode).toEqual(200);
        expect(resUpdate.body.titulo).toBe("Novo Titulo");
        expect(resUpdate.body.autor).toBe("Autor Antigo");
    });

    it('Deve retornar 404 ao atualizar livro inexistente', async () => {
        const res = await request(app).put('/api/livros/9999').send({ titulo: "Qualquer" });
        expect(res.statusCode).toEqual(404);
    });
    
    it('Deve retornar erro de validação ao atualizar com dados inválidos', async () => {
        const resCreate = await request(app).post('/api/livros').send({ titulo: "Livro Valido", autor: "Autor Valido" });
        const id = resCreate.body.id;

        const resUpdate = await request(app).put(`/api/livros/${id}`).send({ titulo: "A" }); 
        expect(resUpdate.statusCode).toEqual(400);
    });

    it('Deve deletar um livro com sucesso (DELETE /api/livros/:id)', async () => {
        const resCreate = await request(app).post('/api/livros').send({ titulo: "Livro para deletar", autor: "Autor" });
        const id = resCreate.body.id;

        const resDelete = await request(app).delete(`/api/livros/${id}`);
        expect(resDelete.statusCode).toEqual(200);
        expect(resDelete.body.message).toBe("Livro removido!");
    });
});