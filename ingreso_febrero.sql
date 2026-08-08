-- =====================================================
-- FEBRERO 2026 - Ingresos diarios por medio de pago
-- Categoria: 'Ventas'  |  125 movimientos de tipo 'ingreso'
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
SELECT '2026-02-01', c.id, s.id, 'Venta VISA 01/02', 'ingreso', 583.86
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-01', c.id, s.id, 'Venta SHOP 01/02', 'ingreso', 380.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-01', c.id, s.id, 'Venta UBER 01/02', 'ingreso', 351.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-01', c.id, s.id, 'Venta GLOVO 01/02', 'ingreso', 510.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-01', c.id, s.id, 'Venta EFECTIVO 01/02', 'ingreso', 262.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-02', c.id, s.id, 'Venta VISA 02/02', 'ingreso', 247.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-02', c.id, s.id, 'Venta SHOP 02/02', 'ingreso', 140.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-02', c.id, s.id, 'Venta UBER 02/02', 'ingreso', 132.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-02', c.id, s.id, 'Venta GLOVO 02/02', 'ingreso', 298.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-02', c.id, s.id, 'Venta EFECTIVO 02/02', 'ingreso', 187.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-04', c.id, s.id, 'Venta VISA 04/02', 'ingreso', 213.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-04', c.id, s.id, 'Venta SHOP 04/02', 'ingreso', 169.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-04', c.id, s.id, 'Venta UBER 04/02', 'ingreso', 178.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-04', c.id, s.id, 'Venta GLOVO 04/02', 'ingreso', 355.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-04', c.id, s.id, 'Venta EFECTIVO 04/02', 'ingreso', 185.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-05', c.id, s.id, 'Venta VISA 05/02', 'ingreso', 373.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-05', c.id, s.id, 'Venta SHOP 05/02', 'ingreso', 226.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-05', c.id, s.id, 'Venta UBER 05/02', 'ingreso', 33.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-05', c.id, s.id, 'Venta GLOVO 05/02', 'ingreso', 256.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-05', c.id, s.id, 'Venta EFECTIVO 05/02', 'ingreso', 86.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-06', c.id, s.id, 'Venta VISA 06/02', 'ingreso', 1080.03
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-06', c.id, s.id, 'Venta SHOP 06/02', 'ingreso', 1044.59
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-06', c.id, s.id, 'Venta UBER 06/02', 'ingreso', 359.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-06', c.id, s.id, 'Venta GLOVO 06/02', 'ingreso', 540.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-06', c.id, s.id, 'Venta EFECTIVO 06/02', 'ingreso', 168.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-07', c.id, s.id, 'Venta VISA 07/02', 'ingreso', 760.46
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-07', c.id, s.id, 'Venta SHOP 07/02', 'ingreso', 984.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-07', c.id, s.id, 'Venta UBER 07/02', 'ingreso', 734.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-07', c.id, s.id, 'Venta GLOVO 07/02', 'ingreso', 835.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-07', c.id, s.id, 'Venta EFECTIVO 07/02', 'ingreso', 469.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-08', c.id, s.id, 'Venta VISA 08/02', 'ingreso', 676.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-08', c.id, s.id, 'Venta SHOP 08/02', 'ingreso', 585.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-08', c.id, s.id, 'Venta UBER 08/02', 'ingreso', 163.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-08', c.id, s.id, 'Venta GLOVO 08/02', 'ingreso', 446.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-08', c.id, s.id, 'Venta EFECTIVO 08/02', 'ingreso', 198.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-09', c.id, s.id, 'Venta VISA 09/02', 'ingreso', 172.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-09', c.id, s.id, 'Venta SHOP 09/02', 'ingreso', 107.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-09', c.id, s.id, 'Venta UBER 09/02', 'ingreso', 224.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-09', c.id, s.id, 'Venta GLOVO 09/02', 'ingreso', 317.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-09', c.id, s.id, 'Venta EFECTIVO 09/02', 'ingreso', 74.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-10', c.id, s.id, 'Venta VISA 10/02', 'ingreso', 335.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-10', c.id, s.id, 'Venta SHOP 10/02', 'ingreso', 44.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-10', c.id, s.id, 'Venta UBER 10/02', 'ingreso', 142.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-10', c.id, s.id, 'Venta GLOVO 10/02', 'ingreso', 336.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-10', c.id, s.id, 'Venta EFECTIVO 10/02', 'ingreso', 125.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-12', c.id, s.id, 'Venta VISA 12/02', 'ingreso', 362.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-12', c.id, s.id, 'Venta SHOP 12/02', 'ingreso', 317.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-12', c.id, s.id, 'Venta UBER 12/02', 'ingreso', 129.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-12', c.id, s.id, 'Venta GLOVO 12/02', 'ingreso', 460.15
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-12', c.id, s.id, 'Venta EFECTIVO 12/02', 'ingreso', 170.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-13', c.id, s.id, 'Venta VISA 13/02', 'ingreso', 1131.32
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-13', c.id, s.id, 'Venta SHOP 13/02', 'ingreso', 981.76
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-13', c.id, s.id, 'Venta UBER 13/02', 'ingreso', 191.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-13', c.id, s.id, 'Venta GLOVO 13/02', 'ingreso', 548.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-13', c.id, s.id, 'Venta EFECTIVO 13/02', 'ingreso', 236.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-14', c.id, s.id, 'Venta VISA 14/02', 'ingreso', 1264.56
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-14', c.id, s.id, 'Venta SHOP 14/02', 'ingreso', 1007.27
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-14', c.id, s.id, 'Venta UBER 14/02', 'ingreso', 438.45
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-14', c.id, s.id, 'Venta GLOVO 14/02', 'ingreso', 477.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-14', c.id, s.id, 'Venta EFECTIVO 14/02', 'ingreso', 368.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-15', c.id, s.id, 'Venta VISA 15/02', 'ingreso', 469.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-15', c.id, s.id, 'Venta SHOP 15/02', 'ingreso', 468.25
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-15', c.id, s.id, 'Venta UBER 15/02', 'ingreso', 151.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-15', c.id, s.id, 'Venta GLOVO 15/02', 'ingreso', 613.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-15', c.id, s.id, 'Venta EFECTIVO 15/02', 'ingreso', 339.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-16', c.id, s.id, 'Venta VISA 16/02', 'ingreso', 345.50
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-16', c.id, s.id, 'Venta SHOP 16/02', 'ingreso', 89.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-16', c.id, s.id, 'Venta UBER 16/02', 'ingreso', 188.55
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-16', c.id, s.id, 'Venta GLOVO 16/02', 'ingreso', 291.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-16', c.id, s.id, 'Venta EFECTIVO 16/02', 'ingreso', 135.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-18', c.id, s.id, 'Venta VISA 18/02', 'ingreso', 308.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-18', c.id, s.id, 'Venta SHOP 18/02', 'ingreso', 99.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-18', c.id, s.id, 'Venta UBER 18/02', 'ingreso', 110.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-18', c.id, s.id, 'Venta GLOVO 18/02', 'ingreso', 56.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-18', c.id, s.id, 'Venta EFECTIVO 18/02', 'ingreso', 27.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-19', c.id, s.id, 'Venta VISA 19/02', 'ingreso', 588.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-19', c.id, s.id, 'Venta SHOP 19/02', 'ingreso', 272.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-19', c.id, s.id, 'Venta UBER 19/02', 'ingreso', 187.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-19', c.id, s.id, 'Venta GLOVO 19/02', 'ingreso', 312.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-19', c.id, s.id, 'Venta EFECTIVO 19/02', 'ingreso', 408.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-19', c.id, s.id, 'Venta PASSO DE CUINAR 19/02', 'ingreso', 61.30
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-20', c.id, s.id, 'Venta VISA 20/02', 'ingreso', 1159.81
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-20', c.id, s.id, 'Venta SHOP 20/02', 'ingreso', 1088.92
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-20', c.id, s.id, 'Venta UBER 20/02', 'ingreso', 177.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-20', c.id, s.id, 'Venta GLOVO 20/02', 'ingreso', 1110.35
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-20', c.id, s.id, 'Venta EFECTIVO 20/02', 'ingreso', 350.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-20', c.id, s.id, 'Venta PASSO DE CUINAR 20/02', 'ingreso', 122.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-21', c.id, s.id, 'Venta VISA 21/02', 'ingreso', 1223.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-21', c.id, s.id, 'Venta SHOP 21/02', 'ingreso', 674.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-21', c.id, s.id, 'Venta UBER 21/02', 'ingreso', 549.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-21', c.id, s.id, 'Venta GLOVO 21/02', 'ingreso', 1050.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-21', c.id, s.id, 'Venta EFECTIVO 21/02', 'ingreso', 349.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-22', c.id, s.id, 'Venta VISA 22/02', 'ingreso', 419.43
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-22', c.id, s.id, 'Venta SHOP 22/02', 'ingreso', 415.16
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-22', c.id, s.id, 'Venta UBER 22/02', 'ingreso', 140.60
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-22', c.id, s.id, 'Venta GLOVO 22/02', 'ingreso', 624.75
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-22', c.id, s.id, 'Venta EFECTIVO 22/02', 'ingreso', 371.90
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-22', c.id, s.id, 'Venta PASSO DE CUINAR 22/02', 'ingreso', 95.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-23', c.id, s.id, 'Venta VISA 23/02', 'ingreso', 160.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-23', c.id, s.id, 'Venta SHOP 23/02', 'ingreso', 121.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-23', c.id, s.id, 'Venta UBER 23/02', 'ingreso', 84.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-23', c.id, s.id, 'Venta GLOVO 23/02', 'ingreso', 115.65
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-23', c.id, s.id, 'Venta EFECTIVO 23/02', 'ingreso', 144.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-25', c.id, s.id, 'Venta VISA 25/02', 'ingreso', 288.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-25', c.id, s.id, 'Venta SHOP 25/02', 'ingreso', 114.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-25', c.id, s.id, 'Venta UBER 25/02', 'ingreso', 223.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-25', c.id, s.id, 'Venta GLOVO 25/02', 'ingreso', 232.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-25', c.id, s.id, 'Venta EFECTIVO 25/02', 'ingreso', 109.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-25', c.id, s.id, 'Venta PASSO DE CUINAR 25/02', 'ingreso', 24.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-26', c.id, s.id, 'Venta VISA 26/02', 'ingreso', 460.00
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-26', c.id, s.id, 'Venta SHOP 26/02', 'ingreso', 124.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-26', c.id, s.id, 'Venta UBER 26/02', 'ingreso', 139.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-26', c.id, s.id, 'Venta GLOVO 26/02', 'ingreso', 315.85
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-26', c.id, s.id, 'Venta EFECTIVO 26/02', 'ingreso', 217.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-27', c.id, s.id, 'Venta VISA 27/02', 'ingreso', 1551.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-27', c.id, s.id, 'Venta SHOP 27/02', 'ingreso', 997.48
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-27', c.id, s.id, 'Venta UBER 27/02', 'ingreso', 433.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-27', c.id, s.id, 'Venta GLOVO 27/02', 'ingreso', 631.40
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-27', c.id, s.id, 'Venta EFECTIVO 27/02', 'ingreso', 199.20
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-28', c.id, s.id, 'Venta VISA 28/02', 'ingreso', 1338.80
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'VISA'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-28', c.id, s.id, 'Venta SHOP 28/02', 'ingreso', 634.19
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'SHOP'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-28', c.id, s.id, 'Venta UBER 28/02', 'ingreso', 256.10
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'UBER'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-28', c.id, s.id, 'Venta GLOVO 28/02', 'ingreso', 1003.95
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'GLOVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-28', c.id, s.id, 'Venta EFECTIVO 28/02', 'ingreso', 216.70
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'EFECTIVO'
WHERE c.name = 'Ventas';

INSERT INTO conta_movements (date, category_id, subcategory_id, description, type, amount)
SELECT '2026-02-28', c.id, s.id, 'Venta PASSO DE CUINAR 28/02', 'ingreso', 148.05
FROM conta_categories c
JOIN conta_subcategories s ON s.category_id = c.id AND s.name = 'PASSO DE CUINAR'
WHERE c.name = 'Ventas';

