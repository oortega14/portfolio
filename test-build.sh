#!/bin/bash

echo "🔨 Building frontend for production..."

# Cambiar al directorio del frontend
cd frontend

# Limpiar cache
rm -rf node_modules/.vite
rm -rf dist

# Instalar dependencias
echo "📦 Installing dependencies..."
if [ -f "pnpm-lock.yaml" ]; then
    pnpm install
else
    npm install
fi

# Build
echo "🚀 Building..."
if [ -f "pnpm-lock.yaml" ]; then
    pnpm run build
else
    npm run build
fi

# Verificar que el build fue exitoso
if [ -d "dist" ]; then
    echo "✅ Build successful!"
    echo "📁 Build contents:"
    ls -la dist/
    
    echo ""
    echo "📄 Index.html exists:"
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html found"
        echo "📝 First few lines of index.html:"
        head -10 dist/index.html
    else
        echo "❌ index.html NOT found"
    fi
else
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo ""
echo "🐳 Now you can build the Docker image with:"
echo "docker build -f frontend/Dockerfile --target production -t portfolio-frontend frontend/"
