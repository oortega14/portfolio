#!/bin/bash

echo "🔍 Frontend Diagnostics for EasyPanel"
echo "======================================"

echo ""
echo "1. 📁 Checking build output..."
if [ -d "frontend/dist" ]; then
    echo "✅ dist directory exists"
    echo "📄 Files in dist:"
    ls -la frontend/dist/
    echo ""
    echo "📄 Content of index.html:"
    head -20 frontend/dist/index.html
else
    echo "❌ dist directory does not exist"
    echo "Run: cd frontend && npm run build"
fi

echo ""
echo "2. 🐳 Docker configuration check..."
echo "🔍 docker-compose.yml frontend service:"
grep -A 15 "frontend:" docker-compose.yml

echo ""
echo "3. 🌐 Nginx configuration..."
echo "📄 nginx.simple.conf:"
cat frontend/nginx.simple.conf

echo ""
echo "4. 🔧 Environment variables..."
echo "📄 .env.production (if exists):"
if [ -f "frontend/.env.production" ]; then
    cat frontend/.env.production
else
    echo "No .env.production file found"
fi

echo ""
echo "5. ⚙️ Package.json scripts:"
grep -A 5 '"scripts"' frontend/package.json

echo ""
echo "6. 🚀 For EasyPanel deployment:"
echo "   - Make sure you're using docker-compose.yml (production config)"
echo "   - Ensure the PORT environment variable is set correctly"
echo "   - Check that the 'target: production' is specified in the build"
echo "   - Verify the container is accessible on port 80"
echo ""
echo "7. 🧪 Quick test commands:"
echo "   Local build test: ./test-build.sh"
echo "   Local Docker test: ./test-docker.sh"
echo "   Manual Docker test:"
echo "     docker build -f frontend/Dockerfile --target production -t test-frontend frontend/"
echo "     docker run -p 8080:80 -e PORT=80 test-frontend"
echo ""
echo "8. 🔍 EasyPanel debugging:"
echo "   - Check the container logs in EasyPanel dashboard"
echo "   - Verify the service is mapped to the correct port"
echo "   - Test the health endpoint: http://your-domain/health"
