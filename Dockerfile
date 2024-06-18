# Utiliser une image Node officielle comme image de base
FROM node:latest

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copie des fichiers de l'application
COPY . .

# Copie du fichier .env
COPY .env .env

# Exposer le port que l'application va utiliser
EXPOSE 3000

# Démarrer l'application
CMD ["node", "server.js"]
