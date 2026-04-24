# 🎾 PGM-Connect v1.0

Plataforma en tiempo real para organizar retas de pádel, gestionar jugadores y facilitar la operación de clubes mediante un sistema simple, rápido y enfocado en la vida real.

---

## � Tabla de Contenidos

- [🚀 Descripción](#-descripción)
- [🎯 Objetivo](#-objetivo)
- [⚡ Funcionalidades](#-funcionalidades)
- [🧱 Stack Tecnológico](#-stack-tecnológico)
- [🧠 Reglas del Sistema](#-reglas-del-sistema)
- [🚀 Quick Start](#-quick-start)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔧 Guía de Desarrollo](#-guía-de-desarrollo)
- [📡 Endpoints Principales](#-endpoints-principales)
- [📊 Modelos de Datos](#-modelos-de-datos)
- [📈 Roadmap](#-roadmap)

---

## �🚀 Descripción

PGM-Connect v1.0 es un MVP funcional diseñado para resolver el problema principal en clubes de pádel:

👉 **Coordinar retas de manera eficiente sin depender de WhatsApp desordenado**

La plataforma permite a jugadores unirse a retas, y a los masters organizarlas, validarlas y gestionarlas en tiempo real.

---

## 🎯 Objetivo

Construir una solución práctica y usable desde el día uno que permita:

- Organizar retas fácilmente
- Gestionar jugadores en tiempo real
- Dar control total al organizador (master)
- Facilitar comunicación directa vía WhatsApp

---

## ⚡ Funcionalidades

### 👤 Usuarios
- Registro con teléfono (WhatsApp) y contraseña
- Login con JWT
- Perfil con nivel de juego

---

### 🎾 Retas
- Creación de retas (solo masters)
- Cupos limitados (múltiplos de 4)
- Asociación obligatoria a un club
- Historial de retas

---

### 🤝 Participación
- Unirse a retas directamente
- Unirse a retas con invitado
- Salirse de retas
- Validación automática:
  - cupos
  - duplicados
  - vetos

---

### 👑 Funciones del Master
- Confirmar jugadores (✅)
- Vetar jugadores globalmente
- Modificar nivel de jugadores
- Contactar jugadores vía WhatsApp

---

### 🏟️ Clubs
- Cada reta tiene una sede definida
- Información:
  - Nombre
  - Dirección
  - Logo

---

### ⚡ Tiempo Real (Diferenciador)
- Actualización en vivo de jugadores
- Eventos:
  - se crea una reta
  - jugador se une
  - jugador se sale
  - jugador confirmado

---

### 📲 Integración con WhatsApp
- Generación de links directos (`wa.me`)
- Sin chat interno → comunicación directa

---

## 🧱 Stack Tecnológico

### Backend
- Python + FastAPI
- SQLAlchemy
- PostgreSQL (Supabase)

---

### Frontend
- React (Vite)
- React Bootstrap

---

### Infraestructura
- Deploy: Railway
- Base de datos: Supabase

---

## 🧠 Reglas del sistema

- Los cupos de una reta siempre son múltiplos de 4
- El teléfono es el identificador principal del usuario
- Un usuario no puede duplicarse en una reta
- El master puede modificar el nivel de un jugador
- El veto es global
- Las retas no se eliminan (se mantienen como historial)

---

## 🚀 Quick Start

### Requisitos previos
- Python 3.9+
- Node.js 18+
- PostgreSQL (o una instancia de Supabase)
- Git

### Instalación Local

#### 1. Clonar repositorio
```bash
git clone https://github.com/RoAlfonsin/padel-growth-media-connect.git
cd padel-growth-media-connect
```

#### 2. Backend (FastAPI + Python)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

pip install -r requirements.txt

# Configurar variables de entorno (ver sección de .env)
cp .env.example .env  # Editar con tus valores
```

#### 3. Frontend (React + Vite)
```bash
cd ../frontend
npm install

# Configurar variables de entorno
cp .env.example .env  # Editar con tus valores
```

#### 4. Ejecutar en desarrollo
```bash
# Terminal 1 - Backend (desde backend/)
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend (desde frontend/)
npm run dev
```

✅ Backend disponible en `http://localhost:8000`  
✅ Frontend disponible en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
padel-growth-media-connect/
├── backend/                    # API FastAPI
│   ├── app/
│   │   ├── main.py            # Punto de entrada
│   │   ├── database.py        # Configuración DB
│   │   ├── dependencies/      # Inyección de dependencias (auth, etc)
│   │   ├── models/            # Modelos SQLAlchemy
│   │   ├── routers/           # Rutas API
│   │   ├── schemas/           # Esquemas Pydantic (validación)
│   │   └── utils/             # JWT, Security
│   └── requirements.txt
│
├── frontend/                   # App React + Vite
│   ├── src/
│   │   ├── pages/             # Componentes por página
│   │   ├── components/        # Componentes reutilizables
│   │   ├── context/           # React Context (Auth)
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # Integración Supabase
│   │   ├── api/               # Cliente HTTP
│   │   └── utils/             # Helpers
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

**Descripción por carpeta:**

| Carpeta | Propósito |
|---------|-----------|
| `backend/models` | Definición de tablas (User, Club, Reta, RetaPlayer, Veto) |
| `backend/routers` | Endpoints agrupados por recurso (auth, retas, clubs, users, vetos) |
| `backend/schemas` | Validación de entrada/salida (DTOs) |
| `frontend/pages` | Vistas principales (Login, Retas, RetaDetail, etc) |
| `frontend/components` | Componentes compartidos (ProtectedRoute, LogoutButton) |
| `frontend/context` | Estado global con AuthContext |

---

## 🔧 Guía de Desarrollo

### Comandos útiles

**Backend:**
```bash
cd backend

# Desarrollo
uvicorn app.main:app --reload

# Linting/Formato
# (Configurar según proyecto)

# Tests
pytest  # Si existen tests
```

**Frontend:**
```bash
cd frontend

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview producción local
npm run preview

# Linting
npm run lint
```

### Estructura de una request

1. **Frontend** → Realiza request al backend en `http://localhost:8000/api/...`
2. **Backend** → Router recibe, valida con schema Pydantic, consulta DB
3. **DB** → Supabase PostgreSQL con modelos SQLAlchemy
4. **Response** → JSON con datos o errores

### Workflow típico para nueva funcionalidad

1. Crear modelo en `backend/app/models/`
2. Crear schema en `backend/app/schemas/` para validación
3. Crear endpoint en `backend/app/routers/`
4. Crear componente React en `frontend/src/pages/` o `components/`
5. Consumir API con `fetch` o cliente HTTP

---

## 📡 Endpoints Principales

> ⚠️ **Nota:** Para documentación completa de API, consulta `/docs` en desarrollo o contacta al equipo.

**Categorías principales:**
- **Autenticación:** Register, Login, Token refresh
- **Retas:** CRUD, Join, Leave, Confirmación
- **Usuarios:** Perfil, Actualizar, Estadísticas
- **Clubs:** Listar, Detalle, Crear (admin)
- **Vetos:** Crear, Listar, Remover

> 🔒 Todos los endpoints (excepto auth pública) requieren JWT en header `Authorization: Bearer <token>`

---

## 📊 Modelos de Datos

### Relaciones principales

```
User (1) ──→ (N) Reta         [muchos usuarios participan en una reta]
     ↓
     └─→ (N) RetaPlayer       [confirmación + asistencia]
              │
              └─→ (1) Reta
              └─→ (1) User

Reta (N) ──→ (1) Club         [cada reta en un club]

User (N) ──→ (N) Veto         [usuario veta a otros usuarios]
```

### Tablas

| Tabla | Descripción | Campos |
|-------|-------------|--------|
| `User` | Usuarios del sistema | `id`, `phone`, `email`, `password_hash`, `level`, `created_at` |
| `Club` | Clubes de pádel | `id`, `name`, `location`, `logo_url`, `pgm_url` |
| `Reta` | Eventos de pádel | `id`, `club_id`, `master_id`, `date`, `slots`, `confirmed_count`, `status` |
| `RetaPlayer` | Participación en reta | `id`, `reta_id`, `user_id`, `confirmed`, `joined_at` |
| `Veto` | Vetos entre usuarios | `id`, `vetoed_by_id`, `vetoed_user_id`, `reason`, `created_at` |


```

### 🚫 Restricciones por Rol

| Acción | Usuario | Master | Admin |
|--------|---------|--------|-------|
| Ver retas | ✅ | ✅ | ✅ |
| Crear reta | ❌ | ✅ | ✅ |
| Vetar jugador | ❌ | ✅ | ✅ |
| Crear club | ❌ | ❌ | ✅ |
| Ver datos otros | Solo públicos | ✅ | ✅ |


```


## �📈 Roadmap

### ✅ MVP v1.0 (Actual)
- [x] Autenticación con JWT
- [x] Crear/listar retas
- [x] Unirse/salirse de retas
- [x] Validación de duplicados y cupos
- [x] Sistema de vetos
- [x] Integración WhatsApp links

### 🔄 v1.1 (En desarrollo)
- [ ] Agregar retas femeniles
- [ ] Permitir al master agregar clubes desde la app
- [ ] Login con Google
- [ ] Perfil de usuario más completo
- [ ] Historial y estadísticas

### 🚀 v2.0 (Planeado)
- [ ] Sistema de rating/reputación
- [ ] Notificaciones Push
- [ ] App mobile nativa

### 💡 Ideas futuras
- Grupos privados por club
- Reserva de pistas integrada
- Perfiles Master por clubes

---

## 📞 Soporte

Para reportar bugs o sugerir mejoras, abre un issue en GitHub.

**Última actualización:** Abril 2026
