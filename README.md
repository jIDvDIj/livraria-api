# API Livraria REST

Este projeto é um exemplo de API desenvolvida seguindo o fluxo Gitflow.

## Como Executar
1. Instale as dependências: `npm install`
2. Inicie a API: `node index.js`
3. A porta padrão é `8080`.

## Endpoints
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/api/livros` | Lista todos os livros cadastrados. |
| POST | `/api/livros` | Cadastra um novo livro. |

## Workflow: Gitflow
Utilizei o **Gitflow** por ser um modelo que separa claramente o código em desenvolvimento (`develop`), funcionalidades em teste (`feature`) e código estável pronto para produção (`main`). Isso evita conflitos e garante que a branch principal nunca receba código quebrado.