# Utiliser une image Node officielle comme image de base
FROM node:latest

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie des fichiers de l'application
COPY . .

# Copie du fichier .env
COPY .env .env

# Exposer le port que l'application va utiliser
EXPOSE 3000

# Démarrer l'application
CMD ["node", "server.js"]
