#!/bin/sh
set -e

# Mostrar información de debug
echo "=== Railway Debug Info ==="
echo "PORT environment variable: ${PORT:-'not set'}"
echo "Current working directory: $(pwd)"
echo "Nginx version: $(nginx -v 2>&1)"
echo "Files in /usr/share/nginx/html:"
ls -la /usr/share/nginx/html/ || echo "Directory not found"

# Establecer puerto por defecto si no está definido
export PORT=${PORT:-80}
echo "Using PORT: $PORT"

# Procesar template de nginx
echo "Processing nginx template..."
envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Generated nginx config:"
cat /etc/nginx/conf.d/default.conf

# Verificar configuración de nginx
echo "Testing nginx configuration..."
nginx -t

echo "Starting nginx on port $PORT..."
exec nginx -g "daemon off;"
