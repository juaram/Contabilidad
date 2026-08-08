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

### Opción 1: Con API PHP contra la base de datos local (TrueNAS)

Requisito: PHP 8+ con `pdo_mysql` (este repo lo configura en `api/config.local.php` con
las credenciales del servidor TrueNAS; se ignora en git y NO se copia al build).

```bash
npm run dev:api             # Terminal 1 — API PHP real (puerto 8080) → TrueNAS
npm run dev                  # Terminal 2 — Frontend
```

Abrir `http://localhost:5173/conta/`.

### Opción 2: Contra servidor remoto

Crear `.env.local` con `VITE_API_TARGET=https://jramirez.eu/conta`, luego `npm run dev`.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run dev:api` | API PHP local (puerto 8080) conectada a la base de datos del TrueNAS |
| `npm run build` | Build de producción en `dist/`. Además copia la carpeta `api/` dentro de `dist/api/` |
| `npm run preview` | Previsualizar build |
| `npm run lint` | TypeScript type-checking |

> **Build:** `npm run build` ejecuta `vite build` y después `node scripts/copy-api.mjs`,
> que copia todos los archivos de `api/` (endpoints PHP + `schema.sql`) a `dist/api/`.
> Se excluyen por ser solo para desarrollo: `router.php` y
> `config.local.php` (así `dist/api/config.php` usa las credenciales de producción según el dominio).
> El resultado de `dist/` es autocontenido (frontend + backend) y listo para subir a producción.

## Despliegue en Hostalia

```bash
npm run build
```

Subir `dist/` a `public_html/conta/` (ya incluye `dist/api/` con los endpoints PHP y el `schema.sql`). Ejecutar `api/schema.sql` en la base de datos de cada instalación.

### Bases de datos por dominio

Cada dominio despliega su propia instalación con su propia base de datos (los datos no se mezclan).
`api/config.php` elige la base de datos según el dominio (`HTTP_HOST`) mediante un mapa:

| Dominio | Estado |
|---|---|
| `jramirez.eu` | Configurado (Hostalia `POAPMYSQL143`, BD `8600814_compartida`) |
| `twinbrosburger.com` | Configurado (Hostalia `PMYSQL170`, BD `9903378_conta`) |

El mismo `dist/` sirve para ambos dominios: sube el build a `public_html/conta/` de cada dominio y `config.php` elige automáticamente la base de datos correspondiente según el dominio en el que se recibe la petición. Para añadir un dominio nuevo, basta con añadir un bloque en el mapa de `api/config.php`.

Local (TrueNAS) sigue funcionando igual: `api/config.local.php` (no se sube al build) tiene prioridad sobre el mapa de dominios.

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
├── config.php                 # Conexión MySQL (Hostalia; usa config.local.php si existe)
├── config.local.php           # Credenciales TrueNAS (solo local, no se sube a git ni al build)
├── router.php                 # Router del servidor PHP de desarrollo (php -S)
├── schema.sql                 # Tablas conta_*
├── categories.php
├── subcategories.php
├── movements.php
├── stats.php
├── preferences.php
├── export.php
├── import.php
```
