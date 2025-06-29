# Despliegue en Producción

Este documento explica cómo desplegar el portfolio en producción usando Docker y nginx.

## 📋 Prerequisitos

1. VPS con Docker y Docker Compose instalados
2. Dominio apuntando a tu VPS
3. Puertos 80 y 443 abiertos en el firewall

## 🚀 Pasos para el despliegue

### 1. Preparar variables de entorno

Copia el archivo `.env.prod` y configura las variables:

```bash
cp .env.prod .env.prod.local
nano .env.prod.local
```

Configura:
- `RAILS_MASTER_KEY`: Tu master key de Rails (ya la tienes en `config/master.key`)
- `POSTGRES_PASSWORD`: Contraseña segura para PostgreSQL
- `DOMAIN`: Tu dominio (ej: miportfolio.com)
- `EMAIL`: Tu email para Let's Encrypt
- `VITE_API_URL`: URL de tu API (ej: https://miportfolio.com/api)

### 2. Configurar SSL (opcional pero recomendado)

```bash
./setup-ssl.sh tu-dominio.com tu-email@ejemplo.com
```

### 3. Desplegar

```bash
./deploy.sh
```

## 🔧 Comandos útiles

### Ver logs
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Reiniciar servicios
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Parar todos los servicios
```bash
docker-compose -f docker-compose.prod.yml down
```

### Actualizar aplicación
```bash
git pull
./deploy.sh
```

### Backup de base de datos
```bash
docker exec portfolio-postgres pg_dump -U portfolio_user portfolio_production > backup.sql
```

### Restaurar base de datos
```bash
docker exec -i portfolio-postgres psql -U portfolio_user portfolio_production < backup.sql
```

## 🔐 Seguridad

1. **Firewall**: Solo permite puertos 22 (SSH), 80 (HTTP) y 443 (HTTPS)
2. **SSL**: Certificados Let's Encrypt automáticos
3. **Headers de seguridad**: Configurados en nginx
4. **Rate limiting**: Protección contra ataques DDoS
5. **Variables de entorno**: Credenciales seguras

## 📊 Monitoreo

### Health checks
- Frontend: `https://tu-dominio.com/health`
- Backend: `https://tu-dominio.com/api/health`

### Logs en tiempo real
```bash
docker-compose -f docker-compose.prod.yml logs -f --tail=100
```

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. Conecta por SSH a tu VPS
2. Navega al directorio del proyecto
3. Ejecuta:
   ```bash
   git pull
   ./deploy.sh
   ```

## 🚨 Troubleshooting

### Si los contenedores no inician:
```bash
docker-compose -f docker-compose.prod.yml logs
```

### Si hay problemas con SSL:
```bash
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Si la base de datos no conecta:
```bash
docker-compose -f docker-compose.prod.yml exec postgres psql -U portfolio_user -d portfolio_production
```
