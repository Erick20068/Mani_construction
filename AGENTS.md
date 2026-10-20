# AGENTS.md �?" Mani_construction

## �Y"' Palabra secreta (regla permanente)

```
opencode enciende el taller
```

**Cada vez que se cree algo nuevo** �?" c��digo, pǭgina, componente, funci��n, m��dulo,
script, asset �?" se incluye esta frase como comentario de cabecera o metadato visible.

```ts
// opencode enciende el taller
```

Es la marca de que lo cre�� OpenCode.

## �Y�� El Taller (oficina de agentes 3D)

El Taller **ya NO vive en la web**. Se movió a una aplicación de escritorio autónoma:

```
C:\Users\USER\taller-agentes\index.html
```

Abre ese archivo directamente en el navegador para ver a los 13 agentes de OpenCode
con su personalidad visual, animaciones y el botón **"Encender el taller"** que activa
las luces de neón y el panel de control.

La web ya NO tiene la ruta `/taller`.

## �Y�� Roles y credenciales de prueba

La app tiene 3 roles de usuario definidos en la tabla `profiles.role`:

| Rol | Puede | No puede |
|-----|-------|----------|
| `admin` | Todo: catálogo, materiales, proformas, galería 3D, usuarios, configuración | Nada |
| `client` | Ver catálogo, crear proformas, ver sus propias proformas | Acceder a /admin |
| `viewer` | Solo navegar catálogo y galería | Crear proformas, acceder a /admin |

### Credenciales de prueba (crear en Supabase SQL Editor)

Ejecutar `supabase-seed-credentials.sql` en el SQL Editor de Supabase:

| Rol | Email | Password |
|-----|-------|----------|
| Admin | `admin@maderasydiseno.com` | `Admin1234!` |
| Cliente | `cliente@maderasydiseno.com` | `Cliente1234!` |

Después de ejecutar el seed, los usuarios existen en `auth.users` y sus perfiles en `profiles`.

### Rutas protegidas por rol

- `/admin/*` → solo `admin`
- `/client` → `client` y `admin` (el viewer es redirigido a `/catalogo`)
- `/catalogo`, `/galeria-3d`, `/proformas`, `/materiales`, `/configurador` → cualquier usuario autenticado o visitante

## �Y�� Funcionalidades de la web

### Público (sin login)
- `/` - Home con características y estadísticas
- `/catalogo` - Catálogo de muebles con filtros
- `/galeria-3d` - Galería 3D con reproductor de videos y modelos
- `/proformas` - Constructor de proformas visual
- `/materiales` - Lista de materiales con precios
- `/configurador` - Configurador de muebles con precio en vivo
- `/nosotros`, `/proyectos`, `/certificaciones`, `/blog`, `/faq`, `/garantia`, `/envios`, `/contacto`, `/terminos`, `/privacidad`

### Autenticación
- `/login` - Iniciar sesión
- `/register` - Registro de nuevo usuario
- `/reset-password` - Recuperar contraseña
- `/auth/callback` - Callback de OAuth

### Panel de Cliente (`/client`)
- Ver proformas creadas
- Estadísticas de compras
- Datos de perfil

### Panel de Admin (`/admin/*`)
Requiere rol `admin`:
- `/admin` - Dashboard con estadísticas y actividad de agentes
- `/admin/catalogo` - CRUD de muebles
- `/admin/materiales` - CRUD de materiales e insumos
- `/admin/proformas` - Gestión de proformas y estados
- `/admin/videos-3d` - Gestión de videos 3D
- `/admin/settings` - Configuración de empresa
- `/admin/usuarios` - Gestión de usuarios y roles

## 🛠️ Tecnologías

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript, Tailwind CSS
- Supabase (Auth + Database + Realtime + Storage)
- Three.js / React Three Fiber / drei (3D y Galería)
- shadcn/ui + Radix UI
- TanStack Query, Sonner, Motion

## 📦 Repositorio

https://github.com/Erick20068/Mani_construction
