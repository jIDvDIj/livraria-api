**Por que Gitflow?** Escolhi este workflow pela necessidade de isolamento. Com ele, garantimos que a branch `main` nunca seja quebrada, pois toda funcionalidade passa por um ciclo de testes na `develop` antes do merge final.

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
| PUT | `/api/livros/:id` | Atualiza dados de um livro | `{"titulo": "Novo Nome"}` |

---

## Persistência de Dados
O projeto utiliza **SQLite** para armazenamento persistente, garantindo que os dados não sejam perdidos ao reiniciar o servidor.

## Conceitos de Microserviços
A aplicação foi refatorada seguindo a **Separação de Camadas**:
- `database.js`: Módulo isolado de infraestrutura de dados.
- `index.js`: Ponto de entrada e gerenciamento de rotas.
Essa estrutura facilita a escalabilidade, permitindo que o serviço de dados seja facilmente substituído ou isolado em um microserviço dedicado no futuro.

## Dependências Adicionais
- `sqlite3`: Driver do banco de dados.
- `sqlite`: Wrapper para suporte a Promises/Async-Await.

## Workflow de Trabalho: Gitflow

Este projeto utiliza o modelo **Gitflow** para garantir a integridade do código em produção:

* **`main`**: Apenas código estável e testado (Produção).
* **`develop`**: Branch principal para integração de novas funcionalidades.
* **`feature/*`**: Branches temporárias para o desenvolvimento de rotas específicas (ex: `feature/deletar-livro`).

## Ambiente de Teste e Semente
Para facilitar os testes, incluímos um script de semente que popula o banco de dados automaticamente.

### Como popular o banco:
Execute o comando abaixo no terminal:
```bash
npm run seed
```

## Camada de Validação
Implementamos o **Zod** para validação de esquemas. Isso garante que:
- O `titulo` e `autor` sejam obrigatórios em novos cadastros.
- Ambos os campos tenham no mínimo 3 caracteres.
- Payload mal formatado retorne um erro `400 Bad Request` detalhado, protegendo o banco de dados.

## 🐳 Executando com Docker

Se você tem o Docker instalado, não precisa configurar o Node.js manualmente.

1. **Construir e subir o container:**
   ```bash
   docker-compose up -d --build
   ```

---

## CI (GitHub Actions)

O projeto conta com pipelines de automação:
* **Integração Contínua (CI):** Roda a cada push na `develop` ou `main`, verificando se a aplicação instala e sobe corretamente.

---