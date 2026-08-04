# Design Document — Mis Cuentas

## 1. Visión General

Aplicación de contabilidad doméstica para registrar, categorizar y consultar ingresos y gastos personales. Cliente React con backend PHP + MySQL desplegado en Hostalia.

## 2. Arquitectura

```
[Navegador]                    [Hostalia — Hosting Compartido]
  └── React SPA (build) ───►   /conta/
       └── src/api.ts          ├── index.html (frontend estático)
                               ├── assets/   (JS, CSS)
                               └── api/*.php (API REST)
                                    └── MySQL (tablas conta_*)
```

## 3. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4 |
| Backend | PHP 8+ (API REST, PDO) |
| Base de datos | MySQL / MariaDB |
| Hosting | Hostalia — Hosting Compartido |
| Íconos | Material Symbols Outlined |
| Tipografía | Inter (Google Fonts) |

## 4. Base de Datos — Esquema MySQL

Todas las tablas usan el prefijo `conta_`.

### 4.1 `conta_categories`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INT UNSIGNED AUTO_INCREMENT PK | Identificador único |
| `name` | VARCHAR(100) NOT NULL | Nombre visible |
| `icon` | VARCHAR(255) NOT NULL | Icono: enlace CDN (freeicon.com) o nombre Material Symbols |
| `color_bg` | VARCHAR(50) DEFAULT 'bg-primary-fixed' | Clase Tailwind fondo |
| `color_text` | VARCHAR(50) DEFAULT 'text-on-primary-fixed' | Clase Tailwind texto |
| `created_at` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

### 4.2 `conta_subcategories`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INT UNSIGNED AUTO_INCREMENT PK | |
| `category_id` | INT UNSIGNED NOT NULL FK | Categoría padre (CASCADE) |
| `name` | VARCHAR(100) NOT NULL | |
| `created_at` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | |

### 4.3 `conta_movements`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INT UNSIGNED AUTO_INCREMENT PK | |
| `date` | DATE NOT NULL | |
| `category_id` | INT UNSIGNED NOT NULL FK | (RESTRICT) |
| `subcategory_id` | INT UNSIGNED DEFAULT NULL FK | (SET NULL) |
| `description` | VARCHAR(255) NOT NULL | |
| `type` | ENUM('ingreso','gasto') NOT NULL | |
| `amount` | DECIMAL(12,2) NOT NULL | |
| `created_at` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | |
| INDEX | `(date, type)` | |
| INDEX | `(category_id)` | |

### 4.4 `conta_preferences`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INT UNSIGNED AUTO_INCREMENT PK | Solo 1 fila |
| `currency` | VARCHAR(20) | Euro (€) - EUR |
| `date_format` | VARCHAR(40) | DD / MM / AAAA (31/12/2024) |
| `high_contrast` | TINYINT(1) DEFAULT 0 | |
| `app_title` | VARCHAR(100) DEFAULT 'Mis Cuentas' | Título personalizado |
| `app_subtitle` | VARCHAR(200) DEFAULT 'Control Financiero' | Subtítulo personalizado |
| `updated_at` | TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

## 5. API REST — Endpoints PHP

**Nota:** Hostalia no soporta `PUT` ni `DELETE`. Las operaciones de eliminación usan `POST` con `?_method=DELETE` y las preferencias usan `POST`.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/conta/api/categories.php` | Listar categorías con subcategorías y contador |
| POST | `/conta/api/categories.php` | Crear categoría `{name, icon, color_bg, color_text}` |
| POST | `/conta/api/categories.php?_method=PUT` | Editar categoría `{id, name, icon, color_bg, color_text}` |
| DELETE | `/conta/api/categories.php?id=X` | Eliminar (solo si no tiene movimientos) |
| POST | `/conta/api/subcategories.php` | Crear subcategoría `{category_id, name}` |
| DELETE | `/conta/api/subcategories.php?id=X` | Eliminar subcategoría |
| GET | `/conta/api/movements.php?year=&month=&category_id=&search=&page=` | Listar movimientos (filtros + paginación + totales) |
| POST | `/conta/api/movements.php` | Crear movimiento |
| POST | `/conta/api/movements.php?_method=DELETE&id=X` | Eliminar movimiento |
| GET | `/conta/api/stats.php` | Dashboard: saldo, totales, histórico mensual, últimos movimientos |
| GET | `/conta/api/preferences.php` | Obtener preferencias |
| POST | `/conta/api/preferences.php` | Actualizar preferencias |
| GET | `/conta/api/export.php?format=csv` | Exportar CSV (UTF-8 BOM, separador `;`) |
| POST | `/conta/api/import.php` | Importar CSV (multipart, campo `file`) |
| POST | `/conta/api/maintenance.php` | Actualización masiva de movimientos (preview o apply) |

## 6. Frontend — Estructura actual

```
src/
├── api.ts                     # Servicio API (fetch centralizado)
├── App.tsx                    # Componente principal (estado + orquestación)
├── main.tsx                   # Entry point
├── types.ts                   # Tipos e interfaces
├── index.css                  # Estilos globales + tema Tailwind
└── components/
    ├── Header.tsx             # Barra de navegación superior
    ├── InicioView.tsx         # Dashboard
    ├── RegistroView.tsx       # Tabla histórica con filtros
    ├── AjustesView.tsx        # Configuración
    ├── NuevaEntradaModal.tsx  # Modal crear ingreso/gasto
    ├── NuevaCategoriaModal.tsx# Modal crear categoría/subcategoría
    ├── ChangePasswordModal.tsx# Modal cambiar contraseña
    └── HelpModal.tsx          # Modal de ayuda
```

### 6.1 Flujo de datos

1. **Carga inicial**: `App.tsx` monta y llama en paralelo a `fetchCategories()`, `fetchMovements()`, `fetchPreferences()`
2. **Categorías y preferencias** se almacenan en estado de App y se pasan como props
3. **Movimientos** se almacenan en estado de App (carga inicial sin filtros)
4. **Al crear/eliminar** un movimiento o categoría, se llama a la API y se actualiza el estado local
5. **Al cambiar preferencias** (moneda, formato), se llama a `POST /api/preferences.php`. Los campos de título/subtítulo tienen botón "Guardar cambios" explícito.

### 6.2 Normalización

Las funciones `normalizeMovement()` y `normalizeCategory()` convierten los campos snake_case de la API a camelCase del frontend.

## 7. Despliegue en Hostalia

### 7.1 Estructura en el servidor

```
/public_html/
└── conta/
    ├── index.html
    ├── assets/
    │   ├── index-*.js
    │   └── index-*.css
    ├── api/
    │   ├── config.php
    │   ├── schema.sql
    │   ├── categories.php
    │   ├── subcategories.php
    │   ├── movements.php
    │   ├── stats.php
    │   ├── preferences.php
    │   ├── export.php
    │   └── import.php
    └── .htaccess
```

### 7.2 Proceso de despliegue

1. `npm run build` → genera `dist/`
2. Subir contenido de `dist/` a `public_html/conta/`
3. Subir carpeta `api/` a `public_html/conta/api/`
4. Ejecutar `api/schema.sql` en phpMyAdmin o consola MySQL
5. Acceder a `https://jramirez.eu/conta/`

**Migraciones automáticas:** Al usarse por primera vez, algunos endpoints añaden columnas faltantes (`app_title`, `app_subtitle` en `conta_preferences`) o eliminan columnas obsoletas (`code` en `conta_categories`).

## 8. Estado de las funcionalidades

| Funcionalidad | Estado |
|---|---|
| Dashboard con saldo, resumen dinámico por mes/año | ✅ Datos reales, mes actual dinámico |
| Registrar ingreso/gasto con categorías | ✅ API movements |
| Tabla histórica con filtros y paginación | ✅ API movements |
| Saldo acumulado dinámico | ✅ Calculado en frontend |
| Gestión de categorías y subcategorías (sin código) | ✅ API categories (crear/editar nombre, icono y color) |
| Preferencias (moneda, fecha, contraste, título, subtítulo) | ✅ API preferences (POST) |
| Exportar CSV (UTF-8 BOM, separador `;`) | ✅ API export |
| Importar CSV (UTF-8 BOM, separador `;`) | ✅ API import |
| Copia de seguridad JSON | ✅ Frontend (datos en memoria) |
| Toast notifications | ✅ |
| Cambio de contraseña | ✅ |
| Modal de ayuda | ✅ |
| Diseño responsive | ✅ |
| Histórico 12 meses con datos reales | ✅ |
| Editar movimientos | ❌ Pendiente |
| Multiusuario / autenticación | ❌ Pendiente |

## 9. Tabla de actualización de movimientos (migraciones masivas)

Para actualizaciones masivas de movimientos se usa una tabla de reglas. Cada fila describe un filtro de selección y los valores finales a aplicar.

| Filtro Categoría | Filtro Subcategoría | Filtro descripción | Categoría final | Subcategoría final | Descripción final |
|---|---|---|---|---|---|
| `Bloque5` | `Gasto` | `*mercadona*` | `Bloque5` | `Comida` | `Mercadona` |

### Semántica

- **Filtro Categoría / Filtro Subcategoría**: coincidencia exacta por nombre.
- **Filtro descripción**: opcional. Si se omite, se seleccionan todos los movimientos de la categoría/subcategoría inicial. Si se indica, admite varias alternativas separadas por `OR` (insensible a mayúsculas) y cada una usa `*` como comodín: `*luz* OR *repsol*` busca descripciones que contengan "luz" o "repsol".
- **Categoría final / Subcategoría final**: nombre destino. Se resuelven a sus IDs en BD; si la subcategoría no existe en la categoría final se crea automáticamente.
- **Descripción final**: opcional. Si se omite, se conserva la descripción original. Si se indica, se sustituye; el marcador `#mes` se reemplaza por el literal del mes de la fecha del movimiento (enero, febrero, …).

### Endpoint

`POST /conta/api/maintenance.php` recibe el JSON `{ filter_category, filter_subcategory, filter_description, final_category, final_subcategory, final_description, preview }`. Con `preview: true` devuelve `{ preview, total, movements }` sin modificar nada; con `preview: false` aplica los cambios en una transacción y devuelve `{ preview: false, updated, created_subcategories }`. El formulario se encuentra en la pestaña "Mantenimiento de Movimientos" de Ajustes (componente `MantenimientoMovimientos.tsx`).

## 10. Configuración

- Base Vite: `/conta/`
- API base: `/conta/api/`
- Conexión MySQL: `api/config.php`
- Todas las consultas usan PDO con prepared statements
