-- =====================================================
-- JULIO 2026 - Ingresos diarios por medio de pago
-- Categoria: 'Ventas'  |  152 movimientos de tipo 'ingreso'
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
SELECT '2026-07-01', c.id, s.id, 'Venta VISA 01/07', 'ingreso', 446.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-01', c.id, s.id, 'Venta SHOP 01/07', 'ingreso', 63.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-01', c.id, s.id, 'Venta UBER 01/07', 'ingreso', 88.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-01', c.id, s.id, 'Venta EFECTIVO 01/07', 'ingreso', 71.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-01', c.id, s.id, 'Venta PASSO DE CUINAR 01/07', 'ingreso', 84.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-02', c.id, s.id, 'Venta VISA 02/07', 'ingreso', 304.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-02', c.id, s.id, 'Venta SHOP 02/07', 'ingreso', 160.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-02', c.id, s.id, 'Venta UBER 02/07', 'ingreso', 134.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-02', c.id, s.id, 'Venta EFECTIVO 02/07', 'ingreso', 277.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-02', c.id, s.id, 'Venta PASSO DE CUINAR 02/07', 'ingreso', 319.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-03', c.id, s.id, 'Venta VISA 03/07', 'ingreso', 537.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-03', c.id, s.id, 'Venta SHOP 03/07', 'ingreso', 828.98
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-03', c.id, s.id, 'Venta UBER 03/07', 'ingreso', 377.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-03', c.id, s.id, 'Venta EFECTIVO 03/07', 'ingreso', 287.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-03', c.id, s.id, 'Venta PASSO DE CUINAR 03/07', 'ingreso', 242.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-04', c.id, s.id, 'Venta VISA 04/07', 'ingreso', 954.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-04', c.id, s.id, 'Venta SHOP 04/07', 'ingreso', 740.22
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-04', c.id, s.id, 'Venta UBER 04/07', 'ingreso', 368.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-04', c.id, s.id, 'Venta EFECTIVO 04/07', 'ingreso', 314.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-04', c.id, s.id, 'Venta PASSO DE CUINAR 04/07', 'ingreso', 115.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-05', c.id, s.id, 'Venta VISA 05/07', 'ingreso', 446.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-05', c.id, s.id, 'Venta SHOP 05/07', 'ingreso', 619.21
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-05', c.id, s.id, 'Venta UBER 05/07', 'ingreso', 333.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-05', c.id, s.id, 'Venta EFECTIVO 05/07', 'ingreso', 308.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-05', c.id, s.id, 'Venta PASSO DE CUINAR 05/07', 'ingreso', 175.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-06', c.id, s.id, 'Venta VISA 06/07', 'ingreso', 423.34
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-06', c.id, s.id, 'Venta SHOP 06/07', 'ingreso', 256.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-06', c.id, s.id, 'Venta UBER 06/07', 'ingreso', 36.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-06', c.id, s.id, 'Venta EFECTIVO 06/07', 'ingreso', 152.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-06', c.id, s.id, 'Venta PASSO DE CUINAR 06/07', 'ingreso', 122.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-07', c.id, s.id, 'Venta VISA 07/07', 'ingreso', 423.34
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-07', c.id, s.id, 'Venta SHOP 07/07', 'ingreso', 256.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-07', c.id, s.id, 'Venta UBER 07/07', 'ingreso', 36.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-07', c.id, s.id, 'Venta EFECTIVO 07/07', 'ingreso', 152.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-07', c.id, s.id, 'Venta PASSO DE CUINAR 07/07', 'ingreso', 122.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-08', c.id, s.id, 'Venta VISA 08/07', 'ingreso', 352.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-08', c.id, s.id, 'Venta SHOP 08/07', 'ingreso', 286.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-08', c.id, s.id, 'Venta UBER 08/07', 'ingreso', 67.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-08', c.id, s.id, 'Venta EFECTIVO 08/07', 'ingreso', 192.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-08', c.id, s.id, 'Venta PASSO DE CUINAR 08/07', 'ingreso', 50.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-09', c.id, s.id, 'Venta VISA 09/07', 'ingreso', 490.84
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-09', c.id, s.id, 'Venta SHOP 09/07', 'ingreso', 288.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-09', c.id, s.id, 'Venta UBER 09/07', 'ingreso', 150.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-09', c.id, s.id, 'Venta EFECTIVO 09/07', 'ingreso', 254.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-09', c.id, s.id, 'Venta PASSO DE CUINAR 09/07', 'ingreso', 149.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-10', c.id, s.id, 'Venta VISA 10/07', 'ingreso', 940.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-10', c.id, s.id, 'Venta SHOP 10/07', 'ingreso', 1427.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-10', c.id, s.id, 'Venta UBER 10/07', 'ingreso', 539.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-10', c.id, s.id, 'Venta EFECTIVO 10/07', 'ingreso', 258.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-10', c.id, s.id, 'Venta PASSO DE CUINAR 10/07', 'ingreso', 139.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-11', c.id, s.id, 'Venta VISA 11/07', 'ingreso', 841.76
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-11', c.id, s.id, 'Venta SHOP 11/07', 'ingreso', 601.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-11', c.id, s.id, 'Venta UBER 11/07', 'ingreso', 267.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-11', c.id, s.id, 'Venta EFECTIVO 11/07', 'ingreso', 403.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-11', c.id, s.id, 'Venta PASSO DE CUINAR 11/07', 'ingreso', 107.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-12', c.id, s.id, 'Venta VISA 12/07', 'ingreso', 414.53
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-12', c.id, s.id, 'Venta SHOP 12/07', 'ingreso', 495.72
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-12', c.id, s.id, 'Venta UBER 12/07', 'ingreso', 198.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-12', c.id, s.id, 'Venta EFECTIVO 12/07', 'ingreso', 232.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-12', c.id, s.id, 'Venta PASSO DE CUINAR 12/07', 'ingreso', 311.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-13', c.id, s.id, 'Venta VISA 13/07', 'ingreso', 198.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-13', c.id, s.id, 'Venta SHOP 13/07', 'ingreso', 176.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-13', c.id, s.id, 'Venta UBER 13/07', 'ingreso', 172.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-13', c.id, s.id, 'Venta EFECTIVO 13/07', 'ingreso', 15.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-13', c.id, s.id, 'Venta PASSO DE CUINAR 13/07', 'ingreso', 94.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-14', c.id, s.id, 'Venta VISA 14/07', 'ingreso', 437.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-14', c.id, s.id, 'Venta SHOP 14/07', 'ingreso', 576.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-14', c.id, s.id, 'Venta UBER 14/07', 'ingreso', 266.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-14', c.id, s.id, 'Venta EFECTIVO 14/07', 'ingreso', 145.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-14', c.id, s.id, 'Venta PASSO DE CUINAR 14/07', 'ingreso', 202.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-15', c.id, s.id, 'Venta VISA 15/07', 'ingreso', 466.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-15', c.id, s.id, 'Venta SHOP 15/07', 'ingreso', 405.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-15', c.id, s.id, 'Venta UBER 15/07', 'ingreso', 44.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-15', c.id, s.id, 'Venta EFECTIVO 15/07', 'ingreso', 160.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-15', c.id, s.id, 'Venta PASSO DE CUINAR 15/07', 'ingreso', 111.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-16', c.id, s.id, 'Venta VISA 16/07', 'ingreso', 365.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-16', c.id, s.id, 'Venta SHOP 16/07', 'ingreso', 530.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-16', c.id, s.id, 'Venta UBER 16/07', 'ingreso', 32.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-16', c.id, s.id, 'Venta EFECTIVO 16/07', 'ingreso', 181.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-16', c.id, s.id, 'Venta PASSO DE CUINAR 16/07', 'ingreso', 138.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-17', c.id, s.id, 'Venta VISA 17/07', 'ingreso', 584.66
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-17', c.id, s.id, 'Venta SHOP 17/07', 'ingreso', 642.23
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-17', c.id, s.id, 'Venta UBER 17/07', 'ingreso', 313.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-17', c.id, s.id, 'Venta EFECTIVO 17/07', 'ingreso', 174.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-17', c.id, s.id, 'Venta PASSO DE CUINAR 17/07', 'ingreso', 286.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-18', c.id, s.id, 'Venta VISA 18/07', 'ingreso', 808.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-18', c.id, s.id, 'Venta SHOP 18/07', 'ingreso', 701.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-18', c.id, s.id, 'Venta UBER 18/07', 'ingreso', 664.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-18', c.id, s.id, 'Venta EFECTIVO 18/07', 'ingreso', 282.56
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-18', c.id, s.id, 'Venta PASSO DE CUINAR 18/07', 'ingreso', 427.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-19', c.id, s.id, 'Venta VISA 19/07', 'ingreso', 526.73
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-19', c.id, s.id, 'Venta SHOP 19/07', 'ingreso', 763.03
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-19', c.id, s.id, 'Venta UBER 19/07', 'ingreso', 286.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-19', c.id, s.id, 'Venta EFECTIVO 19/07', 'ingreso', 307.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-19', c.id, s.id, 'Venta PASSO DE CUINAR 19/07', 'ingreso', 289.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-20', c.id, s.id, 'Venta VISA 20/07', 'ingreso', 256.34
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-20', c.id, s.id, 'Venta SHOP 20/07', 'ingreso', 186.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-20', c.id, s.id, 'Venta UBER 20/07', 'ingreso', 215.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-20', c.id, s.id, 'Venta EFECTIVO 20/07', 'ingreso', 41.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-20', c.id, s.id, 'Venta PASSO DE CUINAR 20/07', 'ingreso', 139.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-21', c.id, s.id, 'Venta VISA 21/07', 'ingreso', 133.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-21', c.id, s.id, 'Venta SHOP 21/07', 'ingreso', 108.23
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-21', c.id, s.id, 'Venta EFECTIVO 21/07', 'ingreso', 183.36
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-21', c.id, s.id, 'Venta PASSO DE CUINAR 21/07', 'ingreso', 93.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-22', c.id, s.id, 'Venta VISA 22/07', 'ingreso', 312.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-22', c.id, s.id, 'Venta SHOP 22/07', 'ingreso', 110.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-22', c.id, s.id, 'Venta UBER 22/07', 'ingreso', 58.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-22', c.id, s.id, 'Venta EFECTIVO 22/07', 'ingreso', 104.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-23', c.id, s.id, 'Venta VISA 23/07', 'ingreso', 338.82
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-23', c.id, s.id, 'Venta SHOP 23/07', 'ingreso', 170.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-23', c.id, s.id, 'Venta UBER 23/07', 'ingreso', 136.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-23', c.id, s.id, 'Venta EFECTIVO 23/07', 'ingreso', 120.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-24', c.id, s.id, 'Venta VISA 24/07', 'ingreso', 854.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-24', c.id, s.id, 'Venta SHOP 24/07', 'ingreso', 498.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-24', c.id, s.id, 'Venta UBER 24/07', 'ingreso', 318.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-24', c.id, s.id, 'Venta EFECTIVO 24/07', 'ingreso', 331.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-24', c.id, s.id, 'Venta PASSO DE CUINAR 24/07', 'ingreso', 203.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-25', c.id, s.id, 'Venta VISA 25/07', 'ingreso', 539.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-25', c.id, s.id, 'Venta SHOP 25/07', 'ingreso', 746.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-25', c.id, s.id, 'Venta UBER 25/07', 'ingreso', 700.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-25', c.id, s.id, 'Venta EFECTIVO 25/07', 'ingreso', 300.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-25', c.id, s.id, 'Venta PASSO DE CUINAR 25/07', 'ingreso', 520.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-26', c.id, s.id, 'Venta VISA 26/07', 'ingreso', 586.32
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-26', c.id, s.id, 'Venta SHOP 26/07', 'ingreso', 491.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-26', c.id, s.id, 'Venta UBER 26/07', 'ingreso', 334.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-26', c.id, s.id, 'Venta EFECTIVO 26/07', 'ingreso', 259.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-26', c.id, s.id, 'Venta PASSO DE CUINAR 26/07', 'ingreso', 204.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-27', c.id, s.id, 'Venta VISA 27/07', 'ingreso', 369.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-27', c.id, s.id, 'Venta SHOP 27/07', 'ingreso', 134.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-27', c.id, s.id, 'Venta UBER 27/07', 'ingreso', 143.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-27', c.id, s.id, 'Venta EFECTIVO 27/07', 'ingreso', 19.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-27', c.id, s.id, 'Venta PASSO DE CUINAR 27/07', 'ingreso', 101.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-28', c.id, s.id, 'Venta VISA 28/07', 'ingreso', 547.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-28', c.id, s.id, 'Venta SHOP 28/07', 'ingreso', 627.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-28', c.id, s.id, 'Venta UBER 28/07', 'ingreso', 106.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-28', c.id, s.id, 'Venta EFECTIVO 28/07', 'ingreso', 161.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-28', c.id, s.id, 'Venta PASSO DE CUINAR 28/07', 'ingreso', 38.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-29', c.id, s.id, 'Venta VISA 29/07', 'ingreso', 745.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-29', c.id, s.id, 'Venta SHOP 29/07', 'ingreso', 191.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-29', c.id, s.id, 'Venta UBER 29/07', 'ingreso', 281.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-29', c.id, s.id, 'Venta EFECTIVO 29/07', 'ingreso', 168.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-29', c.id, s.id, 'Venta PASSO DE CUINAR 29/07', 'ingreso', 90.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-30', c.id, s.id, 'Venta VISA 30/07', 'ingreso', 346.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-30', c.id, s.id, 'Venta SHOP 30/07', 'ingreso', 235.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-30', c.id, s.id, 'Venta UBER 30/07', 'ingreso', 133.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-30', c.id, s.id, 'Venta EFECTIVO 30/07', 'ingreso', 157.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-30', c.id, s.id, 'Venta PASSO DE CUINAR 30/07', 'ingreso', 74.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-31', c.id, s.id, 'Venta VISA 31/07', 'ingreso', 1116.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-31', c.id, s.id, 'Venta SHOP 31/07', 'ingreso', 633.18
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-31', c.id, s.id, 'Venta UBER 31/07', 'ingreso', 588.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-31', c.id, s.id, 'Venta EFECTIVO 31/07', 'ingreso', 230.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-07-31', c.id, s.id, 'Venta PASSO DE CUINAR 31/07', 'ingreso', 270.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

