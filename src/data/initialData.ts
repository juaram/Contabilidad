import { Category, Movement, UserPreferences } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-hogar',
    code: 'VIV',
    name: 'Vivienda / Hogar',
    icon: 'home',
    colorBgClass: 'bg-primary-fixed',
    colorTextClass: 'text-on-primary-fixed',
    subcategories: [
      { id: 'sub-luz', name: 'Luz' },
      { id: 'sub-agua', name: 'Agua' },
      { id: 'sub-alquiler', name: 'Alquiler' },
      { id: 'sub-reparaciones', name: 'Reparaciones' }
    ]
  },
  {
    id: 'cat-alimentacion',
    code: 'ALM',
    name: 'Alimentación',
    icon: 'shopping_basket',
    colorBgClass: 'bg-secondary-container',
    colorTextClass: 'text-on-secondary-container',
    subcategories: [
      { id: 'sub-supermercado', name: 'Supermercado' },
      { id: 'sub-carniceria', name: 'Carnicería y Fruta' },
      { id: 'sub-fruteria', name: 'Frutería' },
      { id: 'sub-restaurantes', name: 'Restaurantes' }
    ]
  },
  {
    id: 'cat-salud',
    code: 'SAL',
    name: 'Salud',
    icon: 'medical_services',
    colorBgClass: 'bg-tertiary-fixed-dim',
    colorTextClass: 'text-on-tertiary-fixed-variant',
    subcategories: [
      { id: 'sub-farmacia', name: 'Farmacia' },
      { id: 'sub-medico', name: 'Médico' },
      { id: 'sub-seguro', name: 'Seguro' }
    ]
  },
  {
    id: 'cat-pensiones',
    code: 'ING',
    name: 'Pensiones e Ingresos',
    icon: 'savings',
    colorBgClass: 'bg-secondary-fixed',
    colorTextClass: 'text-on-secondary-fixed-variant',
    subcategories: [
      { id: 'sub-jubilacion', name: 'Pensión' },
      { id: 'sub-otros-ingresos', name: 'Otros Ingresos' }
    ]
  },
  {
    id: 'cat-varios',
    code: 'VAR',
    name: 'Varios y Ocio',
    icon: 'category',
    colorBgClass: 'bg-surface-container-high',
    colorTextClass: 'text-on-surface',
    subcategories: [
      { id: 'sub-transporte', name: 'Transporte' },
      { id: 'sub-farma', name: 'Farma' },
      { id: 'sub-varios', name: 'Varios' }
    ]
  }
];

export const INITIAL_MOVEMENTS: Movement[] = [
  {
    id: 'mov-1',
    date: '2024-05-15',
    category: 'Vivienda',
    categoryCode: 'VIV',
    subcategory: 'Luz',
    description: 'Pago de recibo electricidad - Mayo 2024',
    type: 'gasto',
    amount: 85.50
  },
  {
    id: 'mov-2',
    date: '2024-05-12',
    category: 'Ingresos',
    categoryCode: 'ING',
    subcategory: 'Pensión',
    description: 'Abono Pensión Seguridad Social',
    type: 'ingreso',
    amount: 1150.00
  },
  {
    id: 'mov-3',
    date: '2024-05-10',
    category: 'Alimentación',
    categoryCode: 'ALM',
    subcategory: 'Super',
    description: 'Compra semanal Mercadona',
    type: 'gasto',
    amount: 64.30
  },
  {
    id: 'mov-4',
    date: '2024-05-05',
    category: 'Varios',
    categoryCode: 'VAR',
    subcategory: 'Farma',
    description: 'Medicamentos farmacia central',
    type: 'gasto',
    amount: 12.15
  },
  {
    id: 'mov-5',
    date: '2024-10-13',
    category: 'Pensiones',
    categoryCode: 'ING',
    subcategory: 'Pensión Seguridad Social',
    description: 'Pensión Seguridad Social',
    type: 'ingreso',
    amount: 1450.00
  },
  {
    id: 'mov-6',
    date: '2024-10-12',
    category: 'Alimentación',
    categoryCode: 'ALM',
    subcategory: 'Supermercado',
    description: 'Mercadona Supermercado',
    type: 'gasto',
    amount: 64.20
  },
  {
    id: 'mov-7',
    date: '2024-10-12',
    category: 'Vivienda',
    categoryCode: 'VIV',
    subcategory: 'Luz',
    description: 'Factura Iberdrola',
    type: 'gasto',
    amount: 89.45
  },
  {
    id: 'mov-8',
    date: '2024-10-01',
    category: 'Pensiones',
    categoryCode: 'ING',
    subcategory: 'Pensión',
    description: 'Ingreso nómina mensual',
    type: 'ingreso',
    amount: 650.00
  },
  {
    id: 'mov-9',
    date: '2024-09-28',
    category: 'Vivienda',
    categoryCode: 'VIV',
    subcategory: 'Agua',
    description: 'Recibo mensual Agua',
    type: 'gasto',
    amount: 42.10
  },
  {
    id: 'mov-10',
    date: '2024-09-15',
    category: 'Alimentación',
    categoryCode: 'ALM',
    subcategory: 'Restaurantes',
    description: 'Comida familiar fin de semana',
    type: 'gasto',
    amount: 95.00
  }
];

export const INITIAL_PREFERENCES: UserPreferences = {
  currency: 'Euro (€) - EUR',
  dateFormat: 'DD / MM / AAAA (31/12/2024)',
  highContrast: false,
};
