# Portfolio Frontend - Deployment Guide

## 🚀 Estructura Simplificada

```
frontend/
├── Dockerfile              # ✅ Dockerfile de producción simplificado
├── nginx.conf              # ✅ Configuración nginx completa y simple
├── package.json
├── src/
└── ...

docker-compose.yml          # ✅ Configuración para producción (EasyPanel)
docker-compose.dev.yml      # ✅ Configuración para desarrollo local
```

## 📦 Para EasyPanel

### 1. Archivo a usar: `docker-compose.yml`
- ✅ Configurado para producción
- ✅ Puerto 80 para nginx
- ✅ Build sin variables complejas
- ✅ Sin targets ni scripts complicados

### 2. Verificar en EasyPanel:
- Puerto del servicio: **80**
- Tipo de servicio: **Web Service**
- Build context: **.**
- Dockerfile: **frontend/Dockerfile**

## 🧪 Para testing local

### Build y test rápido:
```bash
# Build del frontend
cd frontend && npm run build

# Test Docker local
docker build -t test-frontend frontend/
docker run -p 8080:80 test-frontend

# Verificar en: http://localhost:8080
```

### Desarrollo:
```bash
# Desarrollo con hot reload
docker-compose -f docker-compose.dev.yml up

# Acceder en: http://localhost:5173
```

## 🔧 Scripts útiles

- `./test-build.sh` - Verifica que el build funcione
- `./diagnose.sh` - Diagnóstico completo

## ✅ Lo que funciona ahora:

1. **Dockerfile simple**: Sin targets complejos, solo build y nginx
2. **Nginx directo**: Configuración completa sin variables de entorno
3. **Sin reiniciar**: No más loops de reinicio de nginx
4. **Health check**: Disponible en `/health`
5. **SPA routing**: Configurado para React Router

## 🚀 Deploy a EasyPanel:

1. Usa `docker-compose.yml` (ya configurado)
2. Asegúrate que el puerto sea 80
3. Espera a que el build termine
4. Verifica en tu dominio y `/health`
