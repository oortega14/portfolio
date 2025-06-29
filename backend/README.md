# Portfolio Backend API

Una API REST construida con Ruby on Rails 8 que sirve como backend para una aplicación de portfolio personal. Incluye gestión de contenido multiidioma, autenticación JWT y una arquitectura moderna con Docker.

## 🚀 Características

- **API REST completa** con endpoints para portfolio, blog y experiencias
- **Autenticación JWT** con blacklist de tokens
- **Soporte multiidioma** (Español/Inglés)
- **Base de datos PostgreSQL** con migraciones
- **Dockerización completa** para desarrollo y producción
- **CORS configurado** para frontend React
- **Validaciones robustas** y manejo de errores
- **Código limpio** con RuboCop y Brakeman

## 📋 Requisitos

- Docker y Docker Compose
- Ruby 3.4+ (si ejecutas localmente)
- PostgreSQL 17+ (si ejecutas localmente)

## 🛠️ Instalación y Configuración

### Con Docker (Recomendado)

1. **Clona el repositorio y navega al directorio**
   ```bash
   git clone <tu-repo>
   cd portfolio/backend
   ```

2. **Construye y ejecuta los contenedores**
   ```bash
   # Desde el directorio raíz del proyecto
   docker-compose up --build
   ```

3. **Configura la base de datos**
   ```bash
   docker-compose exec backend rails db:create
   docker-compose exec backend rails db:migrate
   docker-compose exec backend rails db:seed
   ```

### Instalación Local

1. **Instala las dependencias**
   ```bash
   bundle install
   ```

2. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   # Edita .env con tus configuraciones
   ```

3. **Configura la base de datos**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. **Inicia el servidor**
   ```bash
   rails server
   ```

## 🗄️ Estructura de la Base de Datos

### Modelos Principales

- **Users**: Gestión de usuarios y autenticación
- **Categories**: Categorías para organizar contenido
- **Blogs**: Artículos del blog con soporte multiidioma
- **Experiences**: Experiencias laborales/académicas
- **Projects**: Proyectos del portfolio
- **Comments**: Sistema de comentarios
- **JwtDenylist**: Blacklist de tokens JWT

### Relaciones

```
User
├── has_many :blogs
├── has_many :experiences
├── has_many :projects
└── has_many :comments

Category
├── has_many :blogs
├── has_many :experiences
└── has_many :projects

Blog/Experience/Project
├── belongs_to :category
├── belongs_to :user
└── has_many :comments
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Autenticación
```http
POST   /login     # Iniciar sesión
DELETE /logout    # Cerrar sesión
```

### Categorías
```http
GET    /categories      # Listar todas las categorías
GET    /categories/:id  # Obtener categoría específica
POST   /categories     # Crear categoría (requiere auth)
PUT    /categories/:id # Actualizar categoría (requiere auth)
DELETE /categories/:id # Eliminar categoría (requiere auth)
```

### Blog
```http
GET    /blogs          # Listar artículos
GET    /blogs/:id      # Obtener artículo específico
GET    /blogs/:slug    # Obtener artículo por slug
POST   /blogs          # Crear artículo (requiere auth)
PUT    /blogs/:id      # Actualizar artículo (requiere auth)
DELETE /blogs/:id      # Eliminar artículo (requiere auth)
```

### Experiencias
```http
GET    /experiences      # Listar experiencias
GET    /experiences/:id  # Obtener experiencia específica
POST   /experiences     # Crear experiencia (requiere auth)
PUT    /experiences/:id # Actualizar experiencia (requiere auth)
DELETE /experiences/:id # Eliminar experiencia (requiere auth)
```

### Proyectos
```http
GET    /projects      # Listar proyectos
GET    /projects/:id  # Obtener proyecto específico
POST   /projects     # Crear proyecto (requiere auth)
PUT    /projects/:id # Actualizar proyecto (requiere auth)
DELETE /projects/:id # Eliminar proyecto (requiere auth)
```

### Comentarios
```http
GET    /comments      # Listar comentarios
GET    /comments/:id  # Obtener comentario específico
POST   /comments     # Crear comentario
PUT    /comments/:id # Actualizar comentario (requiere auth)
DELETE /comments/:id # Eliminar comentario (requiere auth)
```

## 🔐 Autenticación

La API utiliza autenticación JWT con los siguientes headers:

```http
Authorization: Bearer <your_jwt_token>
```

### Ejemplo de Login
```http
POST /api/v1/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

### Respuesta
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

## 🌍 Soporte Multiidioma

Los modelos `Blog`, `Experience` y `Project` soportan contenido en múltiples idiomas:

```json
{
  "title": {
    "es": "Título en Español",
    "en": "Title in English"
  },
  "description": {
    "es": "Descripción en español...",
    "en": "Description in English..."
  }
}
```

## 🔧 Variables de Entorno

### Desarrollo
```env
RAILS_ENV=development
BINDING=0.0.0.0
CORS_ORIGINS=http://localhost:5173
DATABASE_URL=postgresql://portfolio_user:portfolio_pass@portfolio-db-dev:5432/portfolio
RAILS_MASTER_KEY=<tu_master_key>
```

### Producción
```env
RAILS_ENV=production
BINDING=0.0.0.0
CORS_ORIGINS=https://tu-dominio.com
DATABASE_URL=<tu_database_url>
RAILS_MASTER_KEY=<tu_master_key>
```

## 🧪 Testing

### Ejecutar tests
```bash
# En Docker
docker-compose exec backend rails test

# Localmente
rails test
```

### Análisis de código
```bash
# RuboCop
docker-compose exec backend rubocop

# Brakeman (análisis de seguridad)
docker-compose exec backend brakeman
```

## 📁 Estructura del Proyecto

```
backend/
├── app/
│   ├── controllers/
│   │   ├── api/v1/          # Controladores de la API
│   │   └── concerns/        # Módulos compartidos
│   ├── models/              # Modelos de datos
│   ├── jobs/                # Background jobs
│   └── mailers/             # Email templates
├── config/
│   ├── environments/        # Configuraciones por entorno
│   ├── initializers/        # Inicializadores
│   └── routes.rb           # Definición de rutas
├── db/
│   ├── migrate/            # Migraciones de BD
│   └── seeds.rb           # Datos de prueba
├── lib/
│   └── json_web_token.rb  # Utilidad JWT
└── test/                  # Tests
```

## 🚀 Despliegue

### Docker
```bash
# Construir imagen de producción
docker build -t portfolio-backend .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env portfolio-backend
```

### Heroku/Railway/Fly.io
1. Configura las variables de entorno
2. Conecta tu repositorio
3. La aplicación se desplegará automáticamente

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Tu Nombre - tu.email@ejemplo.com

Enlace del Proyecto: [https://github.com/tu-usuario/portfolio](https://github.com/tu-usuario/portfolio)