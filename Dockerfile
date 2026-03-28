# Usar a versão leve do Node.js
FROM node:20-alpine

# Criar o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar os arquivos de dependências
COPY package*.json ./

# Instalar apenas as dependências necessárias para produção
RUN npm install --only=production

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que a API utiliza
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["node", "index.js"]