# Mis Cuentas — Control Financiero Personal

Aplicación web para la gestión de finanzas domésticas: control de ingresos, gastos, categorización y registro histórico de movimientos. Frontend React + API PHP + MySQL.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4 |
| Backend | PHP 8+ (API REST con PDO) |
| Base de datos | MySQL / MariaDB (prefijo `conta_`) |
| Producción | `https://jramirez.eu/conta/` |

## Requisitos

- Node.js 18+

## Desarrollo local

### Opción 1: Con servidor mock (recomendado, no requiere PHP)

Ejecuta el servidor mock de la API y Vite en dos terminales:

```bash
# Terminal 1 — API mock
node api/mock-server.mjs

# Terminal 2 — Frontend
npm run dev
```

Abrir `http://localhost:5173/conta/` (o el puerto que indique Vite).

### Opción 2: Contra servidor remoto

Crea un archivo `.env.local`:

```
VITE_API_TARGET=https://jramirez.eu
```

Luego:

```bash
npm run dev
```

Vite redirigirá las llamadas API a tu servidor de producción.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualizar build |
| `npm run lint` | TypeScript type-checking |
| `node api/mock-server.mjs` | Servidor mock de la API (puerto 8080) |

## Despliegue en Hostalia

```bash
npm run build
```

Subir `dist/` a `public_html/conta/` y la carpeta `api/` a `public_html/conta/api/`. Ejecutar `api/schema.sql` en la base de datos.

## Estructura

```
src/
├── api.ts                     # Servicio API (fetch)
├── App.tsx                    # Componente principal
├── types.ts                   # Interfaces
├── index.css                  # Estilos globales
└── components/
    ├── Header.tsx
    ├── InicioView.tsx         # Dashboard
    ├── RegistroView.tsx       # Tabla con filtros
    ├── AjustesView.tsx        # Configuración
    ├── NuevaEntradaModal.tsx
    ├── NuevaCategoriaModal.tsx
    └── HelpModal.tsx

api/
├── config.php                 # Conexión MySQL
├── schema.sql                 # Tablas conta_*
├── categories.php
├── subcategories.php
├── movements.php
├── stats.php
├── preferences.php
├── export.php
└── mock-server.mjs            # Mock para desarrollo local
```
