#!/bin/bash

# Script para configurar certificados SSL con Let's Encrypt
set -e

DOMAIN=${1:-tu-dominio.com}
EMAIL=${2:-tu-email@ejemplo.com}

echo "🔐 Configurando certificados SSL para: $DOMAIN"

# Crear directorios necesarios
mkdir -p certbot/conf certbot/www

# Parar nginx si está corriendo
docker-compose -f docker-compose.prod.yml stop nginx || true

# Obtener certificado
echo "📝 Obteniendo certificado SSL..."
docker run --rm \
    -v $(pwd)/certbot/conf:/etc/letsencrypt \
    -v $(pwd)/certbot/www:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --staging \
    -d $DOMAIN

# Actualizar configuración de nginx con el dominio correcto
sed -i "s/tu-dominio.com/$DOMAIN/g" nginx/conf.d/default.conf
sed -i "s/tu-email@ejemplo.com/$EMAIL/g" .env.prod

echo "✅ Certificado SSL configurado para $DOMAIN"
echo "🔄 Reinicia los servicios con: ./deploy.sh"

# Para certificado real (no staging), ejecuta:
echo "💡 Para obtener el certificado real, ejecuta:"
echo "docker run --rm -v \$(pwd)/certbot/conf:/etc/letsencrypt -v \$(pwd)/certbot/www:/var/www/certbot certbot/certbot certonly --webroot --webroot-path=/var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN"
