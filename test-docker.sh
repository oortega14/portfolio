#!/bin/bash

echo "🧪 Testing Docker frontend container locally..."

# Detener y eliminar contenedor previo si existe
docker stop portfolio-frontend-test 2>/dev/null || true
docker rm portfolio-frontend-test 2>/dev/null || true

# Construir la imagen
echo "🔨 Building Docker image..."
docker build -f frontend/Dockerfile --target production -t portfolio-frontend-test frontend/

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Ejecutar el contenedor
echo "🚀 Starting container on port 8080..."
docker run -d --name portfolio-frontend-test -p 8080:80 -e PORT=80 portfolio-frontend-test

# Esperar un poco para que el contenedor inicie
sleep 3

# Verificar que el contenedor está corriendo
if [ "$(docker ps -q -f name=portfolio-frontend-test)" ]; then
    echo "✅ Container is running"
    
    # Verificar logs
    echo "📋 Container logs:"
    docker logs portfolio-frontend-test
    
    echo ""
    echo "🌐 Testing HTTP response..."
    
    # Probar la conexión
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200"; then
        echo "✅ HTTP 200 response received"
        echo "🎉 SUCCESS! Frontend is working"
        echo ""
        echo "🔗 Open in browser: http://localhost:8080"
        echo ""
        echo "To stop the test container, run:"
        echo "docker stop portfolio-frontend-test"
        echo "docker rm portfolio-frontend-test"
    else
        echo "❌ HTTP request failed"
        echo "📋 Checking container logs:"
        docker logs portfolio-frontend-test
    fi
else
    echo "❌ Container failed to start"
    echo "📋 Checking container logs:"
    docker logs portfolio-frontend-test
fi
