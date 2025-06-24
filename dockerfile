# Multi-stage build para aplicación React/Vite
FROM node:18-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copia el código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# Segunda etapa: servidor nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 5173
EXPOSE 5173

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]