# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos construidos al directorio de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx (para SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

