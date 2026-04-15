# 🎾 PGM-Connect v1.0

Plataforma en tiempo real para organizar retas de pádel, gestionar jugadores y facilitar la operación de clubes mediante un sistema simple, rápido y enfocado en la vida real.

---

## 🚀 Descripción

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
- Login con Google (con teléfono obligatorio)
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
  - Link a perfil en PGM

---

### ⚡ Tiempo Real (Diferenciador)
- Actualización en vivo de jugadores
- Eventos:
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
- WebSockets
- SQLAlchemy
- PostgreSQL (Supabase)

---

### Frontend
- React (Vite)
- React Bootstrap

---

### Infraestructura
- Backend: Render
- Frontend: Vercel
- Base de datos: Supabase

---

## 🧠 Reglas del sistema

- Los cupos de una reta siempre son múltiplos de 4
- El teléfono es el identificador principal del usuario
- Un usuario no puede duplicarse en una reta
- El master puede modificar el nivel de un jugador
- El veto es global
- Las retas no se eliminan (se mantienen como historial)
