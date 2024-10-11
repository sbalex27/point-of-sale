# Utiliza una imagen base de Node.js
FROM node:16

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# # Comando para ejecutar la aplicación
# CMD ["npm", "start"]