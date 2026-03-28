#  API Livraria REST

Uma API robusta para gerenciamento de acervo de livros, desenvolvida com Node.js e Express, utilizando as melhores práticas de versionamento e automação.

---

##  Como Executar o Projeto

1. **Clone o repositório:**
   `git clone https://github.com/seu-usuario/livraria-api.git`
2. **Instale as dependências:**
   `npm install`
3. **Inicie o servidor:**
   `node index.js`
4. **Acesse em:** `http://localhost:8080/api/livros`

---

## Endpoints Disponíveis

| Método | Rota | Descrição | Exemplo de Payload (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/livros` | Lista todos os livros | N/A |
| **POST** | `/api/livros` | Cadastra um novo livro | `{"titulo": "O Alquimista", "autor": "Paulo Coelho"}` |
| **DELETE** | `/api/livros/:id` | Remove um livro pelo ID | N/A (Passar ID na URL) |

---

## Workflow de Trabalho: Gitflow

Este projeto utiliza o modelo **Gitflow** para garantir a integridade do código em produção:

* **`main`**: Apenas código estável e testado (Produção).
* **`develop`**: Branch principal para integração de novas funcionalidades.
* **`feature/*`**: Branches temporárias para o desenvolvimento de rotas específicas (ex: `feature/deletar-livro`).

**Por que Gitflow?** Escolhi este workflow pela necessidade de isolamento. Com ele, garantimos que a branch `main` nunca seja quebrada, pois toda funcionalidade passa por um ciclo de testes na `develop` antes do merge final.

---

## CI (GitHub Actions)

O projeto conta com pipelines de automação:
* **Integração Contínua (CI):** Roda a cada push na `develop` ou `main`, verificando se a aplicação instala e sobe corretamente.

---