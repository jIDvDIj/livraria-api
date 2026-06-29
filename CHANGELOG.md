# [1.4.0](https://github.com/jIDvDIj/livraria-api/compare/v1.3.0...v1.4.0) (2026-06-29)


### Features

* **monitoring:** adicionar monitoramento com Netdata e alertas de CPU ([503e9d9](https://github.com/jIDvDIj/livraria-api/commit/503e9d9f599a5f1e4c5fb5cb2ae332c8c452c6b5))

# [1.3.0](https://github.com/jIDvDIj/livraria-api/compare/v1.2.0...v1.3.0) (2026-06-01)


### Bug Fixes

* **api:** adicionar tratamento de erro nas rotas GET e DELETE ([f7c22b9](https://github.com/jIDvDIj/livraria-api/commit/f7c22b9af9192b1e0e5da8db8c1c1309774ad782))
* **ci:** corrigir chave parameters duplicada no swagger e branches de produção no coverage ([67ce9ad](https://github.com/jIDvDIj/livraria-api/commit/67ce9adf1bd7035cae68cb954a311e2a8c1385cd))
* **test:** usar banco SQLite em memória nos testes para evitar poluição do banco real ([606a2a1](https://github.com/jIDvDIj/livraria-api/commit/606a2a1f97d7f315ab4ae315bf2ba3ea40a8f195))


### Features

* **api:** adicionar campo ano opcional ao modelo de livro ([d5e67e8](https://github.com/jIDvDIj/livraria-api/commit/d5e67e89717e431a635f96c46618f18ce7db4899))
* **api:** adicionar paginação ao GET /api/livros com metadados de total ([c42cc3a](https://github.com/jIDvDIj/livraria-api/commit/c42cc3abdcca01cf4c73a30f977365b218f0fe2a))
* **api:** adicionar rota GET /api/livros/:id com testes ([2d00be7](https://github.com/jIDvDIj/livraria-api/commit/2d00be7b9ccac7072b8b9a1f754c4afc38a1f4e0))
* **config:** usar variável de ambiente PORT com fallback para 8080 ([86a97fa](https://github.com/jIDvDIj/livraria-api/commit/86a97fafc72c92ec8135fd15918bfc4a14a3499e))
* **security:** adicionar rate limiting de 100 req/15min por IP nas rotas /api ([137f457](https://github.com/jIDvDIj/livraria-api/commit/137f457fc37c9869474379fa8fdbbd65da3ccd0c))

# [1.2.0](https://github.com/jIDvDIj/livraria-api/compare/v1.1.0...v1.2.0) (2026-06-01)


### Bug Fixes

* **vagrant:** corrigir provisionamento da vm2 para compilar sqlite3 para Linux ([c13bfc9](https://github.com/jIDvDIj/livraria-api/commit/c13bfc9dc458cadeb06758707f53b58ce7583f6b))


### Features

* **ansible:** adicionar provisionamento da VM2 via Ansible com clone do repositório ([717c4ea](https://github.com/jIDvDIj/livraria-api/commit/717c4ea69a822bd0949d49618b2726f94e87a152))

# [1.1.0](https://github.com/jIDvDIj/livraria-api/compare/v1.0.0...v1.1.0) (2026-05-20)


### Features

* **vagrant:** adicionar ambiente de desenvolvimento com duas VMs ([3d84004](https://github.com/jIDvDIj/livraria-api/commit/3d84004f91bc8b362dca43d26f2e98e945e92aa6))

# 1.0.0 (2026-05-03)


### Bug Fixes

* ajustar identação swagger e middleware de espera do banco ([7dc5ac2](https://github.com/jIDvDIj/livraria-api/commit/7dc5ac208755e12aa3a5d5774f9ca5989f3eecb6))
* **ci:** atualizar Node.js para v24 no workflow de release ([846484c](https://github.com/jIDvDIj/livraria-api/commit/846484c25bca0353ce9b5aead43280b062430a51))
* **docs:** formata YAML no JSDoc para corrigir erro de parser do Swagger ([c95c141](https://github.com/jIDvDIj/livraria-api/commit/c95c1411a10119663c797b7ef58dfd989addb2d4))
* registrar dependências do swagger e corrigir identação YAML ([6fe5d3f](https://github.com/jIDvDIj/livraria-api/commit/6fe5d3f5c01b1712c8f69a779d259a5bdecaae27))
* registrar rotas de forma síncrona para evitar 404 nos testes ([18b1638](https://github.com/jIDvDIj/livraria-api/commit/18b16388ce1097813e1b8ee9984843b1bd6e995a))


### Features

* adicionar busca dinâmica por título e autor ([f917c24](https://github.com/jIDvDIj/livraria-api/commit/f917c24e2bc953797892f777daf6230356cb0b65))
* adicionar frontend responsivo e configurar CORS ([05f5d00](https://github.com/jIDvDIj/livraria-api/commit/05f5d005eca2ac07b905e0bbcf852b1c204ff6c9))
* adicionar rota DELETE para remover livros por ID ([aa9fadf](https://github.com/jIDvDIj/livraria-api/commit/aa9fadf409a4b7534c94271e54939f6cb40cba0c))
* adicionar rota POST para novos livros ([f511182](https://github.com/jIDvDIj/livraria-api/commit/f51118293b4e7acdcb24c92568083de5d9f41a2f))
* adicionar rota PUT e atualizar documentação ([3842e52](https://github.com/jIDvDIj/livraria-api/commit/3842e5216e3e876fe353cee012a3b6191cf23a2b))
* adicionar script de seed para banco de dados de teste ([eeaabde](https://github.com/jIDvDIj/livraria-api/commit/eeaabdef28e7f3ac5627aac9ff08b65d8831783d))
* adicionar validação de esquema com Zod ([eb48481](https://github.com/jIDvDIj/livraria-api/commit/eb48481f6476c8fd178b08dac3ee77fcc6399764))
* adicionar workflows específicos para commit e pull request ([d4eef04](https://github.com/jIDvDIj/livraria-api/commit/d4eef0477c59fc24416a2036b2c1e51474162856))
* corrigir rota DELETE /api/livros/:id para retornar 404 e 204 ([d2b5397](https://github.com/jIDvDIj/livraria-api/commit/d2b53978dc230549ad80d53b27cf9620bb3ed432))
* implementar dockerização da api com docker-compose ([e3c870a](https://github.com/jIDvDIj/livraria-api/commit/e3c870a1e22933f6febc1bf134f5b2c84e7c6dff))
* implementar persistência com SQLite e separação de camadas ([caa014d](https://github.com/jIDvDIj/livraria-api/commit/caa014d53047a4ec06835e0dcc0a65e3b0fe4e23))
* implementar rota GET de livros ([86b1f8e](https://github.com/jIDvDIj/livraria-api/commit/86b1f8e2a383555cc24260cbd91ddccef7ee8cff))
