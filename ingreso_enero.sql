-- =====================================================
-- ENERO 2026 - Ingresos diarios por medio de pago
-- Categoria: 'Ventas'  |  131 movimientos de tipo 'ingreso'
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

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-01', c.id, s.id, 'Venta VISA 01/01', 'ingreso', 640.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-01', c.id, s.id, 'Venta SHOP 01/01', 'ingreso', 507.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-01', c.id, s.id, 'Venta UBER 01/01', 'ingreso', 475.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-01', c.id, s.id, 'Venta GLOVO 01/01', 'ingreso', 271.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-01', c.id, s.id, 'Venta EFECTIVO 01/01', 'ingreso', 566.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-02', c.id, s.id, 'Venta VISA 02/01', 'ingreso', 1065.33
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-02', c.id, s.id, 'Venta SHOP 02/01', 'ingreso', 597.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-02', c.id, s.id, 'Venta UBER 02/01', 'ingreso', 394.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-02', c.id, s.id, 'Venta GLOVO 02/01', 'ingreso', 590.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-02', c.id, s.id, 'Venta EFECTIVO 02/01', 'ingreso', 138.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-03', c.id, s.id, 'Venta VISA 03/01', 'ingreso', 1065.52
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-03', c.id, s.id, 'Venta SHOP 03/01', 'ingreso', 442.01
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-03', c.id, s.id, 'Venta UBER 03/01', 'ingreso', 296.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-03', c.id, s.id, 'Venta GLOVO 03/01', 'ingreso', 571.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-03', c.id, s.id, 'Venta EFECTIVO 03/01', 'ingreso', 319.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-04', c.id, s.id, 'Venta VISA 04/01', 'ingreso', 492.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-04', c.id, s.id, 'Venta SHOP 04/01', 'ingreso', 496.09
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-04', c.id, s.id, 'Venta UBER 04/01', 'ingreso', 467.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-04', c.id, s.id, 'Venta GLOVO 04/01', 'ingreso', 629.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-04', c.id, s.id, 'Venta EFECTIVO 04/01', 'ingreso', 265.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-05', c.id, s.id, 'Venta VISA 05/01', 'ingreso', 1072.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-05', c.id, s.id, 'Venta SHOP 05/01', 'ingreso', 857.08
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-05', c.id, s.id, 'Venta UBER 05/01', 'ingreso', 360.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-05', c.id, s.id, 'Venta GLOVO 05/01', 'ingreso', 170.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-05', c.id, s.id, 'Venta EFECTIVO 05/01', 'ingreso', 480.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-06', c.id, s.id, 'Venta VISA 06/01', 'ingreso', 567.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-06', c.id, s.id, 'Venta SHOP 06/01', 'ingreso', 173.47
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-06', c.id, s.id, 'Venta GLOVO 06/01', 'ingreso', 328.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-06', c.id, s.id, 'Venta EFECTIVO 06/01', 'ingreso', 326.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-07', c.id, s.id, 'Venta VISA 07/01', 'ingreso', 82.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-07', c.id, s.id, 'Venta SHOP 07/01', 'ingreso', 381.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-07', c.id, s.id, 'Venta UBER 07/01', 'ingreso', 322.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-07', c.id, s.id, 'Venta GLOVO 07/01', 'ingreso', 132.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-07', c.id, s.id, 'Venta EFECTIVO 07/01', 'ingreso', 26.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-09', c.id, s.id, 'Venta VISA 09/01', 'ingreso', 817.97
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-09', c.id, s.id, 'Venta SHOP 09/01', 'ingreso', 802.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-09', c.id, s.id, 'Venta UBER 09/01', 'ingreso', 416.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-09', c.id, s.id, 'Venta GLOVO 09/01', 'ingreso', 800.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-09', c.id, s.id, 'Venta EFECTIVO 09/01', 'ingreso', 729.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-10', c.id, s.id, 'Venta VISA 10/01', 'ingreso', 927.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-10', c.id, s.id, 'Venta SHOP 10/01', 'ingreso', 601.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-10', c.id, s.id, 'Venta UBER 10/01', 'ingreso', 354.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-10', c.id, s.id, 'Venta GLOVO 10/01', 'ingreso', 655.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-10', c.id, s.id, 'Venta EFECTIVO 10/01', 'ingreso', 375.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-11', c.id, s.id, 'Venta VISA 11/01', 'ingreso', 355.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-11', c.id, s.id, 'Venta SHOP 11/01', 'ingreso', 838.61
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-11', c.id, s.id, 'Venta UBER 11/01', 'ingreso', 615.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-11', c.id, s.id, 'Venta GLOVO 11/01', 'ingreso', 672.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-11', c.id, s.id, 'Venta EFECTIVO 11/01', 'ingreso', 207.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-12', c.id, s.id, 'Venta VISA 12/01', 'ingreso', 123.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-12', c.id, s.id, 'Venta SHOP 12/01', 'ingreso', 112.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-12', c.id, s.id, 'Venta UBER 12/01', 'ingreso', 260.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-12', c.id, s.id, 'Venta GLOVO 12/01', 'ingreso', 349.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-12', c.id, s.id, 'Venta EFECTIVO 12/01', 'ingreso', 53.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-14', c.id, s.id, 'Venta VISA 14/01', 'ingreso', 406.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-14', c.id, s.id, 'Venta EFECTIVO 14/01', 'ingreso', 100.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-15', c.id, s.id, 'Venta VISA 15/01', 'ingreso', 429.78
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-15', c.id, s.id, 'Venta SHOP 15/01', 'ingreso', 241.72
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-15', c.id, s.id, 'Venta UBER 15/01', 'ingreso', 270.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-15', c.id, s.id, 'Venta GLOVO 15/01', 'ingreso', 554.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-15', c.id, s.id, 'Venta EFECTIVO 15/01', 'ingreso', 88.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-16', c.id, s.id, 'Venta VISA 16/01', 'ingreso', 973.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-16', c.id, s.id, 'Venta SHOP 16/01', 'ingreso', 737.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-16', c.id, s.id, 'Venta UBER 16/01', 'ingreso', 480.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-16', c.id, s.id, 'Venta GLOVO 16/01', 'ingreso', 770.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-16', c.id, s.id, 'Venta EFECTIVO 16/01', 'ingreso', 449.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-17', c.id, s.id, 'Venta VISA 17/01', 'ingreso', 832.18
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-17', c.id, s.id, 'Venta SHOP 17/01', 'ingreso', 406.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-17', c.id, s.id, 'Venta UBER 17/01', 'ingreso', 298.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-17', c.id, s.id, 'Venta GLOVO 17/01', 'ingreso', 960.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-17', c.id, s.id, 'Venta EFECTIVO 17/01', 'ingreso', 976.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-18', c.id, s.id, 'Venta VISA 18/01', 'ingreso', 496.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-18', c.id, s.id, 'Venta SHOP 18/01', 'ingreso', 527.53
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-18', c.id, s.id, 'Venta UBER 18/01', 'ingreso', 147.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-18', c.id, s.id, 'Venta GLOVO 18/01', 'ingreso', 485.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-18', c.id, s.id, 'Venta EFECTIVO 18/01', 'ingreso', 239.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-19', c.id, s.id, 'Venta VISA 19/01', 'ingreso', 197.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-19', c.id, s.id, 'Venta SHOP 19/01', 'ingreso', 196.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-19', c.id, s.id, 'Venta UBER 19/01', 'ingreso', 244.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-19', c.id, s.id, 'Venta GLOVO 19/01', 'ingreso', 249.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-19', c.id, s.id, 'Venta EFECTIVO 19/01', 'ingreso', 55.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-21', c.id, s.id, 'Venta VISA 21/01', 'ingreso', 229.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-21', c.id, s.id, 'Venta SHOP 21/01', 'ingreso', 241.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-21', c.id, s.id, 'Venta UBER 21/01', 'ingreso', 121.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-21', c.id, s.id, 'Venta GLOVO 21/01', 'ingreso', 189.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-21', c.id, s.id, 'Venta EFECTIVO 21/01', 'ingreso', 63.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-22', c.id, s.id, 'Venta VISA 22/01', 'ingreso', 543.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-22', c.id, s.id, 'Venta SHOP 22/01', 'ingreso', 287.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-22', c.id, s.id, 'Venta UBER 22/01', 'ingreso', 160.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-22', c.id, s.id, 'Venta GLOVO 22/01', 'ingreso', 348.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-22', c.id, s.id, 'Venta EFECTIVO 22/01', 'ingreso', 177.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-23', c.id, s.id, 'Venta VISA 23/01', 'ingreso', 519.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-23', c.id, s.id, 'Venta SHOP 23/01', 'ingreso', 596.84
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-23', c.id, s.id, 'Venta UBER 23/01', 'ingreso', 635.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-23', c.id, s.id, 'Venta GLOVO 23/01', 'ingreso', 800.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-23', c.id, s.id, 'Venta EFECTIVO 23/01', 'ingreso', 433.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-24', c.id, s.id, 'Venta VISA 24/01', 'ingreso', 1178.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-24', c.id, s.id, 'Venta SHOP 24/01', 'ingreso', 1235.19
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-24', c.id, s.id, 'Venta UBER 24/01', 'ingreso', 509.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-24', c.id, s.id, 'Venta GLOVO 24/01', 'ingreso', 764.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-24', c.id, s.id, 'Venta EFECTIVO 24/01', 'ingreso', 382.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-25', c.id, s.id, 'Venta VISA 25/01', 'ingreso', 407.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-25', c.id, s.id, 'Venta SHOP 25/01', 'ingreso', 217.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-25', c.id, s.id, 'Venta UBER 25/01', 'ingreso', 324.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-25', c.id, s.id, 'Venta GLOVO 25/01', 'ingreso', 454.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-25', c.id, s.id, 'Venta EFECTIVO 25/01', 'ingreso', 396.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-26', c.id, s.id, 'Venta VISA 26/01', 'ingreso', 459.22
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-26', c.id, s.id, 'Venta SHOP 26/01', 'ingreso', 232.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-26', c.id, s.id, 'Venta UBER 26/01', 'ingreso', 238.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-26', c.id, s.id, 'Venta GLOVO 26/01', 'ingreso', 254.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-26', c.id, s.id, 'Venta EFECTIVO 26/01', 'ingreso', 133.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-28', c.id, s.id, 'Venta VISA 28/01', 'ingreso', 328.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-28', c.id, s.id, 'Venta SHOP 28/01', 'ingreso', 169.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-28', c.id, s.id, 'Venta UBER 28/01', 'ingreso', 175.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-28', c.id, s.id, 'Venta GLOVO 28/01', 'ingreso', 273.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-28', c.id, s.id, 'Venta EFECTIVO 28/01', 'ingreso', 129.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-29', c.id, s.id, 'Venta VISA 29/01', 'ingreso', 342.68
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-29', c.id, s.id, 'Venta SHOP 29/01', 'ingreso', 402.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-29', c.id, s.id, 'Venta UBER 29/01', 'ingreso', 61.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-29', c.id, s.id, 'Venta GLOVO 29/01', 'ingreso', 420.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-29', c.id, s.id, 'Venta EFECTIVO 29/01', 'ingreso', 78.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-30', c.id, s.id, 'Venta VISA 30/01', 'ingreso', 1110.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-30', c.id, s.id, 'Venta SHOP 30/01', 'ingreso', 888.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-30', c.id, s.id, 'Venta UBER 30/01', 'ingreso', 490.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-30', c.id, s.id, 'Venta GLOVO 30/01', 'ingreso', 712.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-30', c.id, s.id, 'Venta EFECTIVO 30/01', 'ingreso', 322.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-31', c.id, s.id, 'Venta VISA 31/01', 'ingreso', 1021.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-31', c.id, s.id, 'Venta SHOP 31/01', 'ingreso', 1159.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-31', c.id, s.id, 'Venta UBER 31/01', 'ingreso', 402.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-31', c.id, s.id, 'Venta GLOVO 31/01', 'ingreso', 480.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-01-31', c.id, s.id, 'Venta EFECTIVO 31/01', 'ingreso', 411.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

