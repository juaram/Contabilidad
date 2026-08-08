-- =====================================================
-- MAYO 2026 - Ingresos diarios por medio de pago
-- Categoria: 'Ventas'  |  153 movimientos de tipo 'ingreso'
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
SELECT '2026-05-01', c.id, s.id, 'Venta VISA 01/05', 'ingreso', 813.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-01', c.id, s.id, 'Venta SHOP 01/05', 'ingreso', 1001.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-01', c.id, s.id, 'Venta UBER 01/05', 'ingreso', 658.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-01', c.id, s.id, 'Venta EFECTIVO 01/05', 'ingreso', 380.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-01', c.id, s.id, 'Venta PASSO DE CUINAR 01/05', 'ingreso', 223.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-02', c.id, s.id, 'Venta VISA 02/05', 'ingreso', 951.57
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-02', c.id, s.id, 'Venta SHOP 02/05', 'ingreso', 688.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-02', c.id, s.id, 'Venta UBER 02/05', 'ingreso', 512.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-02', c.id, s.id, 'Venta EFECTIVO 02/05', 'ingreso', 260.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-02', c.id, s.id, 'Venta PASSO DE CUINAR 02/05', 'ingreso', 365.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-03', c.id, s.id, 'Venta VISA 03/05', 'ingreso', 583.52
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-03', c.id, s.id, 'Venta SHOP 03/05', 'ingreso', 320.62
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-03', c.id, s.id, 'Venta UBER 03/05', 'ingreso', 314.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-03', c.id, s.id, 'Venta EFECTIVO 03/05', 'ingreso', 184.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-03', c.id, s.id, 'Venta PASSO DE CUINAR 03/05', 'ingreso', 196.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-04', c.id, s.id, 'Venta VISA 04/05', 'ingreso', 357.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-04', c.id, s.id, 'Venta SHOP 04/05', 'ingreso', 100.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-04', c.id, s.id, 'Venta UBER 04/05', 'ingreso', 200.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-04', c.id, s.id, 'Venta EFECTIVO 04/05', 'ingreso', 105.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-04', c.id, s.id, 'Venta PASSO DE CUINAR 04/05', 'ingreso', 98.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-05', c.id, s.id, 'Venta VISA 05/05', 'ingreso', 283.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-05', c.id, s.id, 'Venta SHOP 05/05', 'ingreso', 93.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-05', c.id, s.id, 'Venta UBER 05/05', 'ingreso', 95.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-05', c.id, s.id, 'Venta EFECTIVO 05/05', 'ingreso', 60.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-05', c.id, s.id, 'Venta PASSO DE CUINAR 05/05', 'ingreso', 31.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-06', c.id, s.id, 'Venta VISA 06/05', 'ingreso', 294.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-06', c.id, s.id, 'Venta SHOP 06/05', 'ingreso', 120.09
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-06', c.id, s.id, 'Venta UBER 06/05', 'ingreso', 283.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-06', c.id, s.id, 'Venta EFECTIVO 06/05', 'ingreso', 33.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-06', c.id, s.id, 'Venta PASSO DE CUINAR 06/05', 'ingreso', 235.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-06', c.id, s.id, 'Venta TRANSFERENCIA 06/05', 'ingreso', 30.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'TRANSFERENCIA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-07', c.id, s.id, 'Venta VISA 07/05', 'ingreso', 328.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-07', c.id, s.id, 'Venta SHOP 07/05', 'ingreso', 308.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-07', c.id, s.id, 'Venta UBER 07/05', 'ingreso', 283.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-07', c.id, s.id, 'Venta EFECTIVO 07/05', 'ingreso', 109.41
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-07', c.id, s.id, 'Venta PASSO DE CUINAR 07/05', 'ingreso', 116.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-08', c.id, s.id, 'Venta VISA 08/05', 'ingreso', 1608.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-08', c.id, s.id, 'Venta SHOP 08/05', 'ingreso', 1150.23
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-08', c.id, s.id, 'Venta UBER 08/05', 'ingreso', 545.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-08', c.id, s.id, 'Venta EFECTIVO 08/05', 'ingreso', 365.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-08', c.id, s.id, 'Venta PASSO DE CUINAR 08/05', 'ingreso', 198.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-09', c.id, s.id, 'Venta VISA 09/05', 'ingreso', 1287.79
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-09', c.id, s.id, 'Venta SHOP 09/05', 'ingreso', 1139.81
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-09', c.id, s.id, 'Venta UBER 09/05', 'ingreso', 718.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-09', c.id, s.id, 'Venta EFECTIVO 09/05', 'ingreso', 223.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-09', c.id, s.id, 'Venta PASSO DE CUINAR 09/05', 'ingreso', 349.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-10', c.id, s.id, 'Venta VISA 10/05', 'ingreso', 381.52
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-10', c.id, s.id, 'Venta SHOP 10/05', 'ingreso', 851.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-10', c.id, s.id, 'Venta UBER 10/05', 'ingreso', 636.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-10', c.id, s.id, 'Venta EFECTIVO 10/05', 'ingreso', 170.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-10', c.id, s.id, 'Venta PASSO DE CUINAR 10/05', 'ingreso', 156.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-11', c.id, s.id, 'Venta VISA 11/05', 'ingreso', 199.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-11', c.id, s.id, 'Venta SHOP 11/05', 'ingreso', 220.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-11', c.id, s.id, 'Venta EFECTIVO 11/05', 'ingreso', 113.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-11', c.id, s.id, 'Venta PASSO DE CUINAR 11/05', 'ingreso', 106.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-12', c.id, s.id, 'Venta VISA 12/05', 'ingreso', 320.32
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-12', c.id, s.id, 'Venta SHOP 12/05', 'ingreso', 156.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-12', c.id, s.id, 'Venta UBER 12/05', 'ingreso', 120.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-12', c.id, s.id, 'Venta EFECTIVO 12/05', 'ingreso', 78.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-12', c.id, s.id, 'Venta PASSO DE CUINAR 12/05', 'ingreso', 17.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-13', c.id, s.id, 'Venta VISA 13/05', 'ingreso', 494.18
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-13', c.id, s.id, 'Venta SHOP 13/05', 'ingreso', 292.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-13', c.id, s.id, 'Venta UBER 13/05', 'ingreso', 157.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-13', c.id, s.id, 'Venta EFECTIVO 13/05', 'ingreso', 26.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-14', c.id, s.id, 'Venta VISA 14/05', 'ingreso', 491.94
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-14', c.id, s.id, 'Venta SHOP 14/05', 'ingreso', 685.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-14', c.id, s.id, 'Venta UBER 14/05', 'ingreso', 218.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-14', c.id, s.id, 'Venta EFECTIVO 14/05', 'ingreso', 164.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-14', c.id, s.id, 'Venta PASSO DE CUINAR 14/05', 'ingreso', 115.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-15', c.id, s.id, 'Venta VISA 15/05', 'ingreso', 925.98
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-15', c.id, s.id, 'Venta SHOP 15/05', 'ingreso', 1222.32
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-15', c.id, s.id, 'Venta UBER 15/05', 'ingreso', 124.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-15', c.id, s.id, 'Venta EFECTIVO 15/05', 'ingreso', 205.32
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-15', c.id, s.id, 'Venta PASSO DE CUINAR 15/05', 'ingreso', 313.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-16', c.id, s.id, 'Venta VISA 16/05', 'ingreso', 1462.12
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-16', c.id, s.id, 'Venta SHOP 16/05', 'ingreso', 1093.83
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-16', c.id, s.id, 'Venta UBER 16/05', 'ingreso', 199.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-16', c.id, s.id, 'Venta EFECTIVO 16/05', 'ingreso', 435.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-16', c.id, s.id, 'Venta PASSO DE CUINAR 16/05', 'ingreso', 107.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-17', c.id, s.id, 'Venta VISA 17/05', 'ingreso', 538.82
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-17', c.id, s.id, 'Venta SHOP 17/05', 'ingreso', 900.96
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-17', c.id, s.id, 'Venta UBER 17/05', 'ingreso', 417.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-17', c.id, s.id, 'Venta EFECTIVO 17/05', 'ingreso', 152.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-17', c.id, s.id, 'Venta PASSO DE CUINAR 17/05', 'ingreso', 89.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-18', c.id, s.id, 'Venta VISA 18/05', 'ingreso', 106.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-18', c.id, s.id, 'Venta SHOP 18/05', 'ingreso', 200.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-18', c.id, s.id, 'Venta UBER 18/05', 'ingreso', 177.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-18', c.id, s.id, 'Venta EFECTIVO 18/05', 'ingreso', 69.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-19', c.id, s.id, 'Venta VISA 19/05', 'ingreso', 187.16
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-19', c.id, s.id, 'Venta SHOP 19/05', 'ingreso', 209.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-19', c.id, s.id, 'Venta UBER 19/05', 'ingreso', 168.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-19', c.id, s.id, 'Venta EFECTIVO 19/05', 'ingreso', 27.34
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-19', c.id, s.id, 'Venta PASSO DE CUINAR 19/05', 'ingreso', 29.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-20', c.id, s.id, 'Venta VISA 20/05', 'ingreso', 300.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-20', c.id, s.id, 'Venta SHOP 20/05', 'ingreso', 237.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-20', c.id, s.id, 'Venta UBER 20/05', 'ingreso', 130.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-20', c.id, s.id, 'Venta EFECTIVO 20/05', 'ingreso', 174.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-20', c.id, s.id, 'Venta PASSO DE CUINAR 20/05', 'ingreso', 279.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-21', c.id, s.id, 'Venta VISA 21/05', 'ingreso', 321.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-21', c.id, s.id, 'Venta SHOP 21/05', 'ingreso', 235.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-21', c.id, s.id, 'Venta UBER 21/05', 'ingreso', 189.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-21', c.id, s.id, 'Venta EFECTIVO 21/05', 'ingreso', 55.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-21', c.id, s.id, 'Venta PASSO DE CUINAR 21/05', 'ingreso', 69.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-22', c.id, s.id, 'Venta VISA 22/05', 'ingreso', 1066.54
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-22', c.id, s.id, 'Venta SHOP 22/05', 'ingreso', 816.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-22', c.id, s.id, 'Venta UBER 22/05', 'ingreso', 484.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-22', c.id, s.id, 'Venta EFECTIVO 22/05', 'ingreso', 409.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-22', c.id, s.id, 'Venta PASSO DE CUINAR 22/05', 'ingreso', 388.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-23', c.id, s.id, 'Venta VISA 23/05', 'ingreso', 1029.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-23', c.id, s.id, 'Venta SHOP 23/05', 'ingreso', 970.43
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-23', c.id, s.id, 'Venta UBER 23/05', 'ingreso', 291.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-23', c.id, s.id, 'Venta EFECTIVO 23/05', 'ingreso', 343.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-23', c.id, s.id, 'Venta PASSO DE CUINAR 23/05', 'ingreso', 398.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-24', c.id, s.id, 'Venta VISA 24/05', 'ingreso', 699.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-24', c.id, s.id, 'Venta SHOP 24/05', 'ingreso', 438.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-24', c.id, s.id, 'Venta UBER 24/05', 'ingreso', 198.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-24', c.id, s.id, 'Venta EFECTIVO 24/05', 'ingreso', 220.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-24', c.id, s.id, 'Venta PASSO DE CUINAR 24/05', 'ingreso', 343.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-25', c.id, s.id, 'Venta VISA 25/05', 'ingreso', 438.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-25', c.id, s.id, 'Venta SHOP 25/05', 'ingreso', 119.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-25', c.id, s.id, 'Venta UBER 25/05', 'ingreso', 194.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-25', c.id, s.id, 'Venta EFECTIVO 25/05', 'ingreso', 104.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-25', c.id, s.id, 'Venta PASSO DE CUINAR 25/05', 'ingreso', 126.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-26', c.id, s.id, 'Venta VISA 26/05', 'ingreso', 237.64
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-26', c.id, s.id, 'Venta SHOP 26/05', 'ingreso', 232.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-26', c.id, s.id, 'Venta UBER 26/05', 'ingreso', 113.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-26', c.id, s.id, 'Venta EFECTIVO 26/05', 'ingreso', 39.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-26', c.id, s.id, 'Venta PASSO DE CUINAR 26/05', 'ingreso', 27.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-27', c.id, s.id, 'Venta VISA 27/05', 'ingreso', 315.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-27', c.id, s.id, 'Venta SHOP 27/05', 'ingreso', 150.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-27', c.id, s.id, 'Venta UBER 27/05', 'ingreso', 193.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-27', c.id, s.id, 'Venta EFECTIVO 27/05', 'ingreso', 71.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-27', c.id, s.id, 'Venta PASSO DE CUINAR 27/05', 'ingreso', 53.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-28', c.id, s.id, 'Venta VISA 28/05', 'ingreso', 560.34
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-28', c.id, s.id, 'Venta SHOP 28/05', 'ingreso', 228.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-28', c.id, s.id, 'Venta UBER 28/05', 'ingreso', 38.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-28', c.id, s.id, 'Venta EFECTIVO 28/05', 'ingreso', 171.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-28', c.id, s.id, 'Venta PASSO DE CUINAR 28/05', 'ingreso', 55.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-29', c.id, s.id, 'Venta VISA 29/05', 'ingreso', 1448.47
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-29', c.id, s.id, 'Venta SHOP 29/05', 'ingreso', 1388.66
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-29', c.id, s.id, 'Venta UBER 29/05', 'ingreso', 458.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-29', c.id, s.id, 'Venta EFECTIVO 29/05', 'ingreso', 339.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-29', c.id, s.id, 'Venta PASSO DE CUINAR 29/05', 'ingreso', 73.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-30', c.id, s.id, 'Venta VISA 30/05', 'ingreso', 747.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-30', c.id, s.id, 'Venta SHOP 30/05', 'ingreso', 839.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-30', c.id, s.id, 'Venta UBER 30/05', 'ingreso', 649.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-30', c.id, s.id, 'Venta EFECTIVO 30/05', 'ingreso', 343.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-30', c.id, s.id, 'Venta PASSO DE CUINAR 30/05', 'ingreso', 486.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-31', c.id, s.id, 'Venta VISA 31/05', 'ingreso', 611.88
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-31', c.id, s.id, 'Venta SHOP 31/05', 'ingreso', 493.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-31', c.id, s.id, 'Venta UBER 31/05', 'ingreso', 293.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-31', c.id, s.id, 'Venta EFECTIVO 31/05', 'ingreso', 148.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-05-31', c.id, s.id, 'Venta PASSO DE CUINAR 31/05', 'ingreso', 227.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

