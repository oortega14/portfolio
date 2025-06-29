# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json y pnpm-lock.yaml si existe
COPY package*.json pnpm-lock.yaml* ./

# Instala dependencias (usa pnpm si existe el lock file)
RUN if [ -f pnpm-lock.yaml ]; then \
        npm install -g pnpm && pnpm install; \
    else \
        npm install; \
    fi

COPY . .

# Build de la aplicación
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm run build; \
    else \
        npm run build; \
    fi

# Etapa de producción
FROM nginx:alpine

# Copia el build de Vite al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear configuración nginx simplificada
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen $PORT default_server;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name _;' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Script simple para reemplazar $PORT
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'export PORT=${PORT:-80}' >> /start.sh && \
    echo 'sed -i "s/\$PORT/$PORT/g" /etc/nginx/conf.d/default.conf' >> /start.sh && \
    echo 'echo "Nginx listening on port: $PORT"' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

# Usar variable de entorno para el puerto
ENV PORT=80
EXPOSE $PORT

CMD ["/start.sh"]