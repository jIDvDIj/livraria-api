const setupDb = require('./database');

async function seed() {
    const db = await setupDb();

    await db.run('DELETE FROM livros');

    const livrosIniciais = [
        { titulo: "O Codificador Limpo", autor: "Robert C. Martin" },
        { titulo: "Arquitetura Limpa", autor: "Robert C. Martin" },
        { titulo: "Design Patterns", autor: "Erich Gamma" },
        { titulo: "Refatoração", autor: "Martin Fowler" },
        { titulo: "Expressões Regulares", autor: "Aurelio Marinho" }
    ];

    for (const livro of livrosIniciais) {
        await db.run('INSERT INTO livros (titulo, autor) VALUES (?, ?)', [livro.titulo, livro.autor]);
    }

    console.log(" Banco de dados de teste populado com sucesso!");
    process.exit();
}

seed();