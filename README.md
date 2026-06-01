# API Livraria REST

Uma API para gerenciamento de acervo de livros, desenvolvida com Node.js e Express, seguindo boas práticas de versionamento, qualidade de código e automação.

[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-jdvdj%2Flivraria--api-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/r/jdvdj/livraria-api)

---

## Como Executar

### Localmente

```bash
npm install       # Instala as dependências
npm start         # Inicia o servidor na porta 8080
npm run seed      # Popula o banco com dados de exemplo
npm test          # Executa os testes
npm run lint      # Verifica estilo de código
```

### Com Docker

```bash
docker compose up --build -d    # Sobe o container em background
docker compose down             # Desliga o container
```

Acesse em: http://localhost:8080

### Com Vagrant (VirtualBox)

#### Pré-requisitos

- [VirtualBox](https://www.virtualbox.org/) instalado
- [Vagrant](https://www.vagrantup.com/) instalado

> **Windows com WSL2:** O VirtualBox pode demorar mais para iniciar as VMs devido ao conflito com o Hyper-V. O `boot_timeout` já está configurado para 600 segundos. Se a VM aparecer na tela do VirtualBox mas o `vagrant up` der timeout, rode `vagrant ssh vm1` — geralmente já funciona.

#### Infraestrutura

| VM | IP privado | Memória | Função |
|:---|:---|:---|:---|
| VM1 | `192.168.56.10` | 1024 MB | Cliente de testes (curl) |
| VM2 | `192.168.56.11` | 1024 MB | Backend Node.js + SQLite |

#### Subindo as VMs

```bash
# Sobe ambas as VMs (pode demorar na primeira execução — baixa a box e instala dependências)
vagrant up

# Subir apenas uma VM específica
vagrant up vm1
vagrant up vm2
```

#### Verificando o status

```bash
vagrant status
```

#### Testando a rota GET a partir da VM1

1. Acesse a VM1 via SSH:

```bash
vagrant ssh vm1
```

2. Dentro da VM1, faça a requisição para a API rodando na VM2:

```bash
# Listar todos os livros
curl http://192.168.56.11:8080/api/livros

# Filtrar por título
curl "http://192.168.56.11:8080/api/livros?titulo=Dom"

# Filtrar por autor
curl "http://192.168.56.11:8080/api/livros?autor=Machado"
```

A resposta esperada é um array JSON com os livros cadastrados, por exemplo:

```json
[{"id":1,"titulo":"Dom Casmurro","autor":"Machado de Assis"}]
```

#### Desligando as VMs

```bash
vagrant halt        # Desliga sem destruir
vagrant destroy -f  # Remove as VMs permanentemente
```

---

### Com Ansible (provisionamento via VM1)

A VM1 atua como **nó de controle** Ansible e a VM2 como **nó gerenciado**. O playbook clona o repositório na VM2 e configura a aplicação do zero.

#### Pré-requisitos

Subir ambas as VMs normalmente:

```bash
vagrant up
```

O Vagrant instala o Ansible na VM1, gera um par de chaves SSH e autoriza a chave na VM2 automaticamente.

#### Executar o playbook

1. Acesse a VM1:

```bash
vagrant ssh vm1
```

2. Execute o playbook a partir de `/home/vagrant/ansible`:

```bash
cd ~/ansible
ansible-playbook configura-node.yaml
```

3. Verifique o resultado na VM2:

```bash
curl http://192.168.56.11:8080
```

#### Estrutura Ansible

```
ansible/
  ansible.cfg          → configuração padrão (inventory, chave SSH, host_key_checking)
  inventory.ini        → IP e credenciais da VM2
  configura-node.yaml  → playbook principal
```

---

## Endpoints

| Método | Rota | Descrição | Body |
|:---|:---|:---|:---|
| GET | `/api/livros` | Lista todos os livros | — |
| GET | `/api/livros?titulo=...` | Filtra por título | — |
| GET | `/api/livros?autor=...` | Filtra por autor | — |
| GET | `/api/livros?titulo=...&autor=...` | Filtra por título e autor | — |
| POST | `/api/livros` | Cadastra um novo livro | `{"titulo": "...", "autor": "..."}` |
| PUT | `/api/livros/:id` | Atualiza um livro | `{"titulo": "..."}` |
| DELETE | `/api/livros/:id` | Remove um livro (404 / 204) | — |

Documentação interativa disponível em: http://localhost:8080/api-docs

---

## Arquitetura

```
index.js       → rotas, validação Zod, configuração Express e Swagger
database.js    → setup do SQLite (tabela livros)
seed.js        → popula o banco com dados de exemplo
public/        → frontend estático (HTML, CSS, JS)
```

**Validação:** Zod exige `titulo` e `autor` com mínimo de 3 caracteres. Erros retornam `400 Bad Request`.

**Banco de dados:** SQLite com persistência em `database.db`.

---

## Testes

Jest + Supertest com cobertura de **97%+**. Os testes cobrem:

- Listagem, criação, atualização e remoção de livros
- Filtros por título, autor e combinado
- Validação de dados inválidos (Zod)
- Retorno 404 para recursos inexistentes
- Retorno 204 para remoção bem-sucedida

---

## Qualidade de Código

### ESLint + eslint-plugin-security (SAST)

Verificação de estilo e análise estática de segurança integradas. Regras aplicadas:

- Aspas simples
- Indentação de 4 espaços
- Ponto-e-vírgula obrigatório
- Detecção de vulnerabilidades conhecidas (injeção, ReDoS, etc.)

### Cobertura de testes

Threshold mínimo de 90% em statements, lines e branches, verificado automaticamente em cada PR.

---

## Workflows (GitHub Actions)

| Evento | Workflows disparados |
|:---|:---|
| `push` em qualquer branch | CI (build + testes), construção da imagem Docker |
| `push` na main | Publicação da imagem no DockerHub, Versionamento automático (semantic-release) |
| `pull_request` para main/develop | Workflow de PR, Qualidade (SAST + lint + cobertura) |

### Versionamento automático

O `semantic-release` analisa os commits semânticos ao fazer merge na `main` e:

- Gera a próxima versão automaticamente
- Cria tag e release no GitHub
- Atualiza o `CHANGELOG.md`

| Tipo de commit | Impacto na versão |
|:---|:---|
| `fix:` | patch (1.0.0 → 1.0.1) |
| `feat:` | minor (1.0.0 → 1.1.0) |
| `feat!:` / `BREAKING CHANGE` | major (1.0.0 → 2.0.0) |

---

## Gitflow

| Branch | Finalidade |
|:---|:---|
| `main` | Produção — código estável e versionado |
| `develop` | Integração de funcionalidades |
| `feature/*` | Desenvolvimento de novas funcionalidades |
| `fix-*` | Correções pontuais |

**Por que Gitflow?** Garante que a `main` nunca seja quebrada — toda funcionalidade passa por testes na `develop` antes do merge final.
