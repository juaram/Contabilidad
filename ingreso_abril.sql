-- =====================================================
-- ABRIL 2026 - Ingresos diarios por medio de pago
-- Categoria: 'Ventas'  |  139 movimientos de tipo 'ingreso'
-- Las subcategorias y la categoria se crean si no existen (busqueda por nombre).
-- =====================================================

INSERT INTO conta_categories (name, icon, color_bg, color_text, sort_order)
SELECT 'Ventas', 'storefront', 'bg-primary-fixed', 'text-on-primary-fixed', 100
WHERE NOT EXISTS (SELECT 1 FROM conta_categories WHERE name = 'Ventas');

INSERT INTO conta_subcategories (category_id, name, active)
SELECT c.id, 'VISA', 1 FROM conta_categories c
WHERE c.name = 'Ventas'
  AND NOT EXISTS (SELECT 1 FROM conta_subcategories s WHERE s.category_id = c.id AND s.name = 'VISA');

INSERT INTO conta_subcategories (category_id, name, active)
SELECT c.id, 'SHOP', 1 FROM conta_categories c
WHERE c.name = 'Ventas'
  AND NOT EXISTS (SELECT 1 FROM conta_subcategories s WHERE s.category_id = c.id AND s.name = 'SHOP');

INSERT INTO conta_subcategories (category_id, name, active)
SELECT c.id, 'UBER', 1 FROM conta_categories c
WHERE c.name = 'Ventas'
  AND NOT EXISTS (SELECT 1 FROM conta_subcategories s WHERE s.category_id = c.id AND s.name = 'UBER');

INSERT INTO conta_subcategories (category_id, name, active)
SELECT c.id, 'GLOVO', 1 FROM conta_categories c
WHERE c.name = 'Ventas'
  AND NOT EXISTS (SELECT 1 FROM conta_subcategories s WHERE s.category_id = c.id AND s.name = 'GLOVO');

INSERT INTO conta_subcategories (category_id, name, active)
SELECT c.id, 'EFECTIVO', 1 FROM conta_categories c
WHERE c.name = 'Ventas'
  AND NOT EXISTS (SELECT 1 FROM conta_subcategories s WHERE s.category_id = c.id AND s.name = 'EFECTIVO');

INSERT INTO conta_subcategories (category_id, name, active)
SELECT c.id, 'PASSO DE CUINAR', 1 FROM conta_categories c
WHERE c.name = 'Ventas'
  AND NOT EXISTS (SELECT 1 FROM conta_subcategories s WHERE s.category_id = c.id AND s.name = 'PASSO DE CUINAR');

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-01', c.id, s.id, 'Venta VISA 01/04', 'ingreso', 743.11
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-01', c.id, s.id, 'Venta SHOP 01/04', 'ingreso', 401.67
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-01', c.id, s.id, 'Venta UBER 01/04', 'ingreso', 363.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-01', c.id, s.id, 'Venta EFECTIVO 01/04', 'ingreso', 223.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-01', c.id, s.id, 'Venta PASSO DE CUINAR 01/04', 'ingreso', 154.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-02', c.id, s.id, 'Venta VISA 02/04', 'ingreso', 762.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-02', c.id, s.id, 'Venta SHOP 02/04', 'ingreso', 889.34
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-02', c.id, s.id, 'Venta UBER 02/04', 'ingreso', 257.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-02', c.id, s.id, 'Venta EFECTIVO 02/04', 'ingreso', 91.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-02', c.id, s.id, 'Venta PASSO DE CUINAR 02/04', 'ingreso', 301.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-03', c.id, s.id, 'Venta VISA 03/04', 'ingreso', 774.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-03', c.id, s.id, 'Venta SHOP 03/04', 'ingreso', 507.42
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-03', c.id, s.id, 'Venta UBER 03/04', 'ingreso', 175.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-03', c.id, s.id, 'Venta EFECTIVO 03/04', 'ingreso', 280.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-03', c.id, s.id, 'Venta PASSO DE CUINAR 03/04', 'ingreso', 209.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-04', c.id, s.id, 'Venta VISA 04/04', 'ingreso', 671.83
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-04', c.id, s.id, 'Venta SHOP 04/04', 'ingreso', 451.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-04', c.id, s.id, 'Venta UBER 04/04', 'ingreso', 418.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-04', c.id, s.id, 'Venta EFECTIVO 04/04', 'ingreso', 258.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-04', c.id, s.id, 'Venta PASSO DE CUINAR 04/04', 'ingreso', 112.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-05', c.id, s.id, 'Venta VISA 05/04', 'ingreso', 967.26
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-05', c.id, s.id, 'Venta SHOP 05/04', 'ingreso', 645.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-05', c.id, s.id, 'Venta UBER 05/04', 'ingreso', 367.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-05', c.id, s.id, 'Venta EFECTIVO 05/04', 'ingreso', 317.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-05', c.id, s.id, 'Venta PASSO DE CUINAR 05/04', 'ingreso', 184.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-06', c.id, s.id, 'Venta VISA 06/04', 'ingreso', 386.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-06', c.id, s.id, 'Venta SHOP 06/04', 'ingreso', 472.52
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-06', c.id, s.id, 'Venta UBER 06/04', 'ingreso', 454.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-06', c.id, s.id, 'Venta EFECTIVO 06/04', 'ingreso', 238.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-06', c.id, s.id, 'Venta PASSO DE CUINAR 06/04', 'ingreso', 338.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-08', c.id, s.id, 'Venta VISA 08/04', 'ingreso', 520.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-08', c.id, s.id, 'Venta SHOP 08/04', 'ingreso', 245.56
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-08', c.id, s.id, 'Venta UBER 08/04', 'ingreso', 324.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-08', c.id, s.id, 'Venta EFECTIVO 08/04', 'ingreso', 9.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-08', c.id, s.id, 'Venta PASSO DE CUINAR 08/04', 'ingreso', 134.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-09', c.id, s.id, 'Venta VISA 09/04', 'ingreso', 539.71
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-09', c.id, s.id, 'Venta SHOP 09/04', 'ingreso', 199.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-09', c.id, s.id, 'Venta UBER 09/04', 'ingreso', 296.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-09', c.id, s.id, 'Venta EFECTIVO 09/04', 'ingreso', 403.17
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-09', c.id, s.id, 'Venta PASSO DE CUINAR 09/04', 'ingreso', 78.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-10', c.id, s.id, 'Venta VISA 10/04', 'ingreso', 981.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-10', c.id, s.id, 'Venta SHOP 10/04', 'ingreso', 713.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-10', c.id, s.id, 'Venta UBER 10/04', 'ingreso', 464.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-10', c.id, s.id, 'Venta EFECTIVO 10/04', 'ingreso', 212.77
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-10', c.id, s.id, 'Venta PASSO DE CUINAR 10/04', 'ingreso', 299.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-11', c.id, s.id, 'Venta VISA 11/04', 'ingreso', 1395.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-11', c.id, s.id, 'Venta SHOP 11/04', 'ingreso', 1041.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-11', c.id, s.id, 'Venta UBER 11/04', 'ingreso', 533.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-11', c.id, s.id, 'Venta EFECTIVO 11/04', 'ingreso', 319.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-11', c.id, s.id, 'Venta PASSO DE CUINAR 11/04', 'ingreso', 276.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-12', c.id, s.id, 'Venta VISA 12/04', 'ingreso', 498.69
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-12', c.id, s.id, 'Venta SHOP 12/04', 'ingreso', 404.33
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-12', c.id, s.id, 'Venta UBER 12/04', 'ingreso', 343.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-12', c.id, s.id, 'Venta EFECTIVO 12/04', 'ingreso', 223.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-12', c.id, s.id, 'Venta PASSO DE CUINAR 12/04', 'ingreso', 204.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-13', c.id, s.id, 'Venta VISA 13/04', 'ingreso', 137.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-13', c.id, s.id, 'Venta SHOP 13/04', 'ingreso', 123.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-13', c.id, s.id, 'Venta UBER 13/04', 'ingreso', 35.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-13', c.id, s.id, 'Venta EFECTIVO 13/04', 'ingreso', 63.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-13', c.id, s.id, 'Venta PASSO DE CUINAR 13/04', 'ingreso', 41.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-15', c.id, s.id, 'Venta VISA 15/04', 'ingreso', 420.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-15', c.id, s.id, 'Venta SHOP 15/04', 'ingreso', 338.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-15', c.id, s.id, 'Venta UBER 15/04', 'ingreso', 100.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-15', c.id, s.id, 'Venta EFECTIVO 15/04', 'ingreso', 2.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-15', c.id, s.id, 'Venta PASSO DE CUINAR 15/04', 'ingreso', 94.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-16', c.id, s.id, 'Venta VISA 16/04', 'ingreso', 196.08
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-16', c.id, s.id, 'Venta SHOP 16/04', 'ingreso', 283.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-16', c.id, s.id, 'Venta UBER 16/04', 'ingreso', 47.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-16', c.id, s.id, 'Venta EFECTIVO 16/04', 'ingreso', 297.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-16', c.id, s.id, 'Venta PASSO DE CUINAR 16/04', 'ingreso', 75.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-17', c.id, s.id, 'Venta VISA 17/04', 'ingreso', 841.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-17', c.id, s.id, 'Venta SHOP 17/04', 'ingreso', 978.11
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-17', c.id, s.id, 'Venta UBER 17/04', 'ingreso', 247.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-17', c.id, s.id, 'Venta EFECTIVO 17/04', 'ingreso', 414.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-17', c.id, s.id, 'Venta PASSO DE CUINAR 17/04', 'ingreso', 177.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-18', c.id, s.id, 'Venta VISA 18/04', 'ingreso', 1481.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-18', c.id, s.id, 'Venta SHOP 18/04', 'ingreso', 800.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-18', c.id, s.id, 'Venta UBER 18/04', 'ingreso', 681.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-18', c.id, s.id, 'Venta EFECTIVO 18/04', 'ingreso', 330.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-18', c.id, s.id, 'Venta PASSO DE CUINAR 18/04', 'ingreso', 392.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-19', c.id, s.id, 'Venta VISA 19/04', 'ingreso', 465.07
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-19', c.id, s.id, 'Venta SHOP 19/04', 'ingreso', 605.93
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-19', c.id, s.id, 'Venta UBER 19/04', 'ingreso', 508.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-19', c.id, s.id, 'Venta EFECTIVO 19/04', 'ingreso', 216.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-19', c.id, s.id, 'Venta PASSO DE CUINAR 19/04', 'ingreso', 111.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-20', c.id, s.id, 'Venta VISA 20/04', 'ingreso', 270.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-20', c.id, s.id, 'Venta SHOP 20/04', 'ingreso', 209.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-20', c.id, s.id, 'Venta UBER 20/04', 'ingreso', 102.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-20', c.id, s.id, 'Venta EFECTIVO 20/04', 'ingreso', 61.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-20', c.id, s.id, 'Venta PASSO DE CUINAR 20/04', 'ingreso', 53.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-21', c.id, s.id, 'Venta VISA 21/04', 'ingreso', 346.88
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-21', c.id, s.id, 'Venta SHOP 21/04', 'ingreso', 89.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-21', c.id, s.id, 'Venta UBER 21/04', 'ingreso', 139.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-21', c.id, s.id, 'Venta EFECTIVO 21/04', 'ingreso', 174.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-22', c.id, s.id, 'Venta VISA 22/04', 'ingreso', 434.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-22', c.id, s.id, 'Venta SHOP 22/04', 'ingreso', 289.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-22', c.id, s.id, 'Venta UBER 22/04', 'ingreso', 360.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-22', c.id, s.id, 'Venta EFECTIVO 22/04', 'ingreso', 173.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-22', c.id, s.id, 'Venta PASSO DE CUINAR 22/04', 'ingreso', 32.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-23', c.id, s.id, 'Venta VISA 23/04', 'ingreso', 554.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-23', c.id, s.id, 'Venta SHOP 23/04', 'ingreso', 719.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-23', c.id, s.id, 'Venta UBER 23/04', 'ingreso', 158.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-23', c.id, s.id, 'Venta EFECTIVO 23/04', 'ingreso', 190.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-23', c.id, s.id, 'Venta PASSO DE CUINAR 23/04', 'ingreso', 39.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-24', c.id, s.id, 'Venta VISA 24/04', 'ingreso', 665.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-24', c.id, s.id, 'Venta SHOP 24/04', 'ingreso', 1141.21
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-24', c.id, s.id, 'Venta UBER 24/04', 'ingreso', 580.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-24', c.id, s.id, 'Venta EFECTIVO 24/04', 'ingreso', 366.71
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-24', c.id, s.id, 'Venta PASSO DE CUINAR 24/04', 'ingreso', 297.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-25', c.id, s.id, 'Venta VISA 25/04', 'ingreso', 1011.58
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-25', c.id, s.id, 'Venta SHOP 25/04', 'ingreso', 1190.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-25', c.id, s.id, 'Venta UBER 25/04', 'ingreso', 382.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-25', c.id, s.id, 'Venta EFECTIVO 25/04', 'ingreso', 282.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-25', c.id, s.id, 'Venta PASSO DE CUINAR 25/04', 'ingreso', 181.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-26', c.id, s.id, 'Venta VISA 26/04', 'ingreso', 615.72
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-26', c.id, s.id, 'Venta SHOP 26/04', 'ingreso', 380.03
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-26', c.id, s.id, 'Venta UBER 26/04', 'ingreso', 343.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-26', c.id, s.id, 'Venta EFECTIVO 26/04', 'ingreso', 277.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-26', c.id, s.id, 'Venta PASSO DE CUINAR 26/04', 'ingreso', 154.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-27', c.id, s.id, 'Venta VISA 27/04', 'ingreso', 320.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-27', c.id, s.id, 'Venta SHOP 27/04', 'ingreso', 201.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-27', c.id, s.id, 'Venta UBER 27/04', 'ingreso', 98.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-27', c.id, s.id, 'Venta EFECTIVO 27/04', 'ingreso', 181.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-27', c.id, s.id, 'Venta PASSO DE CUINAR 27/04', 'ingreso', 119.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-28', c.id, s.id, 'Venta VISA 28/04', 'ingreso', 395.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-28', c.id, s.id, 'Venta SHOP 28/04', 'ingreso', 381.98
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-28', c.id, s.id, 'Venta UBER 28/04', 'ingreso', 95.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-28', c.id, s.id, 'Venta EFECTIVO 28/04', 'ingreso', 38.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-28', c.id, s.id, 'Venta PASSO DE CUINAR 28/04', 'ingreso', 495.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-29', c.id, s.id, 'Venta VISA 29/04', 'ingreso', 441.98
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-29', c.id, s.id, 'Venta SHOP 29/04', 'ingreso', 281.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-29', c.id, s.id, 'Venta UBER 29/04', 'ingreso', 244.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-29', c.id, s.id, 'Venta EFECTIVO 29/04', 'ingreso', 131.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-29', c.id, s.id, 'Venta PASSO DE CUINAR 29/04', 'ingreso', 237.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-30', c.id, s.id, 'Venta VISA 30/04', 'ingreso', 1171.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-30', c.id, s.id, 'Venta SHOP 30/04', 'ingreso', 545.57
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-30', c.id, s.id, 'Venta UBER 30/04', 'ingreso', 148.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-30', c.id, s.id, 'Venta EFECTIVO 30/04', 'ingreso', 132.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-04-30', c.id, s.id, 'Venta PASSO DE CUINAR 30/04', 'ingreso', 228.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

