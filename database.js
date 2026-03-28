const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setupDb() {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS livros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            autor TEXT
        )
    `);
    
    return db;
}

module.exports = setupDb;