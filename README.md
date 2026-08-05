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

```bash
node api/mock-server.mjs    # Terminal 1 — API mock (puerto 8080)
npm run dev                  # Terminal 2 — Frontend
```

Abrir `http://localhost:5173/conta/`.

### Opción 2: Contra servidor remoto

Crear `.env.local` con `VITE_API_TARGET=https://jramirez.eu`, luego `npm run dev`.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build de producción en `dist/`. Además copia la carpeta `api/` dentro de `dist/api/` |
| `npm run preview` | Previsualizar build |
| `npm run lint` | TypeScript type-checking |

> **Build:** `npm run build` ejecuta `vite build` y después `node scripts/copy-api.mjs`,
> que copia todos los archivos de `api/` (endpoints PHP + `schema.sql`) a `dist/api/`.
> `mock-server.mjs` se excluye por ser solo para desarrollo. El resultado de `dist/` es
> autocontenido (frontend + backend) y listo para subir a producción.

## Despliegue en Hostalia

```bash
npm run build
```

Subir `dist/` a `public_html/conta/` (ya incluye `dist/api/` con los endpoints PHP y el `schema.sql`). Ejecutar `api/schema.sql` en la base de datos.

**Nota:** Hostalia no soporta los verbos HTTP `PUT` ni `DELETE`. Los endpoints usan `POST` con `_method=DELETE` donde es necesario.

## Formato CSV

Importación y exportación usan el mismo formato:

```
Fecha;Categoría;Subcategoría;Descripción;Tipo;Importe
```

- Separador: `;` (punto y coma)
- Codificación: UTF-8 con BOM
- Decimales: punto (`.`)
- Fecha: `YYYY-MM-DD`

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
    ├── ChangePasswordModal.tsx
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
├── import.php
└── mock-server.mjs            # Mock para desarrollo local
```
