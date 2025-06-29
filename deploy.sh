#!/bin/bash

# Script para desplegar en producción
set -e

echo "🚀 Iniciando despliegue en producción..."

# Verificar que existe el archivo .env.prod.local
if [ ! -f .env.prod.local ]; then
    echo "❌ Error: No se encontró el archivo .env.prod.local"
    echo "Crea el archivo .env.prod.local con las variables de entorno necesarias"
    exit 1
fi

# Parar contenedores existentes
echo "🛑 Parando contenedores existentes..."
docker-compose -f docker-compose.prod.yml down

# Construir imágenes
echo "🔨 Construyendo imágenes..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar servicios
echo "🌟 Iniciando servicios..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod.local up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar estado de los contenedores
echo "📊 Estado de los contenedores:"
docker-compose -f docker-compose.prod.yml ps

# Mostrar logs si hay errores
if [ $? -ne 0 ]; then
    echo "❌ Error en el despliegue. Mostrando logs:"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

echo "✅ Despliegue completado exitosamente!"
echo "🌐 Tu aplicación está disponible en: https://www.oortega14.com"
