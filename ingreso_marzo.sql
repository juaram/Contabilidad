-- =====================================================
-- MARZO 2026 - Ingresos diarios por medio de pago
-- Categoria: 'Ventas'  |  151 movimientos de tipo 'ingreso'
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

INSERT INTO conta_subcategories (category_id, name, active)
SELECT c.id, 'TRANSFERENCIA', 1 FROM conta_categories c
WHERE c.name = 'Ventas'
  AND NOT EXISTS (SELECT 1 FROM conta_subcategories s WHERE s.category_id = c.id AND s.name = 'TRANSFERENCIA');

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-01', c.id, s.id, 'Venta VISA 01/03', 'ingreso', 499.92
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-01', c.id, s.id, 'Venta SHOP 01/03', 'ingreso', 249.78
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-01', c.id, s.id, 'Venta UBER 01/03', 'ingreso', 214.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-01', c.id, s.id, 'Venta GLOVO 01/03', 'ingreso', 595.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-01', c.id, s.id, 'Venta EFECTIVO 01/03', 'ingreso', 299.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-01', c.id, s.id, 'Venta PASSO DE CUINAR 01/03', 'ingreso', 31.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-02', c.id, s.id, 'Venta VISA 02/03', 'ingreso', 304.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-02', c.id, s.id, 'Venta SHOP 02/03', 'ingreso', 481.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-02', c.id, s.id, 'Venta UBER 02/03', 'ingreso', 125.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-02', c.id, s.id, 'Venta GLOVO 02/03', 'ingreso', 115.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-02', c.id, s.id, 'Venta EFECTIVO 02/03', 'ingreso', 42.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-04', c.id, s.id, 'Venta VISA 04/03', 'ingreso', 443.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-04', c.id, s.id, 'Venta SHOP 04/03', 'ingreso', 252.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-04', c.id, s.id, 'Venta UBER 04/03', 'ingreso', 130.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-04', c.id, s.id, 'Venta GLOVO 04/03', 'ingreso', 396.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-04', c.id, s.id, 'Venta EFECTIVO 04/03', 'ingreso', 237.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-05', c.id, s.id, 'Venta VISA 05/03', 'ingreso', 325.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-05', c.id, s.id, 'Venta SHOP 05/03', 'ingreso', 255.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-05', c.id, s.id, 'Venta UBER 05/03', 'ingreso', 152.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-05', c.id, s.id, 'Venta GLOVO 05/03', 'ingreso', 325.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-05', c.id, s.id, 'Venta EFECTIVO 05/03', 'ingreso', 137.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-05', c.id, s.id, 'Venta PASSO DE CUINAR 05/03', 'ingreso', 88.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-06', c.id, s.id, 'Venta VISA 06/03', 'ingreso', 1319.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-06', c.id, s.id, 'Venta SHOP 06/03', 'ingreso', 843.33
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-06', c.id, s.id, 'Venta UBER 06/03', 'ingreso', 529.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-06', c.id, s.id, 'Venta GLOVO 06/03', 'ingreso', 749.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-06', c.id, s.id, 'Venta EFECTIVO 06/03', 'ingreso', 185.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-06', c.id, s.id, 'Venta PASSO DE CUINAR 06/03', 'ingreso', 79.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-07', c.id, s.id, 'Venta VISA 07/03', 'ingreso', 1497.48
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-07', c.id, s.id, 'Venta SHOP 07/03', 'ingreso', 962.09
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-07', c.id, s.id, 'Venta UBER 07/03', 'ingreso', 246.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-07', c.id, s.id, 'Venta GLOVO 07/03', 'ingreso', 607.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-07', c.id, s.id, 'Venta EFECTIVO 07/03', 'ingreso', 485.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-07', c.id, s.id, 'Venta PASSO DE CUINAR 07/03', 'ingreso', 164.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-08', c.id, s.id, 'Venta VISA 08/03', 'ingreso', 449.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-08', c.id, s.id, 'Venta SHOP 08/03', 'ingreso', 299.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-08', c.id, s.id, 'Venta UBER 08/03', 'ingreso', 84.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-08', c.id, s.id, 'Venta GLOVO 08/03', 'ingreso', 684.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-08', c.id, s.id, 'Venta EFECTIVO 08/03', 'ingreso', 167.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-09', c.id, s.id, 'Venta VISA 09/03', 'ingreso', 408.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-09', c.id, s.id, 'Venta SHOP 09/03', 'ingreso', 230.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-09', c.id, s.id, 'Venta UBER 09/03', 'ingreso', 137.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-09', c.id, s.id, 'Venta GLOVO 09/03', 'ingreso', 138.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-09', c.id, s.id, 'Venta EFECTIVO 09/03', 'ingreso', 184.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-09', c.id, s.id, 'Venta PASSO DE CUINAR 09/03', 'ingreso', 51.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-10', c.id, s.id, 'Venta TRANSFERENCIA 10/03', 'ingreso', 327.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'TRANSFERENCIA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-11', c.id, s.id, 'Venta VISA 11/03', 'ingreso', 272.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-11', c.id, s.id, 'Venta SHOP 11/03', 'ingreso', 170.39
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-11', c.id, s.id, 'Venta UBER 11/03', 'ingreso', 87.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-11', c.id, s.id, 'Venta GLOVO 11/03', 'ingreso', 324.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-11', c.id, s.id, 'Venta EFECTIVO 11/03', 'ingreso', 99.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-12', c.id, s.id, 'Venta VISA 12/03', 'ingreso', 321.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-12', c.id, s.id, 'Venta SHOP 12/03', 'ingreso', 213.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-12', c.id, s.id, 'Venta UBER 12/03', 'ingreso', 129.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-12', c.id, s.id, 'Venta GLOVO 12/03', 'ingreso', 393.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-12', c.id, s.id, 'Venta EFECTIVO 12/03', 'ingreso', 126.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-12', c.id, s.id, 'Venta PASSO DE CUINAR 12/03', 'ingreso', 41.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-13', c.id, s.id, 'Venta VISA 13/03', 'ingreso', 925.58
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-13', c.id, s.id, 'Venta SHOP 13/03', 'ingreso', 981.39
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-13', c.id, s.id, 'Venta UBER 13/03', 'ingreso', 305.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-13', c.id, s.id, 'Venta GLOVO 13/03', 'ingreso', 444.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-13', c.id, s.id, 'Venta EFECTIVO 13/03', 'ingreso', 647.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-13', c.id, s.id, 'Venta PASSO DE CUINAR 13/03', 'ingreso', 115.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-14', c.id, s.id, 'Venta VISA 14/03', 'ingreso', 1144.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-14', c.id, s.id, 'Venta SHOP 14/03', 'ingreso', 803.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-14', c.id, s.id, 'Venta UBER 14/03', 'ingreso', 151.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-14', c.id, s.id, 'Venta GLOVO 14/03', 'ingreso', 388.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-14', c.id, s.id, 'Venta EFECTIVO 14/03', 'ingreso', 281.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-14', c.id, s.id, 'Venta PASSO DE CUINAR 14/03', 'ingreso', 116.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-15', c.id, s.id, 'Venta VISA 15/03', 'ingreso', 368.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-15', c.id, s.id, 'Venta SHOP 15/03', 'ingreso', 168.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-15', c.id, s.id, 'Venta UBER 15/03', 'ingreso', 274.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-15', c.id, s.id, 'Venta GLOVO 15/03', 'ingreso', 586.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-15', c.id, s.id, 'Venta EFECTIVO 15/03', 'ingreso', 223.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-15', c.id, s.id, 'Venta PASSO DE CUINAR 15/03', 'ingreso', 155.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-16', c.id, s.id, 'Venta VISA 16/03', 'ingreso', 270.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-16', c.id, s.id, 'Venta SHOP 16/03', 'ingreso', 273.53
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-16', c.id, s.id, 'Venta UBER 16/03', 'ingreso', 65.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-16', c.id, s.id, 'Venta GLOVO 16/03', 'ingreso', 170.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-16', c.id, s.id, 'Venta EFECTIVO 16/03', 'ingreso', 103.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-16', c.id, s.id, 'Venta TRANSFERENCIA 16/03', 'ingreso', 450.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'TRANSFERENCIA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-18', c.id, s.id, 'Venta VISA 18/03', 'ingreso', 399.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-18', c.id, s.id, 'Venta SHOP 18/03', 'ingreso', 225.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-18', c.id, s.id, 'Venta UBER 18/03', 'ingreso', 186.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-18', c.id, s.id, 'Venta GLOVO 18/03', 'ingreso', 386.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-18', c.id, s.id, 'Venta EFECTIVO 18/03', 'ingreso', 58.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-19', c.id, s.id, 'Venta VISA 19/03', 'ingreso', 864.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-19', c.id, s.id, 'Venta SHOP 19/03', 'ingreso', 593.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-19', c.id, s.id, 'Venta UBER 19/03', 'ingreso', 421.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-19', c.id, s.id, 'Venta GLOVO 19/03', 'ingreso', 201.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-19', c.id, s.id, 'Venta EFECTIVO 19/03', 'ingreso', 87.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-19', c.id, s.id, 'Venta PASSO DE CUINAR 19/03', 'ingreso', 84.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-20', c.id, s.id, 'Venta VISA 20/03', 'ingreso', 1034.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-20', c.id, s.id, 'Venta SHOP 20/03', 'ingreso', 999.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-20', c.id, s.id, 'Venta UBER 20/03', 'ingreso', 280.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-20', c.id, s.id, 'Venta GLOVO 20/03', 'ingreso', 312.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-20', c.id, s.id, 'Venta EFECTIVO 20/03', 'ingreso', 431.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-20', c.id, s.id, 'Venta PASSO DE CUINAR 20/03', 'ingreso', 252.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-21', c.id, s.id, 'Venta VISA 21/03', 'ingreso', 1091.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-21', c.id, s.id, 'Venta SHOP 21/03', 'ingreso', 817.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-21', c.id, s.id, 'Venta UBER 21/03', 'ingreso', 391.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-21', c.id, s.id, 'Venta GLOVO 21/03', 'ingreso', 592.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-21', c.id, s.id, 'Venta EFECTIVO 21/03', 'ingreso', 387.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-21', c.id, s.id, 'Venta PASSO DE CUINAR 21/03', 'ingreso', 65.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-22', c.id, s.id, 'Venta VISA 22/03', 'ingreso', 659.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-22', c.id, s.id, 'Venta SHOP 22/03', 'ingreso', 482.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-22', c.id, s.id, 'Venta UBER 22/03', 'ingreso', 174.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-22', c.id, s.id, 'Venta GLOVO 22/03', 'ingreso', 698.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-22', c.id, s.id, 'Venta EFECTIVO 22/03', 'ingreso', 88.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-22', c.id, s.id, 'Venta PASSO DE CUINAR 22/03', 'ingreso', 35.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-23', c.id, s.id, 'Venta VISA 23/03', 'ingreso', 132.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-23', c.id, s.id, 'Venta SHOP 23/03', 'ingreso', 156.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-23', c.id, s.id, 'Venta UBER 23/03', 'ingreso', 123.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-23', c.id, s.id, 'Venta GLOVO 23/03', 'ingreso', 117.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-23', c.id, s.id, 'Venta EFECTIVO 23/03', 'ingreso', 44.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-23', c.id, s.id, 'Venta PASSO DE CUINAR 23/03', 'ingreso', 27.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-25', c.id, s.id, 'Venta VISA 25/03', 'ingreso', 298.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-25', c.id, s.id, 'Venta SHOP 25/03', 'ingreso', 266.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-25', c.id, s.id, 'Venta UBER 25/03', 'ingreso', 141.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-25', c.id, s.id, 'Venta GLOVO 25/03', 'ingreso', 479.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-25', c.id, s.id, 'Venta EFECTIVO 25/03', 'ingreso', 35.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-25', c.id, s.id, 'Venta PASSO DE CUINAR 25/03', 'ingreso', 33.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-26', c.id, s.id, 'Venta VISA 26/03', 'ingreso', 279.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-26', c.id, s.id, 'Venta SHOP 26/03', 'ingreso', 145.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-26', c.id, s.id, 'Venta UBER 26/03', 'ingreso', 14.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-26', c.id, s.id, 'Venta GLOVO 26/03', 'ingreso', 295.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-26', c.id, s.id, 'Venta EFECTIVO 26/03', 'ingreso', 166.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-26', c.id, s.id, 'Venta PASSO DE CUINAR 26/03', 'ingreso', 42.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-27', c.id, s.id, 'Venta VISA 27/03', 'ingreso', 966.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-27', c.id, s.id, 'Venta SHOP 27/03', 'ingreso', 1027.54
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-27', c.id, s.id, 'Venta UBER 27/03', 'ingreso', 615.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-27', c.id, s.id, 'Venta GLOVO 27/03', 'ingreso', 360.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-27', c.id, s.id, 'Venta EFECTIVO 27/03', 'ingreso', 431.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-27', c.id, s.id, 'Venta PASSO DE CUINAR 27/03', 'ingreso', 154.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-28', c.id, s.id, 'Venta VISA 28/03', 'ingreso', 1128.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-28', c.id, s.id, 'Venta SHOP 28/03', 'ingreso', 822.02
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-28', c.id, s.id, 'Venta UBER 28/03', 'ingreso', 443.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-28', c.id, s.id, 'Venta GLOVO 28/03', 'ingreso', 460.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-28', c.id, s.id, 'Venta EFECTIVO 28/03', 'ingreso', 397.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-28', c.id, s.id, 'Venta PASSO DE CUINAR 28/03', 'ingreso', 99.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-29', c.id, s.id, 'Venta VISA 29/03', 'ingreso', 505.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-29', c.id, s.id, 'Venta SHOP 29/03', 'ingreso', 252.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-29', c.id, s.id, 'Venta UBER 29/03', 'ingreso', 460.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-29', c.id, s.id, 'Venta GLOVO 29/03', 'ingreso', 577.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-29', c.id, s.id, 'Venta EFECTIVO 29/03', 'ingreso', 438.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-29', c.id, s.id, 'Venta PASSO DE CUINAR 29/03', 'ingreso', 14.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-30', c.id, s.id, 'Venta VISA 30/03', 'ingreso', 477.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-30', c.id, s.id, 'Venta SHOP 30/03', 'ingreso', 303.43
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-30', c.id, s.id, 'Venta UBER 30/03', 'ingreso', 218.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-30', c.id, s.id, 'Venta EFECTIVO 30/03', 'ingreso', 246.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-03-30', c.id, s.id, 'Venta PASSO DE CUINAR 30/03', 'ingreso', 29.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

