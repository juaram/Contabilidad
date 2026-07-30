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
| `code` | VARCHAR(3) NOT NULL | Código abreviado (ALM, VIV...) |
| `name` | VARCHAR(100) NOT NULL | Nombre visible |
| `icon` | VARCHAR(50) NOT NULL | Icono Material Symbols |
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
| `updated_at` | TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

## 5. API REST — Endpoints PHP

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/conta/api/categories.php` | Listar categorías con subcategorías y contador de movimientos |
| POST | `/conta/api/categories.php` | Crear categoría |
| DELETE | `/conta/api/categories.php?id=X` | Eliminar (solo si no tiene movimientos) |
| POST | `/conta/api/subcategories.php` | Crear subcategoría |
| DELETE | `/conta/api/subcategories.php?id=X` | Eliminar subcategoría |
| GET | `/conta/api/movements.php?year=&month=&category_id=&search=&page=` | Listar movimientos (filtros + paginación + totales) |
| POST | `/conta/api/movements.php` | Crear movimiento |
| DELETE | `/conta/api/movements.php?id=X` | Eliminar movimiento |
| GET | `/conta/api/stats.php` | Dashboard: saldo, totales, histórico 6 meses, últimos 3 movimientos |
| GET | `/conta/api/preferences.php` | Obtener preferencias |
| PUT | `/conta/api/preferences.php` | Actualizar preferencias |
| GET | `/conta/api/export.php?format=csv` | Exportar CSV |

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
    └── HelpModal.tsx          # Modal de ayuda
```

### 6.1 Flujo de datos

1. **Carga inicial**: `App.tsx` monta y llama en paralelo a `fetchCategories()`, `fetchMovements()`, `fetchPreferences()`
2. **Muestra loading** mientras se resuelven las promesas
3. **Categorías y preferencias** se almacenan en estado de App y se pasan como props
4. **Movimientos** se almacenan en estado de App (carga inicial sin filtros)
5. **Al crear/eliminar** un movimiento o categoría, se llama a la API y se actualiza el estado local
6. **Al cambiar preferencias**, se llama a `PUT /api/preferences.php`

### 6.2 Normalización

Las funciones `normalizeMovement()` y `normalizeCategory()` convierten los campos snake_case de la API (ej: `category_code`, `color_bg`) a camelCase del frontend (`categoryCode`, `colorBgClass`).

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
    │   └── export.php
    └── .htaccess
```

### 7.2 Proceso de despliegue

1. `npm run build` → genera `dist/` con `base: '/conta/'`
2. Subir contenido de `dist/` a `public_html/conta/`
3. Subir carpeta `api/` a `public_html/conta/`
4. Ejecutar `api/schema.sql` en phpMyAdmin o consola MySQL
5. Acceder a `https://jramirez.eu/conta/`

## 8. Estado de las funcionalidades

| Funcionalidad | Estado |
|---|---|
| Dashboard con saldo y resumen mensual | ✅ API stats |
| Registrar ingreso/gasto con categorías | ✅ API movements |
| Tabla histórica con filtros y paginación | ✅ API movements |
| Saldo acumulado dinámico | ✅ Calculado en backend |
| Gestión de categorías y subcategorías | ✅ API categories |
| Preferencias (moneda, fecha, contraste) | ✅ API preferences |
| Exportar CSV | ✅ API export |
| Copia de seguridad JSON | ✅ Frontend (datos en memoria) |
| Estados de carga (loading spinner) | ✅ Implementado |
| Toast notifications | ✅ Mantenido |
| Modal de ayuda | ✅ Mantenido |
| Diseño responsive | ✅ Mantenido |
| Importar datos | ⚠️ Parcial (placeholder) |
| Editar movimientos | ❌ Pendiente |
| Multiusuario / autenticación | ❌ Pendiente |
| Gráficos con datos reales | 🔄 Pendiente (conectar a API stats) |

## 9. Configuración

- Base Vite: `/conta/`
- API base: `/conta/api/`
- Conexión MySQL: `api/config.php`
- Todas las consultas usan PDO con prepared statements
