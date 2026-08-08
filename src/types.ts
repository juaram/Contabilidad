export type MovementType = 'ingreso' | 'gasto';

export interface Movement {
  id: string;
  date: string;
  category_id: string;
  category: string;
  subcategory_id: string | null;
  subcategory: string;
  description: string;
  type: MovementType;
  amount: number;
  balanceAfter?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  active?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  colorBgClass: string;
  colorTextClass: string;
  sortOrder: number;
  subcategories: Subcategory[];
}

export interface UserPreferences {
  currency: string;
  dateFormat: string;
  highContrast: boolean;
  appTitle: string;
  appSubtitle: string;
  listFont: string; // 'sans' | 'code'
  multiRegistro: boolean; // mostrar popup de registro múltiple al añadir ingreso o gasto
  dropdownBg: string; // color de fondo de los desplegables
  dropdownBorder: string; // color del borde de los desplegables
  dropdownBorderWidth: number; // grosor del borde (px)
  dropdownRadius: number; // radio de las esquinas (px)
  dropdownTextColor: string; // color del texto de las opciones de los desplegables
  dropdownRowHeight: number; // altura de cada fila/opción de los desplegables (px)
  showDescription: boolean; // mostrar la columna Descripción en el listado de Registro
  showBalance: boolean; // mostrar la columna Saldo en el listado de Registro
}

export type BudgetType = 'gasto' | 'ingreso';

export interface Budget {
  id: string;
  category_id: string;
  subcategory_id: string | null;
  type: BudgetType;
  year: number;
  month: string; // '00' = recurrente (todos los meses); '13' = anual (importe único para el año); '01'..'12' = mes concreto
  amount: number;
}

export interface FilterState {
  year: number;
  month: string; // 'todos' | '01' | ... | '10'
  category: string;
  subcategory: string;
  searchQuery: string;
}

export interface MonthlyHistory {
  monthName: string;
  year: number;
  income: number;
  expense: number;
}
